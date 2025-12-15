// Comprehensive Rule Types Test
// Testing all rule types from db.json

import ValidationEngine from './src/services/ValidationEngine.js';

console.log('Running Comprehensive Rule Types Test...\n');

// Mock template with all rule types
const template = {
  fields: [
    // 1. regex - Regular Expression
    {
      name: 'employeeId',
      label: 'Employee ID',
      type: 'text',
      applicable: ['form'],
      validation: {
        type: 'regex',
        condition: '^[a-zA-Z0-9]+$'
      }
    },
    // 2. range - Numeric Range
    {
      name: 'salary',
      label: 'Salary',
      type: 'number',
      applicable: ['form'],
      validation: {
        type: 'range',
        condition: '1000-50000'
      }
    },
    // 3. required - Required Field
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      applicable: ['form'],
      validation: 'required'
    },
    // 4. unique - Unique Value
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      applicable: ['form'],
      validation: {
        type: 'unique',
        condition: 'email'
      }
    },
    // 5. custom - Custom Function
    {
      name: 'customField',
      label: 'Custom Field',
      type: 'text',
      applicable: ['form'],
      validation: {
        type: 'custom',
        condition: 'validateCustomLogic'
      }
    },
    // 6. date - Date Format
    {
      name: 'joiningDate',
      label: 'Joining Date',
      type: 'date',
      applicable: ['form'],
      validation: 'date'
    },
    // 7. date-before - Date Before
    {
      name: 'birthDate',
      label: 'Birth Date',
      type: 'date',
      applicable: ['form'],
      validation: {
        type: 'date-before',
        condition: 'joiningDate'
      }
    },
    // 8. date-after - Date After
    {
      name: 'contractEndDate',
      label: 'Contract End Date',
      type: 'date',
      applicable: ['form'],
      validation: {
        type: 'date-after',
        condition: '2020-01-01'
      }
    },
    // 9. date-range - Date Range
    {
      name: 'projectStartDate',
      label: 'Project Start Date',
      type: 'date',
      applicable: ['form'],
      validation: {
        type: 'date-range',
        condition: '2020-01-01:2030-12-31'
      }
    },
    // 10. age - Age Validator
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      applicable: ['form'],
      validation: {
        type: 'age',
        condition: '18-65'
      }
    },
    // 11. email-format - Email Format
    {
      name: 'contactEmail',
      label: 'Contact Email',
      type: 'email',
      applicable: ['form'],
      validation: 'email-format'
    },
    // 12. phone-format - Phone Format
    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      applicable: ['form'],
      validation: 'phone-format'
    },
    // 13. salary-range - Salary Range
    {
      name: 'monthlySalary',
      label: 'Monthly Salary',
      type: 'number',
      applicable: ['form'],
      validation: 'salary-range'
    },
    // 14. department-check - Department Validation
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      applicable: ['form'],
      validation: 'department-check'
    },
    // 15. leave-balance - Leave Balance Check
    {
      name: 'annualLeave',
      label: 'Annual Leave',
      type: 'number',
      applicable: ['form'],
      validation: 'leave-balance'
    },
    // 16. duplicate-check - Duplicate Prevention
    {
      name: 'taxId',
      label: 'Tax ID',
      type: 'text',
      applicable: ['form'],
      validation: 'duplicate-check'
    },
    // 17. format-check - Format Validation
    {
      name: 'percentage',
      label: 'Percentage',
      type: 'number',
      applicable: ['form'],
      validation: 'format-check'
    },
    // 18. conditional-required - Conditional Required
    {
      name: 'managerId',
      label: 'Manager ID',
      type: 'text',
      applicable: ['form'],
      validation: 'conditional-required'
    },
    // 19. pattern-match - Pattern Matching
    {
      name: 'patternField',
      label: 'Pattern Field',
      type: 'text',
      applicable: ['form'],
      validation: 'pattern-match'
    }
  ]
};

// Test data for each rule type
const testData = {
  // Valid data
  valid: {
    employeeId: 'EMP001',
    salary: 25000,
    firstName: 'John',
    email: 'john.smith@example.com', // Changed to avoid uniqueness conflict
    customField: 'valid',
    joiningDate: '2023-01-15',
    birthDate: '1990-01-01',
    contractEndDate: '2025-12-31',
    projectStartDate: '2024-01-01',
    dateOfBirth: '1990-01-01',
    contactEmail: 'contact@example.com',
    phone: '+1234567890',
    monthlySalary: 30000,
    department: 'IT',
    annualLeave: 20,
    taxId: 'TAX456', // Changed to avoid duplicate conflict
    percentage: 85,
    managerId: 'MGR001',
    patternField: 'EMP123'
  },
  // Invalid data for each field
  invalid: {
    employeeId: 'EMP@001', // invalid regex
    salary: 100000, // out of range
    firstName: '', // empty required
    email: 'john.doe@example.com', // duplicate
    customField: 'invalid',
    joiningDate: 'invalid-date',
    birthDate: '2025-01-01', // after joining date
    contractEndDate: '2019-01-01', // before 2020
    projectStartDate: '2035-01-01', // after 2030
    dateOfBirth: '2010-01-01', // too young
    contactEmail: 'invalid-email',
    phone: 'invalid-phone',
    monthlySalary: 1000000, // too high
    department: 'InvalidDept',
    annualLeave: 100, // too much leave
    taxId: 'TAX123', // duplicate
    percentage: 'invalid',
    managerId: '', // conditionally required
    patternField: 'INVALID'
  }
};

