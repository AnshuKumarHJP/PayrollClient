const safeJsonParse = (v, fallback = []) => {
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
};

class ValidationEngine {
  /* =======================================================
     MAIN ENTRY
  ======================================================= */
  static async validate({ template, formData = {}, context = {} }) {
    const errors = {};
    let valid = true;

    const fields = template?.FieldsConfigurations ?? [];

    for (const field of fields) {
      if (!field?.Active) continue;

      const value = formData[field.Name];

      /* ---------- REQUIRED FLAG ---------- */
      if (field.Required && (value === "" || value === null || value === undefined)) {
        errors[field.Name] = `${field.Label} is required`;
        valid = false;
        continue;
      }

      const rules = field.FieldValidationRule ?? [];

      for (const rule of rules) {
        if (!rule?.IsActive) continue;

        const paramsArray = safeJsonParse(rule.ValidationParameters, []);
        const params = paramsArray.reduce((acc, p) => {
          acc[p.ParamName] = p.ParamValue;
          return acc;
        }, {});

        const error = ValidationEngine.executeRule({
          value,
          field,
          rule,
          params,
          formData,
          context,
        });

        if (error) {
          errors[field.Name] = error;
          valid = false;
          break;
        }
      }
    }

    return { valid, errors };
  }

  /* =======================================================
     GENERIC RULE EXECUTOR
  ======================================================= */
  static executeRule({ value, field, rule, params }) {
    if (value === "" || value === null || value === undefined) return null;

    const type = String(rule.ValidationType);

    /* ---------- LENGTH (ValidationType = 1) ---------- */
    if (type === "1") {
      const length = String(value).length;

      for (const key in params) {
        const ruleValue = Number(params[key]);

        if (key.toLowerCase().includes("min") && length < ruleValue) {
          return `${field.Label} must be at least ${ruleValue} characters`;
        }

        if (key.toLowerCase().includes("max") && length > ruleValue) {
          return `${field.Label} must be at most ${ruleValue} characters`;
        }
      }
    }

    /* ---------- REGEX (ValidationType = 2) ---------- */
    if (type === "2") {
      for (const key in params) {
        try {
          const regex = new RegExp(params[key]);
          if (!regex.test(value)) {
            return `${field.Label} format is invalid`;
          }
        } catch {
          return null;
        }
      }
    }

    /* ---------- RANGE (ValidationType = 3) ---------- */
    if (type === "3") {
      const num = Number(value);
      if (isNaN(num)) return `${field.Label} must be a number`;

      for (const key in params) {
        const ruleValue = Number(params[key]);

        if (key.toLowerCase().includes("min") && num < ruleValue) {
          return `${field.Label} must be ≥ ${ruleValue}`;
        }

        if (key.toLowerCase().includes("max") && num > ruleValue) {
          return `${field.Label} must be ≤ ${ruleValue}`;
        }
      }
    }

    return null;
  }
}

export default ValidationEngine;
