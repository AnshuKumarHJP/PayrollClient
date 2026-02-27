import { useCallback, useEffect, useState } from "react";
import ValidationEngine from "../services/ValidationEngine";

export default function useValidationRules(template) {
  const [loading, setLoading] = useState(true);

  /* ----------------------------------------------
     LOADING STATE (TEMPLATE-DRIVEN)
     Why: Manages loading state based on template availability to prevent premature validation calls.
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
     Why: Provides a memoized validation function that filters fields based on context to ensure only relevant fields are validated.
  ---------------------------------------------- */
  const validate = useCallback(
    async (formData = {}, context = {}) => {
      if (!template) {
        return { valid: true, errors: {} };
      }

      try {
        // Filter fields based on context
        // Why: For bulk upload, only validate fields applicable to "upload"; for other contexts, include "upload" or "form" fields.
        const filteredTemplate = {
          ...template,
          FieldsConfigurations: template.FieldsConfigurations.filter(f => {
            try {
              const applicable = JSON.parse(f.ApplicableJson || "[]");
              if (context.context === "bulk_upload") {
                return applicable.includes("upload");
              } else {
                return applicable.includes("upload") || applicable.includes("form");
              }
            } catch {
              return false;
            }
          })
        };

        return await ValidationEngine.validate({
          template: filteredTemplate,
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
