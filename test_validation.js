// Test script for ValidationEngine.js
import ValidationEngine from './src/services/ValidationEngine.js';

// Sample form data for testing
const sampleFormData = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  birthDate: '1999-01-01',
  salary: '50000',
  department: 'IT',
  startDate: '2023-01-01',
  endDate: '2023-12-31',
  managerId: 'MGR001',
  employeeId: 'EMP001',
  firstName: '1990-01-01',
  dateField1: '2023-10-15', // for date format tests
  dateField2: '10/15/2023',
  dateField3: '15/10/2023',
  dateField4: '2023/10/15',
  dateField5: 'invalid-date',
  dateField6: '2023-02-30', // invalid date
  dateField7: '', // empty
  dateField8: '2023-10-15' // for custom regex
};

// Sample template
const sampleTemplate = {
  fields: [
    { name: 'name', label: 'Name', applicable: ['form'], validation: 'required' },
    { name: 'email', label: 'Email', applicable: ['form'], validation: 'required' },
    { name: 'phone', label: 'Phone', applicable: ['form'], validation: 'required' },
    { name: 'birthDate', label: 'Birth Date', applicable: ['form'], validation: 'required' },
    { name: 'salary', label: 'Salary', applicable: ['form'], validation: 'required' },
    { name: 'department', label: 'Department', applicable: ['form'], validation: 'required' },
    { name: 'startDate', label: 'Start Date', applicable: ['form'], validation: 'required' },
    { name: 'endDate', label: 'End Date', applicable: ['form'], validation: 'required' },
    { name: 'managerId', label: 'Manager ID', applicable: ['form'] },
    { name: 'employeeId', label: 'Employee ID', applicable: ['form'], validation: 'required' },
    { name: 'firstName', label: 'First Name', applicable: ['form'], validation: 'date' },
    { name: 'dateField1', label: 'Date Field 1', applicable: ['form'], validation: 'date' },
    { name: 'dateField2', label: 'Date Field 2', applicable: ['form'], validation: 'date' },
    { name: 'dateField3', label: 'Date Field 3', applicable: ['form'], validation: 'date' },
    { name: 'dateField4', label: 'Date Field 4', applicable: ['form'], validation: 'date' },
    { name: 'dateField5', label: 'Date Field 5', applicable: ['form'], validation: 'date' },
    { name: 'dateField6', label: 'Date Field 6', applicable: ['form'], validation: 'date' },
    { name: 'dateField7', label: 'Date Field 7', applicable: ['form'], validation: 'date' },
    { name: 'dateField8', label: 'Date Field 8', applicable: ['form'], validation: 'pattern' } // custom regex
  ]
};

// Sample global rules
const sampleGlobalRules = [
  { type: 'required', field: 'name', errorMessage: 'Name is required' },
  { type: 'email-format', field: 'email', errorMessage: 'Invalid email' },
  { type: 'phone-format', field: 'phone', errorMessage: 'Invalid phone' },
  { type: 'age', field: 'birthDate', condition: '18-65', errorMessage: 'Age must be between 18 and 65' },
  { type: 'salary-range', field: 'salary', condition: '30000-100000', errorMessage: 'Salary out of range' },
  { type: 'department-check', field: 'department', condition: 'IT,HR,Finance', errorMessage: 'Invalid department' },
  { type: 'date-range', field: 'startDate', condition: '2020-01-01:2025-12-31', errorMessage: 'Start date out of range' },
  { type: 'date-before', field: 'startDate', condition: 'endDate', errorMessage: 'Start date must be before end date' },
  { type: 'pattern-match', field: 'employeeId', condition: 'employeeId:EMP\\d{3}', errorMessage: 'Invalid employee ID format' },
  { type: 'conditional-required', field: 'managerId', condition: 'if(department==IT,managerId)', errorMessage: 'Manager ID required for IT' }
];

