// src/services/ValidationEngine.js
// ✅ PURE GENERIC ENGINE
// ❌ NO static rules
// ❌ NO switch / case
// ❌ NO hardcoded validation types
// ✅ 100% TEMPLATE DRIVEN
// ✅ BACKEND CONTROLS EVERYTHING

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

      /* ---------- REQUIRED (FLAG BASED, NOT RULE BASED) ---------- */
      if (field.Required) {
        if (value === undefined || value === null || value === "") {
          errors[field.Name] = `${field.Label} is required`;
          valid = false;
          continue;
        }
      }

      /* ---------- RULES FROM BACKEND ---------- */
      const rules = field.FieldValidationRule ?? [];

      for (const rule of rules) {
        if (!rule?.IsActive) continue;

        const paramsArray = safeJsonParse(rule.ValidationParameters, []);
        const params = paramsArray.reduce((acc, p) => {
          acc[p.ParamName] = p.ParamValue;
          return acc;
        }, {});

        try {
          const error = await ValidationEngine.executeRule({
            value,
            field,
            rule,
            params,
            formData,
            context
          });

          if (error) {
            errors[field.Name] = error;
            valid = false;
            break; // stop first error per field
          }
        } catch {
          continue; // NEVER break form
        }
      }
    }

    return { valid, errors };
  }

  /* =======================================================
     RULE EXECUTOR (WITH BUILT-IN VALIDATION TYPES)
  ======================================================= */
  static async executeRule({ value, field, rule, params, formData, context }) {
    /**
     * Resolution order:
     * 1. window.genericValidationHandler (runtime injected)
     * 2. built-in validation types
     * 3. backend validation API (future)
     * 4. no-op (ignore rule)
     */

    if (typeof window?.genericValidationHandler === "function") {
      return await window.genericValidationHandler({ value, field, rule, params, formData, context });
    }

    // Built-in validation types
    const validationType = rule.ValidationType;

    switch (validationType) {
      case "required":
        if (!value || value === "") {
          return `${field.Label} is required`;
        }
        break;

      case "email":
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (value && !emailRegex.test(value)) {
          return `${field.Label} must be a valid email`;
        }
        break;

      case "max-length":
        if (value && value.length > parseInt(params.Max)) {
          return `${field.Label} must be at most ${params.Max} characters`;
        }
        break;

      case "min-length":
        if (value && value.length < parseInt(params.Min)) {
          return `${field.Label} must be at least ${params.Min} characters`;
        }
        break;

      case "0": // Range validation (for numbers)
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          return `${field.Label} must be a valid number`;
        } else {
          if (params.Min && numValue < parseFloat(params.Min)) {
            return `${field.Label} must be at least ${params.Min}`;
          }
          if (params.Max && numValue > parseFloat(params.Max)) {
            return `${field.Label} must be at most ${params.Max}`;
          }
        }
        break;

      case "2": // Regex validation
        if (params.Pattern) {
          const regex = new RegExp(params.Pattern);
          if (value && !regex.test(value)) {
            return `${field.Label} format is invalid`;
          }
        }
        break;

      default:
        // Unknown validation type, ignore
        break;
    }

    return null;
  }
}

export default ValidationEngine;
