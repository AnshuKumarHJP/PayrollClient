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
     RULE EXECUTOR (NO KNOWLEDGE OF RULE TYPES)
  ======================================================= */
  static async executeRule(payload) {
    /**
     * Resolution order:
     * 1. window.genericValidationHandler (runtime injected)
     * 2. backend validation API (future)
     * 3. no-op (ignore rule)
     */

    if (typeof window?.genericValidationHandler === "function") {
      return await window.genericValidationHandler(payload);
    }

    return null;
  }
}

export default ValidationEngine;
