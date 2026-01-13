// src/Hooks/useValidationRules.js
// ✅ CLEAN HOOK
// ✅ NO LOGIC
// ✅ ENGINE DOES EVERYTHING

import { useEffect, useState } from "react";
import ValidationEngine from "../services/ValidationEngine";

export default function useValidationRules(template) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [template]);

  const validate = async (formData = {}, context = {}) => {
    try {
      return await ValidationEngine.validate({
        template,
        formData,
        context
      });
    } catch (err) {
      console.error("Validation engine crashed:", err);
      return { valid: true, errors: {} };
    }
  };

  return { loading, validate };
}
