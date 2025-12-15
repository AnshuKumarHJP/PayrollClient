// src/services/ValidationEngine.js
// ValidationEngine V3
// - dynamic: rule types are data-driven (rule.type drives handler)
// - extensible: supply custom handlers via context.customValidators
// - safe: catches exceptions, returns structured result { valid, errors }
// - supports common rule types and provides sensible defaults

/**
 * ValidationEngine Architecture Overview:
 *
 * The ValidationEngine is a data-driven validation system that powers form validation
 * in the DynamicForm component and throughout the application. Here's how it works:
 *
 * 1. **Data-Driven Design**: Validation rules are defined in template objects (from db.json)
 *    where each field has a 'validation' property that can be a string (rule type) or
 *    object with type and condition.
 *
 * 2. **Rule Type Mapping**: Rule types like 'required', 'email', 'salary-range' are mapped
 *    to handler functions in DEFAULT_RULE_HANDLERS via TYPE_TO_HANDLER mapping.
 *
 * 3. **Handler Execution**: For each field, the engine:
 *    - Determines the rule type and condition
 *    - Looks up the appropriate handler function
 *    - Calls the handler with (value, rule, context)
 *    - Collects any error messages returned
 *
 * 4. **Integration with DynamicForm**: The DynamicForm component calls ValidationEngine.validate()
 *    with the current form data and template. It receives { valid, errors } and displays
 *    validation messages in real-time as users type or submit.
 *
 * 5. **Live Validation**: The engine supports real-time validation by being called on every
 *    input change, providing immediate feedback without requiring form submission.
 *
 * 6. **Extensibility**: Custom validators can be added via context.customValidators,
 *    allowing business-specific validation logic.
 *
 * 7. **Error Handling**: All handlers are wrapped in try-catch to prevent validation
 *    failures from breaking the form experience.
 *
 * Example Usage in DynamicForm:
 * ```javascript
 * const result = ValidationEngine.validate({
 *   template: templateData,
 *   formData: currentFormValues,
 *   context: { existingRecords, customValidators }
 * });
 * // result = { valid: true/false, errors: { fieldName: 'error message' } }
 * ```
 */

