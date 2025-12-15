# TODO: Remove "form globalRules" from ValidationEngine.js, useValidationRules.jsx, and DynamicForm.jsx

## Completed Steps

- [x] Update ValidationEngine.js:
  - Remove `globalRules` from the `validate` function parameters.
  - Remove the code that builds `ruleByValue` from `globalRules`.
  - For string validations, set `ruleObj = { type: rawValidation }` instead of looking up in `ruleByValue` or inferring patterns.
  - Update the function comment to remove reference to `globalRules`.

- [x] Update DynamicForm.jsx:
  - Remove `globalRulesSource: "hook"` from the `context` in the `validateForm` call within `handleValue`.

- [x] Verify useValidationRules.jsx:
  - No changes needed as it already omits `globalRules`.

## Followup Steps

- [ ] Test the validation logic to ensure string validations (e.g., "required", "range") work by treating the string as the type.
- [ ] Verify that inline object validations still function correctly.
- [ ] Check for any runtime errors in forms using string validations.
