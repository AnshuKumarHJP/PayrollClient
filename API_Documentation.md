# API Documentation - Payroll Management System

This document lists all API calls used in the Payroll Management System project, including API path names, reasons for calling them, and the data returned from each API.

## API Services Overview

The project uses two types of API implementations:
1. **Mock APIs** (JSON Server) - Located in `api/services/` directory


---

## Authentication APIs

### Mock Authentication Service (`api/services/authService.js`)

| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/users` | GET | Validate user login credentials | User object (without password) or null | 4-5 hours | 1-2 seconds |
| `/users/{userId}` | GET | Get current user details after login | User data with accessible clients | 3-4 hours | 0.5-1 second |
| `/clients` | GET | Get list of clients for user access mapping | Array of client objects | 3-4 hours | 0.5-1 second |
| `/auth/logout` | POST | Log out current user | Success confirmation | 3 hours | 0.5-1 second |
| `/auth/verify` | GET | Verify if user authentication token is valid | Token validation status | 3-4 hours | 0.3-0.8 seconds |

###  Backend Authentication Service (`src/API/authService.js`)

| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/api/auth/login` | POST | Authenticate user with backend server | JWT tokens and user data | 6-8 hours | 2-5 seconds |
| `/api/auth/current-user` | GET | Get details of currently logged-in user | Current user information | 4-5 hours | 1-2 seconds |
| `/api/auth/logout` | POST | End user session on server | Logout confirmation | 3-4 hours | 0.5-1 second |

---

## Employee Management APIs (`api/services/employeeService.js`)

| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/employees` | GET | Retrieve list of all employees | Array of employee objects | 3-4 hours | 2-5 seconds |
| `/employees/{id}` | GET | Get detailed information for specific employee | Single employee object | 1-2 hours | 0.5-1 second |
| `/employees` | POST | Add new employee to system | Created employee with ID | 4-6 hours | 3-8 seconds |
| `/employees/{id}` | PUT | Modify existing employee information | Updated employee object | 3-4 hours | 2-4 seconds |
| `/employees/{id}` | DELETE | Remove employee from system | Success confirmation | 1-2 hours | 1-2 seconds |
| `/employees?q={query}` | GET | Search employees by name/ID | Filtered employee list | 2-3 hours | 1-3 seconds |
| `/employees?department={dept}` | GET | Filter employees by department | Employees in department | 2-3 hours | 1-2 seconds |
| `/employees?status={status}` | GET | Filter employees by status | Employees with status | 2-3 hours | 1-2 seconds |
| `/employees/{id}/manager` | PUT | Assign/change employee's manager | Updated employee record | 2-3 hours | 1-2 seconds |

---

## Leave Management APIs (`api/services/leaveService.js`)

### Leave Records
| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/leaveRecords` | GET | Retrieve all leave requests | Array of leave records | 5-6 hours | 2-5 seconds |
| `/leaveRecords/{id}` | GET | Get specific leave request details | Single leave record | 3-4 hours | 0.5-1 second |
| `/leaveRecords?employeeId={id}` | GET | Get leave history for employee | Employee's leave records | 4-5 hours | 1-3 seconds |
| `/leaveRecords` | POST | Submit new leave application | Created leave record | 6-8 hours | 3-8 seconds |
| `/leaveRecords/{id}` | PUT | Modify existing leave request | Updated leave record | 5-6 hours | 2-4 seconds |
| `/leaveRecords/{id}` | PATCH | Approve/reject leave request | Updated leave record | 4-5 hours | 1-2 seconds |
| `/leaveRecords/{id}` | DELETE | Remove leave record | Success confirmation | 3-4 hours | 1-2 seconds |
| `/leaveRecords/bulk` | POST | Create multiple leave records | Array of created records | 8-10 hours | 5-15 seconds |

### Leave Balances
| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/leaveBalances` | GET | Retrieve all leave balances | Array of balance records | 4-5 hours | 1-3 seconds |
| `/leaveBalances/{id}` | GET | Get specific balance record | Single balance object | 3-4 hours | 0.5-1 second |
| `/leaveBalances?employeeId={id}&year={year}` | GET | Get employee's balance for year | Employee's leave balance | 4-5 hours | 1-2 seconds |
| `/leaveBalances` | POST | Create new leave balance | Created balance record | 5-6 hours | 2-4 seconds |
| `/leaveBalances/{id}` | PUT | Modify leave balance | Updated balance record | 4-5 hours | 1-2 seconds |

---

## Attendance Management APIs (`api/services/attendanceService.js`)

| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/attendance` | GET | Retrieve all attendance records | Array of attendance records | 3-4 hours | 2-5 seconds |
| `/attendance/{id}` | GET | Get specific attendance record | Single attendance object | 1-2 hours | 0.5-1 second |
| `/attendance?employeeId={id}` | GET | Get attendance history for employee | Employee's attendance records | 2-3 hours | 1-3 seconds |
| `/attendance?employeeId={id}&date_gte={start}&date_lte={end}` | GET | Get attendance for date range | Filtered attendance records | 3-4 hours | 2-4 seconds |
| `/attendance` | POST | Add new attendance entry | Created attendance record | 4-5 hours | 3-6 seconds |
| `/attendance/{id}` | PUT | Modify attendance record | Updated record | 3-4 hours | 2-4 seconds |
| `/attendance/{id}` | DELETE | Remove attendance record | Success confirmation | 1-2 hours | 1-2 seconds |
| `/attendance/bulk` | POST | Create multiple attendance records | Array of created records | 6-8 hours | 5-15 seconds |

