import api from './api.js';

const PAYROLL_CYCLES_ENDPOINT = '/payrollCycles';
const PAYROLL_ENTRIES_ENDPOINT = '/payrollEntries';

export const payrollService = {
  // Payroll Cycles
  // Get all payroll cycles
  getAllCycles: async (params = {}) => {
    const response = await api.get(PAYROLL_CYCLES_ENDPOINT, { params });
    return response.data;
  },

  // Get payroll cycle by ID
  getCycleById: async (id) => {
    const response = await api.get(`${PAYROLL_CYCLES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new payroll cycle
  createCycle: async (cycleData) => {
    const response = await api.post(PAYROLL_CYCLES_ENDPOINT, {
      ...cycleData,
      status: 'draft',
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update payroll cycle
  updateCycle: async (id, cycleData) => {
    const response = await api.put(`${PAYROLL_CYCLES_ENDPOINT}/${id}`, cycleData);
    return response.data;
  },

  // Update cycle status
  updateCycleStatus: async (id, status, processedBy = null) => {
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (processedBy) updateData.processedBy = processedBy;
    if (status === 'processed') updateData.processedAt = new Date().toISOString();

    const response = await api.patch(`${PAYROLL_CYCLES_ENDPOINT}/${id}`, updateData);
    return response.data;
  },

  // Delete payroll cycle
  deleteCycle: async (id) => {
    const response = await api.delete(`${PAYROLL_CYCLES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Payroll Entries
  // Get all payroll entries
  getAllEntries: async (params = {}) => {
    const response = await api.get(PAYROLL_ENTRIES_ENDPOINT, { params });
    return response.data;
  },

  // Get payroll entry by ID
  getEntryById: async (id) => {
    const response = await api.get(`${PAYROLL_ENTRIES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get entries by cycle ID
  getEntriesByCycleId: async (cycleId) => {
    const response = await api.get(`${PAYROLL_ENTRIES_ENDPOINT}?cycleId=${cycleId}`);
    const entries = response.data;

    // Enrich entries with employee data
    const enrichedEntries = await Promise.all(
      entries.map(async (entry) => {
        try {
          const employeeResponse = await api.get(`/employees?employeeId=${entry.employeeId}`);
          const employee = employeeResponse.data[0];

          return {
            ...entry,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            department: employee.department,
            designation: employee.designation,
          };
        } catch (error) {
          console.error(`Error fetching employee data for ${entry.employeeId}:`, error);
          // Return entry with default values if employee not found
          return {
            ...entry,
            employeeName: 'Unknown Employee',
            department: 'Unknown',
            designation: 'Unknown',
          };
        }
      })
    );

    return enrichedEntries;
  },

  // Get entry by employee and cycle
  getEntryByEmployeeAndCycle: async (employeeId, cycleId) => {
    const response = await api.get(
      `${PAYROLL_ENTRIES_ENDPOINT}?employeeId=${employeeId}&cycleId=${cycleId}`
    );
    return response.data[0] || null;
  },

  // Create payroll entry
  createEntry: async (entryData) => {
    const response = await api.post(PAYROLL_ENTRIES_ENDPOINT, {
      ...entryData,
      status: 'calculated',
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update payroll entry
  updateEntry: async (id, entryData) => {
    const response = await api.put(`${PAYROLL_ENTRIES_ENDPOINT}/${id}`, entryData);
    return response.data;
  },

  // Delete payroll entry
  deleteEntry: async (id) => {
    const response = await api.delete(`${PAYROLL_ENTRIES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Validate payroll calculation prerequisites
  validatePayrollPrerequisites: async (cycleId) => {
    const cycle = await payrollService.getCycleById(cycleId);
    if (!cycle) throw new Error('Payroll cycle not found');

    const validationResults = {
      isValid: true,
      warnings: [],
      errors: [],
      eligibleEmployees: []
    };

    // 1. Check onboarding status
    const onboardingResponse = await api.get('/onboarding');
    const onboardingRecords = onboardingResponse.data;

    // 2. Check leave records for the cycle period
    const leaveResponse = await api.get('/leaveRecords');
    const leaveRecords = leaveResponse.data;

    // 3. Get active employees
    const employeesResponse = await api.get('/employees?status=active');
    const activeEmployees = employeesResponse.data;

    // 4. Check reimbursements that might affect payroll
    const reimbursementsResponse = await api.get('/reimbursements?status=pending');
    const pendingReimbursements = reimbursementsResponse.data;

    // Validate each active employee
    for (const employee of activeEmployees) {
      const employeeId = employee.employeeId;
      let isEligible = true;
      const employeeWarnings = [];
      const employeeErrors = [];

      // Check onboarding completion
      const onboardingRecord = onboardingRecords.find(o => o.employeeId === employeeId);
      if (!onboardingRecord) {
        employeeErrors.push('No onboarding record found');
        isEligible = false;
      } else if (onboardingRecord.status !== 'completed') {
        employeeErrors.push(`Onboarding status: ${onboardingRecord.status}`);
        isEligible = false;
      }

      // Check for approved leaves during the cycle period
      const cycleStart = new Date(cycle.startDate);
      const cycleEnd = new Date(cycle.endDate);

      const overlappingLeaves = leaveRecords.filter(leave =>
        leave.employeeId === employeeId &&
        leave.status === 'approved' &&
        (
          (new Date(leave.startDate) <= cycleEnd && new Date(leave.endDate) >= cycleStart)
        )
      );

      if (overlappingLeaves.length > 0) {
        const totalLeaveDays = overlappingLeaves.reduce((sum, leave) => {
          const leaveStart = new Date(leave.startDate);
          const leaveEnd = new Date(leave.endDate);
          const effectiveStart = leaveStart > cycleStart ? leaveStart : cycleStart;
          const effectiveEnd = leaveEnd < cycleEnd ? leaveEnd : cycleEnd;
          const days = Math.ceil((effectiveEnd - effectiveStart) / (1000 * 60 * 60 * 24)) + 1;
          return sum + days;
        }, 0);

        if (totalLeaveDays > 0) {
          employeeWarnings.push(`${totalLeaveDays} days of approved leave during cycle period`);
        }
      }

      // Check for pending reimbursements
      const employeeReimbursements = pendingReimbursements.filter(r => r.employeeId === employeeId);
      if (employeeReimbursements.length > 0) {
        const totalPending = employeeReimbursements.reduce((sum, r) => sum + r.amount, 0);
        employeeWarnings.push(`₹${totalPending} in pending reimbursements`);
      }

      // Check joining date vs cycle start
      const joiningDate = new Date(employee.joiningDate);
      if (joiningDate > cycleEnd) {
        employeeErrors.push('Employee joins after cycle end date');
        isEligible = false;
      }

      if (isEligible) {
        validationResults.eligibleEmployees.push({
          ...employee,
          warnings: employeeWarnings
        });
      } else {
        validationResults.errors.push({
          employeeId,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          issues: employeeErrors
        });
      }

      // Add warnings even for eligible employees
      if (employeeWarnings.length > 0 && isEligible) {
        validationResults.warnings.push({
          employeeId,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          issues: employeeWarnings
        });
      }
    }

    // Overall validation status
    validationResults.isValid = validationResults.errors.length === 0;

    return validationResults;
  },

  // Calculate payroll for cycle
  calculatePayrollForCycle: async (cycleId) => {
    // First, validate prerequisites
    const validation = await payrollService.validatePayrollPrerequisites(cycleId);

    if (!validation.isValid) {
      const errorMessages = validation.errors.map(err =>
        `${err.employeeName} (${err.employeeId}): ${err.issues.join(', ')}`
      );
      throw new Error(`Payroll validation failed:\n${errorMessages.join('\n')}`);
    }

    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.warn('Payroll calculation warnings:');
      validation.warnings.forEach(warning => {
        console.warn(`${warning.employeeName} (${warning.employeeId}): ${warning.issues.join(', ')}`);
      });
    }

    // This would typically call a backend calculation endpoint
    // For now, we'll simulate the calculation
    const cycle = await payrollService.getCycleById(cycleId);
    if (!cycle) throw new Error('Payroll cycle not found');

    // Use validated eligible employees instead of all active employees
    const employees = validation.eligibleEmployees;

    const payrollEntries = [];

    for (const employee of employees) {
      // Calculate salary components (simplified calculation)
      const basicSalary = employee.salary * 0.4; // 40% of total salary
      const hra = basicSalary * 0.5; // 50% of basic
      const conveyance = 1920; // Standard conveyance allowance
      const lta = basicSalary * 0.0833; // 1 month basic
      const medical = 1250; // Standard medical allowance
      const otherAllowances = employee.salary * 0.1; // 10% other allowances

      const grossSalary = basicSalary + hra + conveyance + lta + medical + otherAllowances;

      // Deductions
      const pf = basicSalary * 0.12; // 12% PF
      const professionalTax = 2400; // Annual professional tax
      const incomeTax = calculateIncomeTax(grossSalary * 12); // Monthly income tax
      const loanDeduction = 0; // Would be calculated from active loans
      const otherDeductions = 0;

      const totalDeductions = pf + professionalTax + incomeTax + loanDeduction + otherDeductions;
      const netSalary = grossSalary - totalDeductions;

      const entry = {
        cycleId: parseInt(cycleId),
        employeeId: employee.employeeId,
        basicSalary: Math.round(basicSalary),
        hra: Math.round(hra),
        conveyance: conveyance,
        lta: Math.round(lta),
        medical: medical,
        otherAllowances: Math.round(otherAllowances),
        grossSalary: Math.round(grossSalary),
        pf: Math.round(pf),
        professionalTax: professionalTax,
        incomeTax: Math.round(incomeTax),
        loanDeduction: loanDeduction,
        otherDeductions: otherDeductions,
        totalDeductions: Math.round(totalDeductions),
        netSalary: Math.round(netSalary),
        status: 'calculated',
        createdAt: new Date().toISOString(),
      };

      payrollEntries.push(entry);
    }

    // Create entries individually since JSON Server doesn't support bulk operations
    const createdEntries = [];
    for (const entry of payrollEntries) {
      try {
        const response = await api.post(PAYROLL_ENTRIES_ENDPOINT, entry);
        createdEntries.push(response.data);
      } catch (error) {
        console.error('Error creating payroll entry:', error);
        throw error;
      }
    }

    // Calculate totals and update cycle
    const totalEmployees = createdEntries.length;
    const totalNetSalary = createdEntries.reduce((sum, entry) => sum + entry.netSalary, 0);

    // Update cycle with totals
    await api.patch(`${PAYROLL_CYCLES_ENDPOINT}/${cycleId}`, {
      totalEmployees,
      totalNetSalary
    });

    return createdEntries;
  },

  // Lock payroll cycle
  lockCycle: async (cycleId) => {
    const response = await api.patch(`${PAYROLL_CYCLES_ENDPOINT}/${cycleId}`, {
      status: 'locked',
      lockedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get payroll summary for cycle
  getPayrollSummary: async (cycleId) => {
    const [cycle, entries] = await Promise.all([
      payrollService.getCycleById(cycleId),
      payrollService.getEntriesByCycleId(cycleId)
    ]);

    const summary = {
      cycle,
      totalEmployees: entries.length,
      totalGrossSalary: entries.reduce((sum, e) => sum + e.grossSalary, 0),
      totalDeductions: entries.reduce((sum, e) => sum + e.totalDeductions, 0),
      totalNetSalary: entries.reduce((sum, e) => sum + e.netSalary, 0),
      averageSalary: entries.length > 0 ? Math.round(entries.reduce((sum, e) => sum + e.netSalary, 0) / entries.length) : 0,
      entries,
    };

    return summary;
  },
};

// Helper function to calculate income tax (simplified)
function calculateIncomeTax(annualSalary) {
  // Simplified tax calculation for demonstration
  let tax = 0;
  const taxableIncome = annualSalary - 50000; // Standard deduction

  if (taxableIncome > 0) {
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.2;
    } else {
      tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.3;
    }
  }

  return Math.round(tax / 12); // Monthly tax
}