const DEFAULT_RULE_HANDLERS = {
  // required / mandatory
  mandatory: (value, rule, { fieldName }) => {
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0);
    return isEmpty ? `${fieldName || "Field"} is required` : null;
  },

  // pattern / regex
  pattern: (value, rule, { fieldName }) => {
    if (value === null || value === undefined || value === "") return null;
    let pattern = rule.condition || rule.pattern || rule.conditionPattern;
    if (!pattern) return null;
    try {
      const re = new RegExp(pattern);
      if (!re.test(String(value))) return `${fieldName || "Field"} has invalid format`;
    } catch (err) {
      console.warn("Invalid regex in rule:", pattern, err);
    }
    return null;
  },

  // email validation
  email: (value, rule, { fieldName }) => {
    if (value === null || value === undefined || value === "") return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(value))) return `${fieldName || "Field"} is not a valid email address`;
    return null;
  },

  // numeric range: condition "min-max" or rule.conditionNumber
  numeric: (value, rule, { fieldName }) => {
    if (value === null || value === undefined || value === "") return null;
    const num = Number(value);
    if (isNaN(num)) return `${fieldName || "Field"} must be a number`;
    const cond = (rule.condition || "").split("-");
    const min = cond[0] !== "" ? Number(cond[0]) : undefined;
    const max = cond[1] !== "" ? Number(cond[1]) : undefined;
    if (min !== undefined && num < min) return `${fieldName || "Field"} must be >= ${min}`;
    if (max !== undefined && num > max) return `${fieldName || "Field"} must be <= ${max}`;
    return null;
  },

  // range alias
  range: (value, rule, ctx) => DEFAULT_RULE_HANDLERS.numeric(value, rule, ctx),

  // date validity
  date: (value, rule, { fieldName }) => {
    if (!value) return null;

    const str = String(value).trim();

    // Try multiple parsing strategies to accept various date formats
    let d = null;

    // Strategy 1: Direct Date constructor (handles ISO, RFC, etc.)
    d = new Date(str);
    if (!isNaN(d.getTime())) {
      // Additional validation: ensure parsed date components match input for formats like YYYY-MM-DD
      const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (isoMatch) {
        const [, yearStr, monthStr, dayStr] = isoMatch;
        const year = Number(yearStr);
        const month = Number(monthStr);
        const day = Number(dayStr);
        if (d.getFullYear() !== year || d.getMonth() + 1 !== month || d.getDate() !== day) {
          d = null; // Invalid date - components don't match
        }
      }
    } else {
      // Strategy 2: Try MM/DD/YYYY format
      const mmddyyyyMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (mmddyyyyMatch) {
        const [, monthStr, dayStr, yearStr] = mmddyyyyMatch;
        const month = Number(monthStr);
        const day = Number(dayStr);
        const year = Number(yearStr);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1000 && year <= 9999) {
          d = new Date(year, month - 1, day);
          if (isNaN(d.getTime()) || d.getMonth() !== month - 1 || d.getDate() !== day || d.getFullYear() !== year) {
            d = null; // Invalid date
          }
        }
      }

      // Strategy 3: Try DD/MM/YYYY format if MM/DD/YYYY failed
      if (!d || isNaN(d.getTime())) {
        const ddmmyyyyMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (ddmmyyyyMatch) {
          const [, dayStr, monthStr, yearStr] = ddmmyyyyMatch;
          const day = Number(dayStr);
          const month = Number(monthStr);
          const year = Number(yearStr);
          if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1000 && year <= 9999) {
            d = new Date(year, month - 1, day);
            if (isNaN(d.getTime()) || d.getMonth() !== month - 1 || d.getDate() !== day || d.getFullYear() !== year) {
              d = null; // Invalid date
            }
          }
        }
      }

      // Strategy 4: Try YYYY/MM/DD format
      if (!d) {
        const yyyymmddMatch = str.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
        if (yyyymmddMatch) {
          const [, yearStr, monthStr, dayStr] = yyyymmddMatch;
          const year = Number(yearStr);
          const month = Number(monthStr);
          const day = Number(dayStr);
          if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1000 && year <= 9999) {
            d = new Date(year, month - 1, day);
            if (isNaN(d.getTime()) || d.getMonth() !== month - 1 || d.getDate() !== day || d.getFullYear() !== year) {
              d = null; // Invalid date
            }
          }
        }
      }
    }

    if (!d || isNaN(d.getTime())) {
      return `${fieldName || "Field"} is not a valid date`;
    }

    // Check if the parsed date is within reasonable bounds (100 years ago to 100 years from now)
    const now = new Date();
    const hundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    const hundredYearsFromNow = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());

    if (d < hundredYearsAgo || d > hundredYearsFromNow) {
      return `${fieldName || "Field"} is not a valid date`;
    }

    return null;
  },

  // date-range "YYYY-MM-DD:YYYY-MM-DD"
  "date-range": (value, rule, { fieldName }) => {
    if (!value) return null;
    const cond = (rule.condition || "").split(":");
    if (!cond[0] && !cond[1]) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return `${fieldName || "Field"} is not a valid date`;
    if (cond[0]) {
      const min = new Date(cond[0]);
      if (!isNaN(min.getTime()) && d < min) return `${fieldName || "Field"} is before allowed range`;
    }
    if (cond[1]) {
      const max = new Date(cond[1]);
      if (!isNaN(max.getTime()) && d > max) return `${fieldName || "Field"} is after allowed range`;
    }
    return null;
  },

  // date-before/after where condition points to other field or fixed date
  "date-before": (value, rule, { formData, fieldName }) => {
    if (!value) return null;
    const left = new Date(value);
    if (isNaN(left.getTime())) return `${fieldName || "Field"} is not a valid date`;
    const target = rule.condition;
    let right = null;
    if (!target) return null;
    // if target exists as another field in formData, use it; else try parse as date string
    if (formData && formData[target]) right = new Date(formData[target]);
    else right = new Date(target);
    if (isNaN(right?.getTime())) return null;
    if (left >= right) return `${fieldName || "Field"} must be before ${target}`;
    return null;
  },

  "date-after": (value, rule, ctx) => {
    // reuse date-before with reversed check
    if (!value) return null;
    const left = new Date(value);
    if (isNaN(left.getTime())) return `${ctx.fieldName || "Field"} is not a valid date`;
    const target = rule.condition;
    let right = null;
    if (ctx.formData && ctx.formData[target]) right = new Date(ctx.formData[target]);
    else right = new Date(target);
    if (isNaN(right?.getTime())) return null;
    if (left <= right) return `${ctx.fieldName || "Field"} must be after ${target}`;
    return null;
  },

  // age: condition "min-max" computed from DOB field value (form field value is DOB)
  age: (value, rule, { fieldName }) => {
    if (!value) return null;
    const dob = new Date(value);
    if (isNaN(dob.getTime())) return `${fieldName || "Field"} is not a valid DOB`;
    const now = new Date();
    const age = Math.floor((now - dob) / (365.25 * 24 * 3600 * 1000));
    const cond = (rule.condition || "").split("-");
    const min = cond[0] ? Number(cond[0]) : undefined;
    const max = cond[1] ? Number(cond[1]) : undefined;
    if (min !== undefined && age < min) return `${fieldName || "Field"} must be at least ${min}`;
    if (max !== undefined && age > max) return `${fieldName || "Field"} must be at most ${max}`;
    return null;
  },

  // list / enum: condition "A,B,C" or an array
  list: (value, rule, { fieldName }) => {
    if (value === undefined || value === null || value === "") return null;
    const cond = rule.condition;
    let allowed = [];
    if (Array.isArray(cond)) allowed = cond.map(String);
    else if (typeof cond === "string") allowed = cond.split(",").map((s) => s.trim());
    if (allowed.length && !allowed.includes(String(value))) {
      return `${fieldName || "Field"} must be one of: ${allowed.join(", ")}`;
    }
    return null;
  },

  // unique: requires context.existingRecords (array) and rule.condition indicates field(s) key (comma sep)
  uniqueness: (value, rule, { fieldName, context }) => {
    if (!context || !Array.isArray(context.existingRecords)) return null;
    const keyFields = (rule.condition || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (keyFields.length === 0) return null;

    // We'll only check uniqueness across the first key (common usage). If multiple keys, combine values.
    const targetKey = keyFields.length === 1 ? keyFields[0] : keyFields.join("|");
    // build record key
    const candidateKey = keyFields.length === 1 ? String(value) : keyFields.map(k => String(context.currentRecord?.[k] ?? "")).join("|");

    for (const rec of context.existingRecords) {
      const recKey = keyFields.length === 1 ? String(rec[keyFields[0]] ?? "") : keyFields.map(k => String(rec[k] ?? "")).join("|");
      if (recKey && recKey === candidateKey) {
        return `${fieldName || "Field"} must be unique`;
      }
    }
    return null;
  },

  // conditional required: condition like "if(department==IT,managerId)" means: if department==IT then managerId required
  conditional: (value, rule, { formData }) => {
    // rule.condition string is a mini DSL: if(<expr>,<targetField>)
    // expr: field==value OR field!=value (basic)
    const cond = (rule.condition || "").trim();
    if (!cond.startsWith("if(")) return null;
    try {
      const inside = cond.slice(3, -1); // content inside if(...)
      const [expr, target] = inside.split(",").map(s => s.trim());
      if (!expr || !target) return null;

      // parse expr like "department==IT"
      const eq = expr.includes("==") ? "==" : expr.includes("!=") ? "!=" : null;
      if (!eq) return null;
      const [left, right] = expr.split(eq).map(s => s.trim());
      const leftVal = String(formData?.[left] ?? "");
      const rightVal = String(right);
      const condHit = eq === "==" ? leftVal === rightVal : leftVal !== rightVal;

      if (condHit) {
        // target must be present in formData and not empty
        const tv = formData?.[target];
        const empty = tv === null || tv === undefined || (typeof tv === "string" && tv.trim() === "");
        if (empty) return `${target} is required due to ${left} condition`;
      }
    } catch (e) {
      // ignore DSL parse errors
      return null;
    }
    return null;
  },

  // custom: invoke a named function in context.customValidators (if provided)
  function: (value, rule, { fieldName, context }) => {
    const fnName = rule.condition;
    if (!fnName || !context || typeof context.customValidators !== "object") return null;
    const fn = context.customValidators[fnName];
    if (typeof fn !== "function") return null;
    try {
      const res = fn({ value, rule, fieldName, formData: context.formData, context });
      // fn may return { valid: boolean, message }, string, or null/true
      if (res === true || res === null) return null;
      if (typeof res === "string") return res;
      if (res && res.valid === false) return res.message || `${fieldName} failed custom validation`;
      return null;
    } catch (err) {
      console.error("custom validator error:", err);
      return `${fieldName || "Field"} failed custom validation`;
    }
  },

  // balance: check against predefined balances (e.g., leave balances)
  balance: (value, rule, { fieldName }) => {
    if (value === null || value === undefined || value === "") return null;
    const num = Number(value);
    if (isNaN(num)) return `${fieldName || "Field"} must be a number`;

    const cond = (rule.condition || "").split(",");
    const balances = {};
    cond.forEach(pair => {
      const [type, limit] = pair.split(":");
      if (type && limit) balances[type.trim()] = Number(limit.trim());
    });

    // For leave balance, we assume the field name indicates the type
    const fieldType = fieldName.toLowerCase().includes('annual') ? 'annual' :
                     fieldName.toLowerCase().includes('sick') ? 'sick' :
                     fieldName.toLowerCase().includes('casual') ? 'casual' : null;

    if (fieldType && balances[fieldType] !== undefined && num > balances[fieldType]) {
      return `${fieldName || "Field"} exceeds maximum balance of ${balances[fieldType]}`;
    }

    return null;
  },

  // duplicate: prevent duplicate entries based on key fields
  duplicate: (value, rule, { fieldName, context }) => {
    if (!context || !Array.isArray(context.existingRecords)) return null;
    const keyFields = (rule.condition || "").split(",").map(s => s.trim()).filter(Boolean);
    if (keyFields.length === 0) return null;

    for (const rec of context.existingRecords) {
      for (const keyField of keyFields) {
        if (rec[keyField] && String(rec[keyField]).toLowerCase() === String(value).toLowerCase()) {
          return `${fieldName || "Field"} already exists`;
        }
      }
    }
    return null;
  },

  // format: validate specific formats like currency, percentage, date
  format: (value, rule, { fieldName }) => {
    if (value === null || value === undefined || value === "") return null;
    const formats = (rule.condition || "").split(",").map(s => s.trim().toLowerCase());

    for (const format of formats) {
      if (format === 'currency') {
        // Check if it's a valid currency format (number with optional decimal)
        if (!/^\d+(\.\d{1,2})?$/.test(String(value))) {
          return `${fieldName || "Field"} must be a valid currency amount`;
        }
      } else if (format === 'percentage') {
        const num = Number(value);
        if (isNaN(num) || num < 0 || num > 100) {
          return `${fieldName || "Field"} must be a percentage between 0 and 100`;
        }
      } else if (format === 'date') {
        // Reuse date validation
        return DEFAULT_RULE_HANDLERS.date(value, rule, { fieldName });
      }
    }
    return null;
  },

  // phone: validate phone number format
  phone: (value, rule, { fieldName }) => {
    if (value === null || value === undefined || value === "") return null;
    // Basic phone regex - international format with optional country code
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(String(value).replace(/\s/g, ''))) {
      return `${fieldName || "Field"} must be a valid phone number`;
    }
    return null;
  },

  // department: validate against allowed departments
  department: (value, rule, { fieldName }) => {
    if (value === null || value === undefined || value === "") return null;
    // Common departments - this could be made configurable via condition
    const allowedDepartments = (rule.condition || "IT,HR,Finance,Operations,Marketing,Sales").split(",").map(s => s.trim());
    if (!allowedDepartments.includes(String(value))) {
      return `${fieldName || "Field"} must be a valid department: ${allowedDepartments.join(", ")}`;
    }
    return null;
  }
};

