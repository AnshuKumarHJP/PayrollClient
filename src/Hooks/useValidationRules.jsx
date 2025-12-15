// src/Hooks/useValidationRules.js
// Hook that loads validation rules applicable to the provided template
// and exposes a validate(formData, context) → { valid: boolean, errors: { field: message } }

import { useEffect, useState } from "react";
import validationEngine from "../services/ValidationEngine";

export default function useValidationRules(template) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Since validation rules are now built-in to ValidationEngine,
    // we can immediately set loading to false
    setLoading(false);
  }, []);

  // validate(formData, context)
  // - template and rules are captured from closure
  // - context can contain: existingRecords (array), customValidators: { name: fn }, debug, etc.

  const validate = (formData = {}, context = {}) => {
    try {
      const result = validationEngine.validate({
        template,
        formData,
        context,
      });

      // standardize return to { valid: boolean, errors: {} }
      return {
        valid: !!result.valid,
        errors: result.errors || {},
      };
    } catch (err) {
      console.error("Validation engine error:", err);
      // safe fallback — treat as valid with no errors
      return { valid: true, errors: {} };
    }
  };

  return { loading, validate };
}