---

## Payroll Management APIs (`api/services/payrollService.js`)

### Payroll Cycles
| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/payrollCycles` | GET | Retrieve all payroll cycles | Array of payroll cycles | 5-6 hours | 2-5 seconds |
| `/payrollCycles/{id}` | GET | Get specific payroll cycle details | Single cycle object | 3-4 hours | 0.5-1 second |
| `/payrollCycles` | POST | Create new payroll cycle | Created cycle | 6-8 hours | 3-8 seconds |
| `/payrollCycles/{id}` | PUT | Modify cycle information | Updated cycle | 5-6 hours | 2-4 seconds |
| `/payrollCycles/{id}` | PATCH | Change cycle status | Updated cycle | 4-5 hours | 1-2 seconds |
| `/payrollCycles/{id}` | DELETE | Remove payroll cycle | Success confirmation | 3-4 hours | 1-2 seconds |

### Payroll Entries
| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/payrollEntries` | GET | Retrieve all payroll entries | Array of payroll entries | 5-6 hours | 2-5 seconds |
| `/payrollEntries/{id}` | GET | Get specific payroll entry | Single entry object | 3-4 hours | 0.5-1 second |
| `/payrollEntries?cycleId={id}` | GET | Get entries for specific cycle | Cycle entries with employee data | 4-5 hours | 1-3 seconds |
| `/payrollEntries?employeeId={id}&cycleId={cycleId}` | GET | Get employee's payroll for cycle | Single entry or null | 4-5 hours | 1-2 seconds |
| `/payrollEntries` | POST | Create payroll entry | Created entry | 6-8 hours | 3-8 seconds |
| `/payrollEntries/{id}` | PUT | Modify payroll entry | Updated entry | 5-6 hours | 2-4 seconds |
| `/payrollEntries/{id}` | DELETE | Remove payroll entry | Success confirmation | 3-4 hours | 1-2 seconds |

---

## Loan Management APIs (`api/services/loanService.js`)

| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/loans` | GET | Retrieve all loan records | Array of loan objects | 5-6 hours | 2-5 seconds |
| `/loans/{id}` | GET | Get specific loan details | Single loan object | 3-4 hours | 0.5-1 second |
| `/loans?employeeId={id}` | GET | Get all loans for employee | Employee's loans | 4-5 hours | 1-3 seconds |
| `/loans` | POST | Create new loan record | Created loan with EMI | 6-8 hours | 3-8 seconds |
| `/loans/{id}` | PUT | Modify loan information | Updated loan | 5-6 hours | 2-4 seconds |
| `/loans/{id}` | PATCH | Change loan status | Updated loan | 4-5 hours | 1-2 seconds |
| `/loans/{id}` | DELETE | Remove loan record | Success confirmation | 3-4 hours | 1-2 seconds |
| `/loans/bulk` | POST | Create multiple loan records | Array of created loans | 8-10 hours | 5-15 seconds |

---

## Audit Log APIs (`api/services/auditLogService.js`)

| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/auditLogs` | GET | Retrieve audit log entries | Array of audit logs | 5-6 hours | 2-5 seconds |
| `/auditLogs/{id}` | GET | Get specific audit log entry | Single log entry | 3-4 hours | 0.5-1 second |
| `/auditLogs?userId={id}` | GET | Get logs for specific user | User's audit logs | 4-5 hours | 1-3 seconds |
| `/auditLogs?module={module}` | GET | Get logs for specific module | Module-specific logs | 4-5 hours | 1-2 seconds |
| `/auditLogs?action={action}` | GET | Get logs for specific action | Action-specific logs | 4-5 hours | 1-2 seconds |
| `/auditLogs?timestamp_gte={start}&timestamp_lte={end}` | GET | Get logs in date range | Date-filtered logs | 5-6 hours | 2-4 seconds |
| `/auditLogs` | POST | Create new audit log entry | Created log entry | 6-8 hours | 3-8 seconds |
| `/auditLogs/bulk` | POST | Create multiple log entries | Array of created logs | 8-10 hours | 5-15 seconds |
| `/auditLogs/summary` | GET | Get audit log summary | Summary statistics | 4-5 hours | 1-3 seconds |
| `/auditLogs?q={query}` | GET | Search audit logs | Filtered log results | 4-5 hours | 1-3 seconds |

---

## Bulk Upload APIs (`api/services/bulkUploadService.js`)

