function validateInput(userInput, template) {
  const errors = {};

  template?.fields?.forEach(field => {
    const value = userInput[field.name];
    const rules = field.rules || [];

    for (const rule of rules) {
      try {
        // Convert parameters array to object
        const paramsArray = rule.parameters || [];
        const params = paramsArray.reduce((acc, p) => {
          acc[p.ParamName] = p.ParamValue;
          return acc;
        }, {});

        // 1️⃣ Frontend doesn't know validationType
        // 2️⃣ Delegate to a generic handler (backend-defined or global)
        if (typeof window.genericValidationHandler === "function") {
          const error = window.genericValidationHandler(value, rule.validationType, params, rule.message);
          if (error) {
            errors[field.name] = error;
            break; // stop at first error
          }
        }

        // 3️⃣ If no generic handler, ignore rule safely
      } catch {
        continue; // ignore broken rules
      }
    }
  });

  return errors;
}




/*****************************************************************
 * PURE DYNAMIC VALIDATION EXECUTOR (USING OPTIONAL CHAINING)
 *
 * - Frontend does NOT know validationType
 * - Frontend just receives template + user input
 * - Executes safely using optional chaining
 * - Unknown types are ignored
 *****************************************************************/

function validateInput(userInput, template) {
  const errors = {};

  // Loop fields safely
  template?.fields?.forEach(field => {
    const value = userInput?.[field?.name];
    const rules = field?.rules ?? [];

    for (const rule of rules) {
      try {
        // Convert parameters array to object safely
        const params = (rule?.parameters ?? []).reduce((acc, p) => {
          acc[p?.ParamName] = p?.ParamValue;
          return acc;
        }, {});

        // Call a generic handler if defined globally
        const error = typeof window?.genericValidationHandler === "function"
          ? window.genericValidationHandler(value, rule?.validationType, params, rule?.message)
          : null;

        if (error) {
          errors[field?.name] = error;
          break; // stop at first error
        }

      } catch {
        // ignore broken rules
        continue;
      }
    }
  });

  return errors;
}



// Simulate generic handler dynamically defined by backend
window.genericValidationHandler = (value, type, params, message) => {
  if (type === "LENGTH") {
    if ((value?.length ?? 0) < Number(params?.minLength || 0)) return message;
    if ((value?.length ?? 0) > Number(params?.maxLength || Infinity)) return message;
  }
  if (type === "REGEX") {
    try {
      if (!new RegExp(params?.pattern).test(value)) return message;
    } catch {
      return null;
    }
  }
  if (type === "CUSTOM") {
    if (params?.strategy === "aadhaar" && (value?.length ?? 0) !== 12) return message;
  }
  // Any unknown type is ignored
  return null;
};

// Example template from API
const template = {
  fields: [
    {
      name: "AadhaarNo",
      rules: [
        {
          validationType: "LENGTH",
          message: "Aadhaar must be 12 digits",
          parameters: [{ ParamName: "minLength", ParamValue: "12" }, { ParamName: "maxLength", ParamValue: "12" }]
        },
        {
          validationType: "CUSTOM",
          message: "Invalid Aadhaar",
          parameters: [{ ParamName: "strategy", ParamValue: "aadhaar" }]
        }
      ]
    },
    {
      name: "Email",
      rules: [
        {
          validationType: "REGEX",
          message: "Invalid email",
          parameters: [{ ParamName: "pattern", ParamValue: "^[^@]+@[^@]+\\.[^@]+$" }]
        }
      ]
    }
  ]
};

// User input
const userInput = {
  AadhaarNo: "1234",
  Email: "test@gmail"
};

// Run validation
const errors = validateInput(userInput, template);
console.log(errors);
/*
Output:
{
  AadhaarNo: "Aadhaar must be 12 digits",
  Email: "Invalid email"
}
*/



// New


/*****************************************************************
 * PURE DYNAMIC FRONTEND EXECUTOR
 *
 * - Frontend does not know validationType
 * - No static handlers
 * - Delegates logic to backend or generic handler
 * - Fully safe, uses optional chaining
 *****************************************************************/

async function validateInput(userInput, template) {
  const errors = {};

  // Loop through fields safely
  for (const field of template?.fields ?? []) {
    const value = userInput?.[field?.name];
    const rules = field?.rules ?? [];

    for (const rule of rules) {
      try {
        const params = (rule?.parameters ?? []).reduce((acc, p) => {
          acc[p?.ParamName] = p?.ParamValue;
          return acc;
        }, {});

        // Delegate to backend or global async handler
        // Example: backend API call per rule
        let error = null;
        if (typeof window?.genericValidationHandler === "function") {
          // Pass value, validationType, params, message
          error = await window.genericValidationHandler(value, rule?.validationType, params, rule?.message);
        }

        // Stop at first error for this field
        if (error) {
          errors[field?.name] = error;
          break;
        }

      } catch {
        continue; // safely ignore broken rules
      }
    }
  }

  return errors;
}



// Simulate backend/generic handler
window.genericValidationHandler = async (value, type, params, message) => {
  // Backend logic (fully dynamic)
  if (type === "LENGTH") {
    const len = value?.length ?? 0;
    if ((params?.minLength && len < Number(params.minLength)) ||
        (params?.maxLength && len > Number(params.maxLength))) {
      return message;
    }
  }

  if (type === "REGEX") {
    try {
      if (!new RegExp(params?.pattern).test(value)) return message;
    } catch {}
  }

  if (type === "CUSTOM") {
    if (params?.strategy === "aadhaar" && (value?.length ?? 0) !== 12) return message;
  }

  // Any unknown type → ignore
  return null;
};

// Template from API
const template = {
  fields: [
    {
      name: "AadhaarNo",
      rules: [
        {
          validationType: "LENGTH",
          message: "Aadhaar must be 12 digits",
          parameters: [{ ParamName: "minLength", ParamValue: "12" }, { ParamName: "maxLength", ParamValue: "12" }]
        },
        {
          validationType: "CUSTOM",
          message: "Invalid Aadhaar",
          parameters: [{ ParamName: "strategy", ParamValue: "aadhaar" }]
        }
      ]
    },
    {
      name: "Email",
      rules: [
        {
          validationType: "REGEX",
          message: "Invalid email",
          parameters: [{ ParamName: "pattern", ParamValue: "^[^@]+@[^@]+\\.[^@]+$" }]
        }
      ]
    },
    {
      name: "Phone",
      rules: [
        {
          validationType: "PHONE", // unknown type → safely ignored
          message: "Invalid phone",
          parameters: []
        }
      ]
    }
  ]
};

// User input
const userInput = {
  AadhaarNo: "1234",
  Email: "test@gmail",
  Phone: "999"
};

// Run validation
validateInput(userInput, template).then(errors => {
  console.log(errors);
});
/*
Output:
{
  AadhaarNo: "Aadhaar must be 12 digits",
  Email: "Invalid email"
}
// Phone rule ignored safely
*/
