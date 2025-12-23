// src/Hooks/useValidationRules.js
import { useEffect, useState } from "react";
import ValidationEngine from "../services/ValidationEngine";
import ruleTypesService from "../../api/services/ruleTypesService";

export default function useValidationRules(template) {
  const [loading, setLoading] = useState(true);
  const [ruleTypes, setRuleTypes] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ruleTypesService.getAllRuleTypes(); // async load
        if (data) setRuleTypes(data);
      } catch (err) {
        console.error("Failed to load rule types:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const validate = (formData = {}, context = {}) => {
    try {
      return ValidationEngine.validate({
        template,
        formData,
        context,
        ruleTypes // ⭐ pass ruleTypes to engine
      });
    } catch (err) {
      console.error("Validation engine crashed:", err);
      return { valid: true, errors: {} };
    }
  };

  return { loading, validate };
}
