import api from "./api.js";

const ONBOARDING_ENDPOINT = "/onboarding";


/* ---------------------------------------------------------
   AUTO GENERATE UNIQUE EMPLOYEE ID (service internal)
--------------------------------------------------------- */
const generateEmployeeId = async () => {
  const response = await api.get(ONBOARDING_ENDPOINT);
  const records = response.data || [];

  // Extract numeric part from EMPxxxx format
  const nums = records
    .map((r) => r.employeeId)
    .filter(Boolean)
    .map((id) => Number(id.replace(/\D+/g, "")))
    .filter((n) => !isNaN(n));

  const next = nums.length ? Math.max(...nums) + 1 : 1;

  return "EMP" + String(next).padStart(4, "0");
};


/* ---------------------------------------------------------
   Deep Merge Helper (Non-destructive)
--------------------------------------------------------- */
const deepMerge = (target, source) => {
  for (const key in source) {
    const value = source[key];

    // If nested object → recurse
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], value);
    } else {
      // Primitive → overwrite
      target[key] = value;
    }
  }
  return target;
};

export const onboardingService = {
  /* ---------------------------------------------------------
     GET ALL RECORDS
  --------------------------------------------------------- */
  getAll: async (params = {}) => {
    const response = await api.get(ONBOARDING_ENDPOINT, { params });
    return response.data;
  },

  /* ---------------------------------------------------------
     GET RECORD BY ID
  --------------------------------------------------------- */
  getById: async (id) => {
    const response = await api.get(`${ONBOARDING_ENDPOINT}/${id}`);
    return response.data;
  },

  /* ---------------------------------------------------------
     GET BY EMPLOYEE ID
  --------------------------------------------------------- */
  getByEmployeeId: async (employeeId) => {
    const response = await api.get(
      `${ONBOARDING_ENDPOINT}?employeeId=${employeeId}`
    );
    return response.data;
  },

  /* ---------------------------------------------------------
     CREATE NEW RECORD
  --------------------------------------------------------- */
  create: async (onboardingData) => {
    // If frontend did not send employeeId → auto-generate it
    const employeeId =
      onboardingData.employeeId || (await generateEmployeeId());

    const payload = {
      ...onboardingData,
      employeeId, // always unique, assigned here
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await api.post(ONBOARDING_ENDPOINT, payload);
    return response.data;
  },

  /* ---------------------------------------------------------
     UPDATE RECORD — SMART DEEP MERGE (🚀 Optimized)
  --------------------------------------------------------- */
  update: async (id, updatedData) => {
    const oldRes = await api.get(`${ONBOARDING_ENDPOINT}/${id}`);
    const oldData = oldRes.data;
    const merged = deepMerge({ ...oldData }, updatedData);
    const response = await api.put(`${ONBOARDING_ENDPOINT}/${id}`, {
      ...merged,
      updatedAt: new Date().toISOString(),
    });

    return response.data;
  },

  /* ---------------------------------------------------------
     UPDATE STATUS ONLY
  --------------------------------------------------------- */
  updateStatus: async (id, status, updatedBy = null) => {
    const response = await api.patch(`${ONBOARDING_ENDPOINT}/${id}`, {
      status,
      updatedBy,
      updatedAt: new Date().toISOString(),
    });

    return response.data;
  },

  /* ---------------------------------------------------------
     DELETE RECORD
  --------------------------------------------------------- */
  delete: async (id) => {
    const response = await api.delete(`${ONBOARDING_ENDPOINT}/${id}`);
    return response.data;
  },

  /* ---------------------------------------------------------
     BULK CREATE
  --------------------------------------------------------- */
  bulkCreate: async (records) => {
    const payload = records.map((r) => ({
      ...r,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const response = await api.post(`${ONBOARDING_ENDPOINT}/bulk`, payload);
    return response.data;
  },

  /* ---------------------------------------------------------
     GET BY STATUS
  --------------------------------------------------------- */
  getByStatus: async (status) => {
    const response = await api.get(`${ONBOARDING_ENDPOINT}?status=${status}`);
    return response.data;
  },
};
