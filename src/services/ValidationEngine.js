/* ============================================================
   VALIDATION ENGINE — FUTURE-PROOF, AUTO EXPANDS WITH DB
============================================================ */

// Helper to locate rule from DB
function getRuleFromConfig(validationKey, ruleTypes = []) {
  if (!validationKey || !Array.isArray(ruleTypes)) return null;

  const key = validationKey.toLowerCase();

  return (
    ruleTypes.find(
      (r) =>
        r.value?.toLowerCase() === key ||
        r.type?.toLowerCase() === key ||
        r.id?.toString() === validationKey
    ) || null
  );
}

// Built-in handlers
const DEFAULT_RULE_HANDLERS = {
  mandatory: (value, rule, { fieldName }) => {
    const empty =
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    return empty ? `${fieldName} is required` : null;
  },

  pattern: (value, rule, { fieldName }) => {
    if (!value) return null;
    try {
      const re = new RegExp(rule.condition);
      return re.test(value) ? null : `${fieldName} has invalid format`;
    } catch {
      return null;
    }
  },

  email: (value, rule, { fieldName }) => {
    if (!value) return null;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value) ? null : `${fieldName} is not a valid email`;
  },

  numeric: (value, rule, { fieldName }) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} must be numeric`;

    const [minStr, maxStr] = (rule.condition || "").split("-");
    const min = minStr ? Number(minStr) : null;
    const max = maxStr ? Number(maxStr) : null;

    if (min !== null && num < min) return `${fieldName} must be ≥ ${min}`;
    if (max !== null && num > max) return `${fieldName} must be ≤ ${max}`;

    return null;
  },

  date: (value, rule, { fieldName }) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? `${fieldName} is not a valid date` : null;
  },
};

// Auto expanding type → handler map  
const TYPE_TO_HANDLER = {
  required: "mandatory",
  mandatory: "mandatory",

  regex: "pattern",
  pattern: "pattern",

  numeric: "numeric",
  range: "numeric",

  email: "email",

  date: "date",
};

// MAIN ENGINE
const ValidationEngineExport = {
  validate({ template, formData = {}, context = {}, ruleTypes = [] }) {
    const errors = {};
    if (!template?.fields) return { valid: true, errors };

    for (const field of template.fields) {
      if (!field.applicable?.includes("form")) continue;

      const fieldName = field.name;

      // Required
      if (field.required) {
        const msg = DEFAULT_RULE_HANDLERS.mandatory(
          formData[fieldName],
          {},
          { fieldName: field.label }
        );
        if (msg) {
          errors[fieldName] = msg;
          continue;
        }
      }

      const rawValidation = field.validation;
      if (!rawValidation || rawValidation === "none") continue;

      let ruleObj = null;

      // From DB
      if (typeof rawValidation === "string") {
        const rule = getRuleFromConfig(rawValidation, ruleTypes);
        if (!rule) continue;

        ruleObj = {
          type: rule.type?.toLowerCase(),
          condition: rule.condition,
          value: rule.value,
        };
      }

      if (!ruleObj?.type) continue;

      const handlerKey =
        TYPE_TO_HANDLER[ruleObj.value] ||
        TYPE_TO_HANDLER[ruleObj.type] ||
        ruleObj.type;

      const handler = DEFAULT_RULE_HANDLERS[handlerKey];
      if (!handler) continue;

      const message = handler(formData[fieldName], ruleObj, {
        fieldName: field.label || fieldName,
        formData,
        context,
      });

      if (message) errors[fieldName] = message;
    }

    return { valid: Object.keys(errors).length === 0, errors };
  },
};

export default ValidationEngineExport;