// Custom validator function
const customValidators = {
  validateCustomLogic: (params) => {
    return params.value === 'valid' ? null : 'Custom validation failed';
  }
};

// Context for uniqueness and other validations
const context = {
  existingRecords: [
    { email: 'john.doe@example.com', taxId: 'TAX123' }
  ],
  customValidators
};

// Test cases
const testCases = [
  {
    name: 'Test 1: All Valid Data',
    data: testData.valid,
    expectedErrors: 0
  },
  {
    name: 'Test 2: Invalid Employee ID (regex)',
    data: { ...testData.valid, employeeId: testData.invalid.employeeId },
    expectedErrors: 1
  },
  {
    name: 'Test 3: Invalid Salary Range',
    data: { ...testData.valid, salary: testData.invalid.salary },
    expectedErrors: 1
  },
  {
    name: 'Test 4: Missing Required Field',
    data: { ...testData.valid, firstName: testData.invalid.firstName },
    expectedErrors: 1
  },
  {
    name: 'Test 5: Duplicate Email',
    data: { ...testData.valid, email: testData.invalid.email },
    expectedErrors: 1
  },
  {
    name: 'Test 6: Invalid Custom Field',
    data: { ...testData.valid, customField: testData.invalid.customField },
    expectedErrors: 1
  },
  {
    name: 'Test 7: Invalid Date Format',
    data: { ...testData.valid, joiningDate: testData.invalid.joiningDate },
    expectedErrors: 1
  },
  {
    name: 'Test 8: Date Before Validation',
    data: { ...testData.valid, birthDate: testData.invalid.birthDate },
    expectedErrors: 1
  },
  {
    name: 'Test 9: Date After Validation',
    data: { ...testData.valid, contractEndDate: testData.invalid.contractEndDate },
    expectedErrors: 1
  },
  {
    name: 'Test 10: Date Range Validation',
    data: { ...testData.valid, projectStartDate: testData.invalid.projectStartDate },
    expectedErrors: 1
  },
  {
    name: 'Test 11: Age Validation',
    data: { ...testData.valid, dateOfBirth: testData.invalid.dateOfBirth },
    expectedErrors: 1
  },
  {
    name: 'Test 12: Email Format Validation',
    data: { ...testData.valid, contactEmail: testData.invalid.contactEmail },
    expectedErrors: 1
  },
  {
    name: 'Test 13: Phone Format Validation',
    data: { ...testData.valid, phone: testData.invalid.phone },
    expectedErrors: 1
  },
  {
    name: 'Test 14: Salary Range Validation',
    data: { ...testData.valid, monthlySalary: testData.invalid.monthlySalary },
    expectedErrors: 1
  },
  {
    name: 'Test 15: Department Validation',
    data: { ...testData.valid, department: testData.invalid.department },
    expectedErrors: 1
  },
  {
    name: 'Test 16: Leave Balance Validation',
    data: { ...testData.valid, annualLeave: testData.invalid.annualLeave },
    expectedErrors: 1
  },
  {
    name: 'Test 17: Duplicate Prevention',
    data: { ...testData.valid, taxId: testData.invalid.taxId },
    expectedErrors: 1
  },
  {
    name: 'Test 18: Format Validation',
    data: { ...testData.valid, percentage: testData.invalid.percentage },
    expectedErrors: 1
  },
  {
    name: 'Test 19: Conditional Required',
    data: { ...testData.valid, department: 'IT', managerId: testData.invalid.managerId },
    expectedErrors: 1
  },
  {
    name: 'Test 20: Pattern Matching',
    data: { ...testData.valid, patternField: testData.invalid.patternField },
    expectedErrors: 1
  }
];

// Run tests
let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`\n${testCase.name}`);

  const result = ValidationEngine.validate({
    template,
    formData: testCase.data,
    context
  });

  const errorCount = Object.keys(result.errors).length;
  const passed = errorCount === testCase.expectedErrors;

  console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
  console.log(`Expected errors: ${testCase.expectedErrors}, Got: ${errorCount}`);

  if (!passed) {
    console.log('Errors:', result.errors);
  }

  if (passed) passedTests++;
});

console.log(`\n=== Test Summary ===`);
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 All rule types are working correctly!');
} else {
  console.log('\n❌ Some rule types have issues that need to be fixed.');
}
