/**
 * Simple Validation Demo - Shows ValidationEngine in Action
 */

import ValidationEngine from './src/services/ValidationEngine.js';

// Sample template with validation rules
const template = {
  fields: [
    {
      name: "employeeId",
      label: "Employee ID",
      applicable: ["form"],
      validation: "pattern-match"
    },
    {
      name: "email",
      label: "Email",
      applicable: ["form"],
      validation: "email"
    },
    {
      name: "salary",
      label: "Salary",
      applicable: ["form"],
      validation: "salary-range"
    }
  ]
};

console.log("🔥 VALIDATION ENGINE DEMO\n");

// Test 1: Valid data
console.log("✅ Test 1: Valid Form Data");
const validData = {
  employeeId: "EMP001",
  email: "john@company.com",
  salary: 75000
};

const result1 = ValidationEngine.validate({ template, formData: validData });
console.log("Data:", validData);
console.log("Result:", result1);
console.log("Valid:", result1.valid, "\n");

// Test 2: Invalid data
console.log("❌ Test 2: Invalid Form Data");
const invalidData = {
  employeeId: "INVALID",
  email: "bad-email",
  salary: 200000
};

const result2 = ValidationEngine.validate({ template, formData: invalidData });
console.log("Data:", invalidData);
console.log("Result:", result2);
console.log("Valid:", result2.valid);
console.log("Errors:", result2.errors, "\n");

console.log("🎯 How ValidationEngine Works:");
console.log("1. Template defines validation rules per field");
console.log("2. Form data is validated against rules");
console.log("3. Returns { valid: boolean, errors: object }");
console.log("4. DynamicForm uses this for real-time validation");
