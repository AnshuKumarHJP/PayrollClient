import api from './api.js';
import jsPDF from 'jspdf';

const PAYSLIPS_ENDPOINT = '/payslips';

export const payslipsService = {
  // Get payslip by entry ID
  getPayslipByEntryId: async (entryId) => {
    const response = await api.get(`${PAYSLIPS_ENDPOINT}/entry/${entryId}`);
    return response.data;
  },

  // Generate payslip for entry
  generatePayslip: async (entryId) => {
    const response = await api.post(`${PAYSLIPS_ENDPOINT}/generate`, { entryId });
    return response.data;
  },

  // Download payslip
  downloadPayslip: async (entryId, format = 'pdf') => {
    // Get payslip data from db.json
    const response = await api.get(`${PAYSLIPS_ENDPOINT}?entryId=${entryId}`);
    const payslip = response.data[0];

    if (!payslip) {
      throw new Error('Payslip not found');
    }

    // Create PDF using jsPDF
    const doc = new jsPDF();

    // Add company header
    doc.setFontSize(20);
    doc.text('PAYSLIP', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Company Name', 105, 35, { align: 'center' });
    doc.text('Address Line 1', 105, 45, { align: 'center' });
    doc.text('City, State - PIN', 105, 55, { align: 'center' });

    // Employee details
    doc.setFontSize(14);
    doc.text('Employee Details', 20, 75);

    doc.setFontSize(10);
    doc.text(`Name: ${payslip.employeeName}`, 20, 85);
    doc.text(`Employee ID: ${payslip.employeeId}`, 20, 95);
    doc.text(`Payroll Cycle: ${payslip.cycleName}`, 20, 105);

    // Salary breakdown
    doc.setFontSize(14);
    doc.text('Earnings', 20, 125);

    doc.setFontSize(10);
    let yPos = 135;
    doc.text(`Basic Salary: ₹${(payslip.basicSalary || 0).toLocaleString()}`, 20, yPos);
    yPos += 10;
    doc.text(`HRA: ₹${(payslip.hra || 0).toLocaleString()}`, 20, yPos);
    yPos += 10;
    doc.text(`Conveyance: ₹${(payslip.conveyance || 0).toLocaleString()}`, 20, yPos);
    yPos += 10;
    doc.text(`LTA: ₹${(payslip.lta || 0).toLocaleString()}`, 20, yPos);
    yPos += 10;
    doc.text(`Medical: ₹${(payslip.medical || 0).toLocaleString()}`, 20, yPos);
    yPos += 10;
    doc.text(`Other Allowances: ₹${(payslip.otherAllowances || 0).toLocaleString()}`, 20, yPos);
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.text(`Gross Salary: ₹${(payslip.grossSalary || 0).toLocaleString()}`, 20, yPos);

    // Deductions
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('Deductions', 20, yPos + 20);

    doc.setFontSize(10);
    yPos += 30;
    doc.text(`PF: ₹${(payslip.pf || 0).toLocaleString()}`, 20, yPos);
    yPos += 10;
    doc.text(`Professional Tax: ₹${(payslip.professionalTax || 0).toLocaleString()}`, 20, yPos);
    yPos += 10;
    doc.text(`Income Tax: ₹${(payslip.incomeTax || 0).toLocaleString()}`, 20, yPos);
    yPos += 10;
    doc.text(`Loan Deduction: ₹${(payslip.loanDeduction || 0).toLocaleString()}`, 20, yPos);
    yPos += 10;
    doc.text(`Other Deductions: ₹${(payslip.otherDeductions || 0).toLocaleString()}`, 20, yPos);
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Deductions: ₹${(payslip.totalDeductions || 0).toLocaleString()}`, 20, yPos);
    yPos += 15;
    doc.setFontSize(12);
    doc.text(`Net Salary: ₹${(payslip.netSalary || 0).toLocaleString()}`, 20, yPos);

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date(payslip.generatedDate).toLocaleDateString()}`, 20, 280);
    doc.text('This is a computer generated payslip and does not require signature.', 20, 290);

    // Save the PDF
    doc.save(`payslip_${entryId}.pdf`);

    return payslip;
  },

  // Email payslip
  emailPayslip: async (entryId, emailOptions = {}) => {
    // Get payslip data first
    const getResponse = await api.get(`${PAYSLIPS_ENDPOINT}?entryId=${entryId}`);
    const payslip = getResponse.data[0];

    if (!payslip) {
      throw new Error('Payslip not found');
    }

    // Update payslip with email sent status
    const updateResponse = await api.patch(`${PAYSLIPS_ENDPOINT}/${payslip.id}`, {
      emailSent: true,
      emailSentDate: new Date().toISOString(),
      ...emailOptions
    });

    return updateResponse.data;
  },

  // Bulk generate payslips for cycle
  bulkGeneratePayslips: async (cycleId) => {
    const response = await api.post(`${PAYSLIPS_ENDPOINT}/bulk-generate`, { cycleId });
    return response.data;
  },

  // Bulk email payslips for cycle
  bulkEmailPayslips: async (cycleId, emailOptions = {}) => {
    const response = await api.post(`${PAYSLIPS_ENDPOINT}/bulk-email`, {
      cycleId,
      ...emailOptions
    });
    return response.data;
  },

  // Get payslip history for employee
  getPayslipHistory: async (employeeId, params = {}) => {
    const response = await api.get(`${PAYSLIPS_ENDPOINT}/history/${employeeId}`, { params });
    return response.data;
  },

  // Update payslip status
  updatePayslipStatus: async (entryId, status) => {
    const response = await api.patch(`${PAYSLIPS_ENDPOINT}/status/${entryId}`, { status });
    return response.data;
  },

  // Get payslip template
  getPayslipTemplate: async (templateId) => {
    const response = await api.get(`${PAYSLIPS_ENDPOINT}/templates/${templateId}`);
    return response.data;
  },

  // Update payslip template
  updatePayslipTemplate: async (templateId, templateData) => {
    const response = await api.put(`${PAYSLIPS_ENDPOINT}/templates/${templateId}`, templateData);
    return response.data;
  },

  // Preview payslip
  previewPayslip: async (entryId) => {
    const response = await api.get(`${PAYSLIPS_ENDPOINT}/preview/${entryId}`);
    return response.data;
  }
};
