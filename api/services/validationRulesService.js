import api from "./api.js";

const validationRulesService = {

  // ------------------------------
  // GET ALL RULES
  // ------------------------------
  async getAllRules() {
    const response = await api.get("/validationRules");
    return response.data.map(this.normalizeRule);
  },

  // ------------------------------
  // GET RULE BY ID
  // ------------------------------
  async getRuleById(id) {
    const response = await api.get(`/validationRules/${id}`);
    return this.normalizeRule(response.data);
  },

  // ------------------------------
  // CREATE NEW RULE
  // ------------------------------
  async createRule(ruleData) {
    const normalized = this.normalizeBeforeSave(ruleData);
    const response = await api.post("/validationRules", normalized);
    return this.normalizeRule(response.data);
  },

  // ------------------------------
  // UPDATE RULE
  // ------------------------------
  async updateRule(id, ruleData) {
    if (isNaN(id)) {
      throw new Error("Invalid rule ID: cannot update rule with NaN ID");
    }
    const normalized = this.normalizeBeforeSave(ruleData);
    const response = await api.put(`/validationRules/${id}`, normalized);
    return this.normalizeRule(response.data);
  },

  // ------------------------------
  // DELETE RULE
  // ------------------------------
  async deleteRule(id) {
    const response = await api.delete(`/validationRules/${id}`);
    return response.data;
  },

  // ------------------------------
  // TEST RULE
  // ------------------------------
  async testRule(ruleId, testValue) {
    const response = await api.post(`/validationRules/${ruleId}/test`, {
      value: testValue
    });
    return response.data;
  },

  // ------------------------------
  // GET RULES BY MODULE OR FIELD
  // If user passes: module="attendance"
  // But rule object only has field="email"
  // We filter using field names in template instead.
  // ------------------------------
  async getRulesByTemplate(template) {
    const response = await api.get("/validationRules");

    return response.data
      .map(this.normalizeRule)
      .filter(rule => {
        if (!template?.fields) return false;
        return template.fields.some(f => f.name === rule.field);
      });
  },

  // ------------------------------
  // BULK SAVE (JSON-SERVER SAFE VERSION)
  // JSON-server cannot use PUT /bulk
  // So: delete all → insert all
  // ------------------------------
  async saveAllRules(rules) {
    // 1. delete all
    const oldRules = await this.getAllRules();
    for (const r of oldRules) {
      await api.delete(`/validationRules/${r.id}`);
    }

    // 2. add new rules
    const newRules = [];
    for (const rule of rules) {
      const saved = await api.post("/validationRules", this.normalizeBeforeSave(rule));
      newRules.push(this.normalizeRule(saved.data));
    }

    return newRules;
  },

  // ------------------------------
  // NORMALIZE RULE FROM SERVER
  // Ensures:
  // - id always number
  // - severity always lowercase
  // - active always boolean
  // ------------------------------
  normalizeRule(rule) {
    let id = Number(rule.id);
    if (isNaN(id)) {
      id = Date.now(); // assign new id if invalid
    }
    return {
      ...rule,
      id,
      severity: (rule.severity || "error").toLowerCase(),
      active: rule.active !== false
    };
  },

  // ------------------------------
  // NORMALIZE RULE BEFORE SAVE
  // Removes undefined values, fixes ID type
  // ------------------------------
  normalizeBeforeSave(rule) {
    const clean = { ...rule };

    clean.id = rule.id ? Number(rule.id) : undefined;
    clean.active = rule.active !== false;

    // Prevent issues with empty condition
    if (!clean.condition) clean.condition = "";

    return clean;
  }
};

export default validationRulesService;