// mapping of rule.type (or rule.value) to handler name in DEFAULT_RULE_HANDLERS
const TYPE_TO_HANDLER = {
  required: "mandatory",
  mandatory: "mandatory",
  regex: "pattern",
  pattern: "pattern",
  "regular-expression": "pattern",
  range: "numeric",
  numeric: "numeric",
  date: "date",
  "date-range": "date-range",
  "date-before": "date-before",
  "date-after": "date-after",
  age: "age",
  list: "list",
  "uniqueness": "uniqueness",
  unique: "uniqueness",
  "conditional": "conditional",
  "function": "function",
  "custom": "function",
  "pattern-match": "pattern",
  email: "email",
  "email-format": "email",
  "phone-format": "phone",
  "salary-range": "numeric",
  "department-check": "department",
  "leave-balance": "balance",
  "duplicate-check": "duplicate",
  "format-check": "format",
  "conditional-required": "conditional",
  // add more aliases here
};

// normalize rule object helper
function normalizeRule(rule) {
  if (!rule) return null;
  return {
    id: rule.id,
    value: rule.value || rule.type || rule.id,
    label: rule.label || rule.value || null,
    type: (rule.type || rule.value || "").toString().toLowerCase(),
    condition: rule.condition ?? rule.conditionValue ?? rule.pattern ?? null,
    severity: rule.severity || "medium",
    meta: rule.meta || {},
    raw: rule,
  };
}