| API Path | Method | Why We Call | What We Get |
|----------|--------|-------------|-------------|
| `/bulkUploads` | GET | Retrieve bulk upload records | Array of upload records |
| `/bulkUploads/{id}` | GET | Get specific upload details | Single upload object |
| `/bulkUploads?userId={id}` | GET | Get uploads for user | User's uploads |
| `/bulkUploads?status={status}` | GET | Get uploads by status | Status-filtered uploads |
| `/bulkUploads?module={module}` | GET | Get uploads by module | Module-specific uploads |
| `/bulkUploads` | POST | Create new bulk upload | Created upload record |
| `/bulkUploads/upload` | POST | Upload file for processing | Upload confirmation |
| `/bulkUploads/{id}/start` | POST | Start processing upload | Processing started |
| `/bulkUploads/{id}/progress` | GET | Get processing progress | Progress information |
| `/bulkUploads/{id}/results` | GET | Get processed results | Processing results |
| `/bulkUploads/{id}/errors` | GET | Get processing errors | Error details |
| `/bulkUploads/{id}/retry` | POST | Retry failed records | Retry results |

---

## Form Builder APIs (`src/API/FormBuilderService.js`)

| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/api/formbuilder/all` | GET | Retrieve all form templates | Array of form templates | 3-4 hours | 2-5 seconds |

---

## Additional API Services

The project includes many more API services with similar CRUD patterns:

### Reports Service (`api/services/reportsService.js`)
- `/reports` - Generate various business reports
- `/reports/payroll-summary` - Generate payroll summary reports
- `/reports/attendance` - Generate attendance reports
- `/reports/leave-utilization` - Generate leave reports
- `/reports/salary-register` - Generate salary register reports
- `/reports/loans` - Generate loan reports
- `/reports/reimbursements` - Generate reimbursement reports

### Workflow Service (`api/services/workflowService.js`)
- `/workflows` - Manage business process workflows
- `/workflowTasks` - Handle workflow tasks
- `/workflowStages` - Manage workflow stages

### User Management Service (`api/services/userManagementService.js`)
- `/users` - User administration
- `/roles` - Role management
- `/permissions` - Permission management

### Template Service (`api/services/templateService.js`)
- `/templates` - Manage data import templates
- `/templates/categories` - Template categories

### Settings Service (`api/services/settingsService.js`)
- `/settings` - System configuration
- `/settings/email/test` - Test email configuration
- `/settings/backup/trigger` - Trigger system backup

### Team Service (`api/services/teamService.js`)
- `/teams` - Team management
- `/teamMembers` - Team member operations
- `/teamTasks` - Team task management

### Validation Service (`api/services/validationRulesService.js`)
- `/validationRules` - Data validation rules
- `/validationRules/{id}/test` - Test validation rules

### Dashboard Services
- `/dashboard` - Main dashboard data
- `/opsDashboard` - Operations dashboard
- `/teamDashboard` - Team dashboard
- `/workflowDashboard` - Workflow dashboard

### Other Services

| API Path | Method | Why We Call | What We Get | Est. Dev Time | Est. Usage Time |
|----------|--------|-------------|-------------|---------------|-----------------|
| `/reimbursements` | GET | Retrieve expense reimbursements | Array of reimbursement records | 3-4 hours | 2-5 seconds |
| `/payslips` | GET | Generate payslips | Payslip data | 3-4 hours | 2-5 seconds |
| `/onboarding` | GET | Retrieve employee onboarding data | Onboarding information | 3-4 hours | 1-3 seconds |
| `/departments` | GET | Retrieve department information | Array of departments | 3-4 hours | 1-2 seconds |
| `/designations` | GET | Retrieve designation information | Array of designations | 3-4 hours | 1-2 seconds |
| `/taskAction` | POST | Perform task actions | Action result | 3-4 hours | 1-2 seconds |
| `/taskDetail` | GET | Get task details | Task information | 3-4 hours | 0.5-1 second |
| `/unclaimedTasks` | GET | Retrieve unclaimed tasks | Array of tasks | 3-4 hours | 1-3 seconds |
| `/userDropdown` | GET | Get user dropdown data | Dropdown options | 3-4 hours | 0.5-1 second |
| `/validationErrors` | GET | Retrieve validation errors | Array of errors | 3-4 hours | 1-2 seconds |
| `/salaryRegister` | GET | Retrieve salary register | Salary data | 3-4 hours | 2-5 seconds |
| `/ruleTypes` | GET | Retrieve rule types | Array of rule types | 3-4 hours | 1-2 seconds |
| `/systemFields` | GET | Retrieve system fields | Array of fields | 3-4 hours | 1-2 seconds |
| `/severityLevels` | GET | Retrieve severity levels | Array of levels | 3-4 hours | 1-2 seconds |
| `/importHistory` | GET | Retrieve import history | Array of import records | 3-4 hours | 1-3 seconds |
| `/home` | GET | Retrieve home page data | Home data | 3-4 hours | 1-2 seconds |
| `/clientServices` | GET | Retrieve client services | Array of services | 3-4 hours | 1-2 seconds |

---

*Note: This documentation covers the major API endpoints identified in the codebase. Some services may have additional endpoints or variations not listed here. For complete API coverage, refer to individual service files in the project.*
