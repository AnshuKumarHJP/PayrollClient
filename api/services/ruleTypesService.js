import api from './api.js';

const RULE_TYPES_ENDPOINT = '/ruleTypes';

const ruleTypesService = {
  // Get all rule types
  async getAllRuleTypes(params = {}) {
    try {
      const response = await api.get(RULE_TYPES_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching rule types:', error);
      throw error;
    }
  },

  // Get rule type by ID
  async getRuleTypeById(id) {
    try {
      const response = await api.get(`${RULE_TYPES_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rule type:', error);
      throw error;
    }
  },

  // Create rule type
  async createRuleType(ruleTypeData) {
    try {
      const response = await api.post(RULE_TYPES_ENDPOINT, {
        ...ruleTypeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating rule type:', error);
      throw error;
    }
  },

  // Update rule type
  async updateRuleType(id, ruleTypeData) {
    try {
      const response = await api.put(`${RULE_TYPES_ENDPOINT}/${id}`, {
        ...ruleTypeData,
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating rule type:', error);
      throw error;
    }
  },

  // Delete rule type
  async deleteRuleType(id) {
    try {
      const response = await api.delete(`${RULE_TYPES_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting rule type:', error);
      throw error;
    }
  },

  // Bulk delete rule types
  async bulkDeleteRuleTypes(ruleTypeIds) {
    try {
      const response = await api.delete(`${RULE_TYPES_ENDPOINT}/bulk`, {
        data: { ruleTypeIds }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting rule types:', error);
      throw error;
    }
  }
};

export default ruleTypesService;