const ValidationEngine = {
  /**
   * validate({ template, formData, context })
   * - template: template object (contains fields with validation keys)
   * - formData: single flat form object to validate
   * - context: { existingRecords, customValidators, currentRecord } optional
   *
   * returns: { valid: boolean, errors: { fieldName: message } }
   */
  validate({ template, formData = {}, context = {} } = {}) {
    const errors = {};

    try {
      if (!template || !Array.isArray(template.fields)) {
        return { valid: true, errors: {} };
      }

      for (const field of template.fields) {
        // only validate fields that are applicable to forms (defensive)
        if (!Array.isArray(field.applicable) || !field.applicable.includes("form")) continue;

        const fieldName = field.name;
        const rawValidation = field.validation;
        // allow validation to be either string pointing to rule value or object { type: '...', condition: '...' }
        let ruleObj = null;

        if (!rawValidation || rawValidation === "none") {
          // no validation
          continue;
        }

        if (typeof rawValidation === "string") {
          // treat string as rule type
          ruleObj = { type: rawValidation };
        } else if (typeof rawValidation === "object") {
          // user provided inline rule object
          ruleObj = { ...rawValidation };
        } else {
          // unsupported type, skip
          continue;
        }

        // normalize type - check original case first, then lowercase
        const originalType = (ruleObj.type || "").toString();
        const rtype = originalType.toLowerCase();
        const handlerKey = TYPE_TO_HANDLER[originalType] || rtype;

        // produce "rule" normalized object passed to handler
        let ruleForHandler = {
          ...ruleObj,
          type: rtype,
          condition: ruleObj.condition ?? ruleObj.rawCondition ?? ruleObj.pattern ?? ruleObj.condition,
        };

        // Add default conditions for certain types if not provided
        if (rtype === "date-range" && !ruleForHandler.condition) {
          ruleForHandler.condition = "1900-01-01:2100-12-31";
        } else if (rtype === "salary-range" && !ruleForHandler.condition) {
          ruleForHandler.condition = "1000-100000"; // Default salary range
        } else if (rtype === "leave-balance" && !ruleForHandler.condition) {
          ruleForHandler.condition = "annual:25,sick:10,casual:5"; // Default leave balances
        } else if (rtype === "duplicate-check" && !ruleForHandler.condition) {
          ruleForHandler.condition = fieldName; // Check duplicates for this field
        } else if (rtype === "format-check" && !ruleForHandler.condition) {
          ruleForHandler.condition = "percentage"; // Default format check
        } else if (rtype === "conditional-required" && !ruleForHandler.condition) {
          ruleForHandler.condition = "if(department==IT,managerId)"; // Default conditional
        } else if (rtype === "pattern-match" && !ruleForHandler.condition) {
          ruleForHandler.condition = "^EMP\\d+$"; // Default pattern for employee IDs
        }

        const handler =
          // custom override provided by context.customValidators keyed by rule value or type
          (context.customValidators && (context.customValidators[ruleForHandler.value] || context.customValidators[rtype])) ||
          DEFAULT_RULE_HANDLERS[handlerKey];

        if (typeof handler !== "function") {
          // no handler found — skip but warn
          // console.warn("No handler for rule type:", rtype, "field:", fieldName);
          continue;
        }

        // call handler with safe try/catch and context
        try {
          const errMsg = handler(formData[fieldName], ruleForHandler, {
            fieldName: field.label || fieldName,
            formData,
            context,
            // allow handler to use existingRecords inside context
            existingRecords: context.existingRecords,
            currentRecord: context.currentRecord,
          });

          if (errMsg) errors[fieldName] = errMsg;
        } catch (err) {
          console.error("Validation handler error:", err);
          errors[fieldName] = `${field.label || fieldName} validation failed`;
        }
      } // end for each field

      const valid = Object.keys(errors).length === 0;
      return { valid, errors };
    } catch (err) {
      console.error("Validation engine top-level error:", err);
      return { valid: true, errors: {} };
    }
  },

  // you can add helpers to register handlers at runtime for new rule types:
  registerHandler(typeOrAlias, fn) {
    if (!typeOrAlias || typeof fn !== "function") return false;
    DEFAULT_RULE_HANDLERS[typeOrAlias] = fn;
    return true;
  },

  // expose mapping to allow dynamic aliasing
  registerAlias(alias, handlerKey) {
    TYPE_TO_HANDLER[alias] = handlerKey;
  },
};

export default ValidationEngine;
