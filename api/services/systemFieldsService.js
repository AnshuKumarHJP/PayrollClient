import api from './api.js';

const systemFieldsService = {
  // Get all system fields
  getAllSystemFields: async () => {
    try {
      // Since system fields are not in db.json, return static system fields for now
      return [
        { id: "employeeId", label: "Employee ID", type: "text", required: true },
        { id: "firstName", label: "First Name", type: "text", required: true },
        { id: "lastName", label: "Last Name", type: "text", required: true },
        { id: "email", label: "Email Address", type: "email", required: true },
        { id: "phone", label: "Phone Number", type: "text", required: false },
        { id: "dateOfBirth", label: "Date of Birth", type: "date", required: false },
        { id: "joiningDate", label: "Joining Date", type: "date", required: true },
        { id: "department", label: "Department", type: "select", required: true },
        { id: "designation", label: "Designation", type: "text", required: true },
        { id: "salary", label: "Monthly Salary", type: "number", required: true },
        { id: "manager", label: "Manager Name", type: "text", required: false },
        { id: "workLocation", label: "Work Location", type: "text", required: true }
      ];
    } catch (error) {
      console.error('Error fetching system fields:', error);
      throw error;
    }
  },

  // Get system fields by module
  getSystemFieldsByModule: async (module) => {
    try {
      // For now, return all fields. In future, filter by module
      return await this.getAllSystemFields();
    } catch (error) {
      console.error('Error fetching system fields by module:', error);
      throw error;
    }
  }
};

export default systemFieldsService;
