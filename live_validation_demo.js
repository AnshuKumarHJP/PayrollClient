/**
 * Live Validation Demo - Shows how ValidationEngine works with DynamicForm
 *
 * This demo simulates real-time validation as users interact with form fields,
 * demonstrating the data-driven validation system in action.
 */

import ValidationEngine from './src/services/ValidationEngine.js';

// Sample template data (from db.json structure)
const template = {
  fields: [
    {
      name: "employeeId",
      label: "Employee ID",
      applicable: ["form"],
      validation: "pattern-match" // Uses default condition "^EMP\\d+$"
    },
    {
      name: "email",
      label: "Email Address",
      applicable: ["form"],
      validation: "email"
    },
    {
      name: "salary",
      label: "Salary",
      applicable: ["form"],
      validation: "salary-range" // Uses default condition "1000-100000"
    },
    {
      name: "department",
      label: "Department",
      applicable: ["form"],
      validation: "department-check"
    },
    {
      name: "annualLeave",
      label: "Annual Leave Balance",
      applicable: ["form"],
      validation: "leave-balance" // Uses default condition "annual:25,sick:10,casual:5"
    }
  ]
};

// Custom validators for business-specific logic
const customValidators = {
  businessRule: ({ value, rule, fieldName, formData }) => {
    // Example: Custom validation that checks if salary is reasonable for department
    if (formData.department === 'IT' && value > 150000) {
      return `${fieldName} is too high for IT department`;
    }
    return null;
  }
};

// Simulate live validation as user types
function simulateLiveValidation() {
  console.log("🔥 LIVE VALIDATION DEMO - ValidationEngine in Action\n");

  // Test Case 1: Valid data
  console.log("📝 Test 1: Valid Form Data");
  const validFormData = {
    employeeId: "EMP001",
    email: "john.doe@company.com",
    salary: 75000,
    department: "IT",
    annualLeave: 20
  };

  const result1 = ValidationEngine.validate({
    template,
    formData: validFormData,
    context: { customValidators }
  });

  console.log("Form Data:", validFormData);
  console.log("Validation Result:", result1);
  console.log("✅ Valid:", result1.valid, "\n");

  // Test Case 2: Invalid employee ID
  console.log("📝 Test 2: Invalid Employee ID (live typing simulation)");
  const invalidIdData = { ...validFormData, employeeId: "INVALID123" };
  const result2 = ValidationEngine.validate({
    template,
    formData: invalidIdData,
    context: { customValidators }
  });

  console.log("Form Data:", invalidIdData);
  console.log("Validation Result:", result2);
  console.log("❌ Error:", result2.errors.employeeId, "\n");

  // Test Case 3: Salary too high for department
  console.log("📝 Test 3: Salary Range Violation");
  const highSalaryData = { ...validFormData, salary: 200000 };
  const result3 = ValidationEngine.validate({
    template,
    formData: highSalaryData,
    context: { customValidators }
  });

  console.log("Form Data:", highSalaryData);
  console.log("Validation Result:", result3);
  console.log("❌ Error:", result3.errors.salary, "\n");

  // Test Case 4: Leave balance exceeded
  console.log("📝 Test 4: Leave Balance Exceeded");
  const excessLeaveData = { ...validFormData, annualLeave: 30 };
  const result4 = ValidationEngine.validate({
    template,
    formData: excessLeaveData,
    context: { customValidators }
  });

  console.log("Form Data:", excessLeaveData);
  console.log("Validation Result:", result4);
  console.log("❌ Error:", result4.errors.annualLeave, "\n");

  // Test Case 5: Multiple validation errors
  console.log("📝 Test 5: Multiple Validation Errors");
  const multipleErrorsData = {
    employeeId: "BADID",
    email: "invalid-email",
    salary: 500, // Too low
    department: "INVALID",
    annualLeave: 50 // Too high
  };

  const result5 = ValidationEngine.validate({
    template,
    formData: multipleErrorsData,
    context: { customValidators }
  });

  console.log("Form Data:", multipleErrorsData);
  console.log("Validation Result:", result5);
  console.log("❌ Errors:", result5.errors);
  console.log("📊 Error Count:", Object.keys(result5.errors).length, "\n");

  console.log("🎯 How This Works in DynamicForm:");
  console.log("1. User types in a field → onChange triggers validation");
  console.log("2. ValidationEngine.validate() called with current form data");
  console.log("3. Rules from template.fields[].validation are processed");
  console.log("4. Handler functions return error messages or null");
  console.log("5. DynamicForm displays errors in real-time");
  console.log("6. Form submission blocked if validation fails\n");

  console.log("🔧 Key Features Demonstrated:");
  console.log("- Data-driven validation (rules defined in JSON)");
  console.log("- Real-time feedback (immediate error display)");
  console.log("- Multiple rule types (pattern, range, list, etc.)");
  console.log("- Custom validators for business logic");
  console.log("- Safe error handling (no crashes on invalid data)");
  console.log("- Extensible architecture (easy to add new rules)");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  simulateLiveValidation();
}

export { simulateLiveValidation };
