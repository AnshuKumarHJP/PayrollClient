import { useCallback, useEffect, useState } from "react";
import ValidationEngine from "../services/ValidationEngine";

export default function useValidationRules(template) {
  const [loading, setLoading] = useState(true);

  /* ----------------------------------------------
     LOADING STATE (TEMPLATE-DRIVEN)
  ---------------------------------------------- */
  useEffect(() => {
    if (!template) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [template]);

  /* ----------------------------------------------
     STABLE VALIDATE FUNCTION (NO LOOP)
  ---------------------------------------------- */
  const validate = useCallback(
    async (formData = {}, context = {}) => {
      if (!template) {
        return { valid: true, errors: {} };
      }

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
    },
    [template] // ✅ stable dependency
  );

  return { loading, validate };
}