// Test function
function runTests() {
  console.log('Running ValidationEngine tests...\n');

  // Test 1: Valid data
  console.log('Test 1: Valid data');
  const validTemplate = {
    fields: [
      { name: 'name', label: 'Name', applicable: ['form'], validation: 'required' },
      { name: 'email', label: 'Email', applicable: ['form'], validation: 'email' },
      { name: 'phone', label: 'Phone', applicable: ['form'], validation: 'required' },
      { name: 'birthDate', label: 'Birth Date', applicable: ['form'], validation: 'date' },
      { name: 'salary', label: 'Salary', applicable: ['form'], validation: 'numeric' },
      { name: 'department', label: 'Department', applicable: ['form'], validation: 'list' },
      { name: 'startDate', label: 'Start Date', applicable: ['form'], validation: 'date' },
      { name: 'endDate', label: 'End Date', applicable: ['form'], validation: 'date' },
      { name: 'employeeId', label: 'Employee ID', applicable: ['form'], validation: 'required' }
    ]
  };
  const result1 = ValidationEngine.validate({ template: validTemplate, formData: sampleFormData });
  console.log('Result:', result1);
  console.log('Expected: valid: true, errors: {}');
  console.log('Pass:', result1.valid && Object.keys(result1.errors).length === 0 ? 'YES' : 'NO');
  console.log('');

  // Test 2: Missing required field (name)
  console.log('Test 2: Missing required field (name)');
  const missingNameData = { ...sampleFormData, name: '' };
  const result2 = ValidationEngine.validate({ template: sampleTemplate, formData: missingNameData });
  console.log('Result:', result2);
  console.log('Expected: valid: false, errors should contain name error');
  console.log('Pass:', !result2.valid && result2.errors.name ? 'YES' : 'NO');
  console.log('');

  // Test 3: Invalid date for firstName
  console.log('Test 3: Invalid date for firstName');
  const invalidDateData = { ...sampleFormData, firstName: 'Jane' };
  const result3 = ValidationEngine.validate({ template: sampleTemplate, formData: invalidDateData });
  console.log('Result:', result3);
  console.log('Expected: valid: false, errors should contain firstName error');
  console.log('Pass:', !result3.valid && result3.errors.firstName ? 'YES' : 'NO');
  console.log('');

  // Test 4: Case sensitivity test - "Required" vs "required"
  console.log('Test 4: Case sensitivity - "Required" should fail');
  const caseSensitiveTemplate = {
    fields: [
      { name: 'name', label: 'Name', applicable: ['form'], validation: 'Required' }
    ]
  };
  const caseData = { name: '' };
  const result4 = ValidationEngine.validate({ template: caseSensitiveTemplate, formData: caseData });
  console.log('Result:', result4);
  console.log('Expected: valid: true (since "Required" is not a known type, no validation)');
  console.log('Pass:', result4.valid ? 'YES' : 'NO');
  console.log('');

  // Test 5: Valid date in various formats
  console.log('Test 5: Valid date in various formats');
  const dateFormatTemplate1 = {
    fields: [
      { name: 'dateField1', label: 'Date Field 1', applicable: ['form'], validation: 'date' },
      { name: 'dateField2', label: 'Date Field 2', applicable: ['form'], validation: 'date' },
      { name: 'dateField3', label: 'Date Field 3', applicable: ['form'], validation: 'date' },
      { name: 'dateField4', label: 'Date Field 4', applicable: ['form'], validation: 'date' }
    ]
  };
  const dateData1 = {
    dateField1: '2023-10-15', // yyyy-mm-dd
    dateField2: '10/15/2023', // mm/dd/yyyy
    dateField3: '15/10/2023', // dd/mm/yyyy (ambiguous, but valid)
    dateField4: '2023/10/15'  // yyyy/mm/dd
  };
  const result5 = ValidationEngine.validate({ template: dateFormatTemplate1, formData: dateData1 });
  console.log('Result:', result5);
  console.log('Expected: valid: true (all common date formats accepted)');
  console.log('Pass:', result5.valid ? 'YES' : 'NO');
  console.log('');

  // Test 6: Invalid date - should fail
  console.log('Test 6: Invalid date - should fail');
  const dateFormatTemplate2 = {
    fields: [
      { name: 'dateField5', label: 'Date Field 5', applicable: ['form'], validation: 'date' }
    ]
  };
  const dateData2 = { dateField5: 'invalid-date' };
  const result6 = ValidationEngine.validate({ template: dateFormatTemplate2, formData: dateData2 });
  console.log('Result:', result6);
  console.log('Expected: valid: false, error about invalid date');
  console.log('Pass:', !result6.valid && result6.errors.dateField5 ? 'YES' : 'NO');
  console.log('');

  // Test 7: Invalid date but correct format - should fail date validity
  console.log('Test 7: Invalid date but correct format - should fail date validity');
  const dateFormatTemplate3 = {
    fields: [
      { name: 'dateField6', label: 'Date Field 6', applicable: ['form'], validation: 'date' }
    ]
  };
  const dateData3 = { dateField6: '2023-02-30' };
  const result7 = ValidationEngine.validate({ template: dateFormatTemplate3, formData: dateData3 });
  console.log('Result:', result7);
  console.log('Expected: valid: false, error about invalid date');
  console.log('Pass:', !result7.valid && result7.errors.dateField6 ? 'YES' : 'NO');
  console.log('');

  // Test 8: Empty date field - should pass (null check)
  console.log('Test 8: Empty date field - should pass (null check)');
  const dateFormatTemplate4 = {
    fields: [
      { name: 'dateField7', label: 'Date Field 7', applicable: ['form'], validation: 'date' }
    ]
  };
  const dateData4 = { dateField7: '' };
  const result8 = ValidationEngine.validate({ template: dateFormatTemplate4, formData: dateData4 });
  console.log('Result:', result8);
  console.log('Expected: valid: true (empty values are allowed)');
  console.log('Pass:', result8.valid ? 'YES' : 'NO');
  console.log('');

  console.log('All tests completed.');
}

runTests();
