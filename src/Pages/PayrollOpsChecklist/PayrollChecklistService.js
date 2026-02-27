import axios from "axios";

// JSON Server URL
const BASE_URL = "http://localhost:3001";

// ---------------------------------------
// Payroll Ops Check List Tasks
// ---------------------------------------

export const getPayrollOpsTasks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/payrollOpsTasks`);
        return response.data;
    } catch (error) {
        console.error("Error fetching payroll ops tasks:", error);
        throw error;
    }
};

export const getPayrollOpsTaskById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/payrollOpsTasks/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching task with ID ${id}:`, error);
        throw error;
    }
};

export const createPayrollOpsTask = async (taskData) => {
    try {
        const response = await axios.post(`${BASE_URL}/payrollOpsTasks`, taskData);
        return response.data;
    } catch (error) {
        console.error("Error creating payroll ops task:", error);
        throw error;
    }
};

export const updatePayrollOpsTask = async (id, taskData) => {
    try {
        const response = await axios.put(`${BASE_URL}/payrollOpsTasks/${id}`, taskData);
        return response.data;
    } catch (error) {
        console.error(`Error updating task with ID ${id}:`, error);
        throw error;
    }
};

export const patchPayrollOpsTask = async (id, partialData) => {
    try {
        const response = await axios.patch(`${BASE_URL}/payrollOpsTasks/${id}`, partialData);
        return response.data;
    } catch (error) {
        console.error(`Error patching task with ID ${id}:`, error);
        throw error;
    }
};

export const deletePayrollOpsTask = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/payrollOpsTasks/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting task with ID ${id}:`, error);
        throw error;
    }
};

// ---------------------------------------
// Team Users
// ---------------------------------------

export const getTeamUsers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/teamUsers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching team users:", error);
        throw error;
    }
};

// ---------------------------------------
// Roles
// ---------------------------------------

export const getRoles = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/roleOptions`);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
};

// ---------------------------------------
// Categories
// ---------------------------------------

export const getCategories = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await axios.post(`${BASE_URL}/categories`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axios.put(`${BASE_URL}/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error(`Error updating category with ID ${id}:`, error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting category with ID ${id}:`, error);
        throw error;
    }
};
// ---------------------------------------
// Finalization & Rollback
// ---------------------------------------

export const finalizeChecklist = async (payload) => {
    try {
        // Simulate moving data to main database
        const response = await axios.post(`${BASE_URL}/finalizedChecklists`, payload);
        return response.data;
    } catch (error) {
        console.error("Error finalizing checklist:", error);
        throw error;
    }
};

export const rollbackChecklist = async (month, year) => {
    try {
        // Simulate rollback by clearing or resetting data for that month
        console.log(`Rolling back data for ${month} ${year}`);
        return { success: true };
    } catch (error) {
        console.error("Error rolling back checklist:", error);
        throw error;
    }
};

// ---------------------------------------
// Batch Transactions
// ---------------------------------------

export const updateTransactionStatus = async (taskId, transactionId, newStatus) => {
    try {
        // In a real app, this would be a PATCH to a nested resource or a specific endpoint
        console.log(`Updating transaction ${transactionId} in task ${taskId} to ${newStatus}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating transaction status:", error);
        throw error;
    }
};
export const getStats = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/stats`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stats:", error);
        throw error;
    }
};

// ---------------------------------------
// Clients & Contracts
// ---------------------------------------

export const getClients = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/clients`);
        return response.data;
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
    }
};

export const getClientContracts = async (clientId = null) => {
    try {
        const url = clientId
            ? `${BASE_URL}/clientContracts?clientId=${clientId}`
            : `${BASE_URL}/clientContracts`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching client contracts:", error);
        throw error;
    }
};

export const getNavigationMenus = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/navigationMenus`);
        return response.data;
    } catch (error) {
        console.error("Error fetching navigation menus:", error);
        throw error;
    }
};

// ---------------------------------------
// Checklist Templates & Mappings
// ---------------------------------------

export const getChecklistTemplates = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/checklistTemplates`);
        return response.data;
    } catch (error) {
        console.error("Error fetching checklist templates:", error);
        throw error;
    }
};

export const getClientChecklistMappings = async (clientId) => {
    try {
        const url = clientId
            ? `${BASE_URL}/clientChecklistMappings?clientId=${clientId}`
            : `${BASE_URL}/clientChecklistMappings`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching checklist mappings:", error);
        throw error;
    }
};

export const updateClientChecklistMapping = async (id, mappingData) => {
    try {
        const response = await axios.put(`${BASE_URL}/clientChecklistMappings/${id}`, mappingData);
        return response.data;
    } catch (error) {
        console.error(`Error updating mapping ${id}:`, error);
        throw error;
    }
};

export const createClientChecklistMapping = async (mappingData) => {
    try {
        const response = await axios.post(`${BASE_URL}/clientChecklistMappings`, mappingData);
        return response.data;
    } catch (error) {
        console.error("Error creating mapping:", error);
        throw error;
    }
};

export const deleteClientChecklistMapping = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/clientChecklistMappings/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting mapping ${id}:`, error);
        throw error;
    }
};
