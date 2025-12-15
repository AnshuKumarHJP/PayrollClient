import api from './api.js';

const ATTENDANCE_ENDPOINT = '/attendance';

export const attendanceService = {
  // Get all attendance records
  getAll: async (params = {}) => {
    const response = await api.get(ATTENDANCE_ENDPOINT, { params });
    return response.data;
  },

  // Get attendance by ID
  getById: async (id) => {
    const response = await api.get(`${ATTENDANCE_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get attendance by employee ID
  getByEmployeeId: async (employeeId, params = {}) => {
    const response = await api.get(`${ATTENDANCE_ENDPOINT}?employeeId=${employeeId}`, { params });
    return response.data;
  },

  // Get attendance by date range
  getByDateRange: async (employeeId, startDate, endDate) => {
    const response = await api.get(
      `${ATTENDANCE_ENDPOINT}?employeeId=${employeeId}&date_gte=${startDate}&date_lte=${endDate}`
    );
    return response.data;
  },

  // Create attendance record
  create: async (attendanceData) => {
    const response = await api.post(ATTENDANCE_ENDPOINT, {
      ...attendanceData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update attendance record
  update: async (id, attendanceData) => {
    const response = await api.put(`${ATTENDANCE_ENDPOINT}/${id}`, attendanceData);
    return response.data;
  },

  // Delete attendance record
  delete: async (id) => {
    const response = await api.delete(`${ATTENDANCE_ENDPOINT}/${id}`);
    return response.data;
  },

  // Bulk create attendance records
  bulkCreate: async (attendanceRecords) => {
    const records = attendanceRecords.map(record => ({
      ...record,
      createdAt: new Date().toISOString(),
    }));

    const response = await api.post(`${ATTENDANCE_ENDPOINT}/bulk`, records);
    return response.data;
  },

  // Get monthly attendance summary
  getMonthlySummary: async (employeeId, year, month) => {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const response = await api.get(
      `${ATTENDANCE_ENDPOINT}?employeeId=${employeeId}&date_gte=${startDate}&date_lte=${endDate}`
    );

    const records = response.data;
    const summary = {
      totalDays: records.length,
      presentDays: records.filter(r => r.status === 'present').length,
      absentDays: records.filter(r => r.status === 'absent').length,
      halfDays: records.filter(r => r.status === 'half-day').length,
      totalHours: records.reduce((sum, r) => sum + (r.hoursWorked || 0), 0),
      overtimeHours: records.reduce((sum, r) => sum + (r.overtime || 0), 0),
    };

    return summary;
  },

  // Mark attendance
  markAttendance: async (employeeId, date, checkIn, checkOut, status = 'present') => {
    const hoursWorked = checkIn && checkOut ?
      Math.round(((new Date(`2000-01-01T${checkOut}`) - new Date(`2000-01-01T${checkIn}`)) / (1000 * 60 * 60)) * 100) / 100 : 0;

    const response = await api.post(ATTENDANCE_ENDPOINT, {
      employeeId,
      date,
      checkIn,
      checkOut,
      hoursWorked,
      status,
      overtime: 0,
      createdAt: new Date().toISOString(),
    });

    return response.data;
  },
};
