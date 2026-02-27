# SaaS Production Database Schema

This document outlines the exact, production-ready SaaS database architecture designed specifically for the Checklist & Workflow engine. Note the heavy inclusion of Multi-Tenancy (Client/Contract separation), Auditing, Soft Deletion, and Performance Indexing.

## Key Principles Applied:
- **Multi-Tenancy**: Every operational table is locked down with `ClientCode` and `ClientContractCode`.
- **Soft Deletes**: Data is never hard-deleted (`IsDeleted`, `DeletedBy`, `DeletedOn`).
- **Audit Trails**: Extensive tracking through `CreatedBy`, `UpdatedBy` and history tables.
- **Data Integrity**: Primary keys use `UNIQUEIDENTIFIER` (UUIDs) for external APIs instead of sequential integers, while foreign keys use internal integers for speed.

---

### 1. `PayrollOpsTasks` (Core Workflow Table)
The master table tracking all active and historical checklist configurations.

```sql
CREATE TABLE [dbo].[PayrollOpsTasks] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [TaskGuid] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(), -- Safe public identifier for APIs
    [ClientCode] NVARCHAR(100) NOT NULL,                  -- TENANT ID
    [ClientContractCode] NVARCHAR(100) NOT NULL,          -- CONTRACT ID
    
    [CategoryId] INT NOT NULL,
    [Title] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    
    [Status] NVARCHAR(50) NOT NULL DEFAULT 'pending',
    [Priority] NVARCHAR(50) NOT NULL DEFAULT 'medium',
    [RiskLevel] NVARCHAR(50) NULL,
    
    [Assignee] NVARCHAR(100) NULL,                        -- ID/Name of assigned resource
    [AssigneeType] NVARCHAR(50) NULL CHECK ([AssigneeType] IN ('user', 'role', 'usergroup')),
    
    [DueDate] DATETIME NOT NULL,
    [EstimatedTime] NVARCHAR(50) NULL,
    [Tags] NVARCHAR(MAX) NULL,                            -- JSON Array or CSV
    
    [FormId] INT NULL,
    [WorkflowId] INT NULL,
    [SendNotifications] BIT DEFAULT 1,
    
    [IsBatch] BIT DEFAULT 0,
    [ManagerRemarks] NVARCHAR(MAX) NULL,
    [ClientRemarks] NVARCHAR(MAX) NULL,
    
    -- Recurrence Module
    [RecurrenceType] NVARCHAR(50) NULL CHECK ([RecurrenceType] IN ('none', 'once', 'daily', 'weekly', 'monthly', 'yearly')),
    [RecurrenceDay] INT NULL,
    [AutoAssign] BIT DEFAULT 0,
    [ReminderDays] INT DEFAULT 0,
    
    -- Audit & Soft Delete
    [CreatedBy] NVARCHAR(100) NOT NULL,
    [CreatedOn] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedBy] NVARCHAR(100) NULL,
    [UpdatedOn] DATETIME NULL,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [DeletedBy] NVARCHAR(100) NULL,
    [DeletedOn] DATETIME NULL
);

-- Essential Performance Indexes
CREATE NONCLUSTERED INDEX [IX_PayrollOpsTasks_Tenant] ON [dbo].[PayrollOpsTasks] ([ClientCode], [ClientContractCode]);
CREATE NONCLUSTERED INDEX [IX_PayrollOpsTasks_Status] ON [dbo].[PayrollOpsTasks] ([Status], [DueDate]);
CREATE UNIQUE NONCLUSTERED INDEX [IX_PayrollOpsTasks_Guid] ON [dbo].[PayrollOpsTasks] ([TaskGuid]);
```

### 2. `TaskTransactions` (Batch Items)
If a master task is acting on a batch of employees, those transactions map here.

```sql
CREATE TABLE [dbo].[TaskTransactions] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [ClientCode] NVARCHAR(100) NOT NULL,
    [TaskId] INT NOT NULL,
    [TransactionRef] NVARCHAR(100) NOT NULL, -- e.g. TR-001 (EMP Code)
    
    [Label] NVARCHAR(255) NOT NULL,
    [Amount] DECIMAL(18, 4) NOT NULL,
    [Currency] NVARCHAR(10) DEFAULT 'INR',
    
    [Status] NVARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'rolled_back'
    
    [VerifiedBy] NVARCHAR(100) NULL, 
    [VerifiedOn] DATETIME NULL,
    
    CONSTRAINT FK_TaskTransactions_Tasks FOREIGN KEY ([TaskId]) REFERENCES [dbo].[PayrollOpsTasks]([Id])
);

CREATE NONCLUSTERED INDEX [IX_TaskTransactions_Task] ON [dbo].[TaskTransactions] ([TaskId], [Status]);
```

### 3. `TaskWorkflowHistory` (Audit Logger)
Tracks the Process Cycle Timeline automatically whenever a state shifts.

```sql
CREATE TABLE [dbo].[TaskWorkflowHistory] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [ClientCode] NVARCHAR(100) NOT NULL,
    [TaskId] INT NOT NULL,
    
    [ActionedBy] NVARCHAR(100) NOT NULL,
    [RoleAtTime] NVARCHAR(100) NOT NULL,
    [ActionType] NVARCHAR(100) NOT NULL, -- 'status_change', 'manager_approval', 'client_rollback'
    
    [PreviousStatus] NVARCHAR(50) NULL,
    [NewStatus] NVARCHAR(50) NOT NULL,
    [Remarks] NVARCHAR(MAX) NULL,
    
    -- SLA Metrics snapshot at the exact moment of completion
    [SlaAllowedHours] DECIMAL(10,2) NULL,
    [SlaTakenHours] DECIMAL(10,2) NULL,
    [SlaStatus] NVARCHAR(50) NULL,
    
    [Timestamp] DATETIME NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT FK_TaskWorkflowHistory_Tasks FOREIGN KEY ([TaskId]) REFERENCES [dbo].[PayrollOpsTasks]([Id])
);
```

### 4. `TaskAttachments` (Evidence Storage)
SaaS environments need robust evidence storage tracking, mapping to object storage (like S3/Blob).

```sql
CREATE TABLE [dbo].[TaskAttachments] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [ClientCode] NVARCHAR(100) NOT NULL,
    [TaskId] INT NOT NULL,
    
    [FileName] NVARCHAR(255) NOT NULL,
    [StorageKey] NVARCHAR(1000) NOT NULL, -- The S3 or Azure Blob container URL/Key
    [FileType] NVARCHAR(100) NULL,
    [FileSizeKB] INT NULL,
    
    [UploadedBy] NVARCHAR(100) NOT NULL,
    [UploadedOn] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    
    CONSTRAINT FK_TaskAttachments_Tasks FOREIGN KEY ([TaskId]) REFERENCES [dbo].[PayrollOpsTasks]([Id])
);
```

---

### Mongoose / MongoDB Document Structures:
If the team strictly prefers NoSQL, here is the enhanced Multi-Tenant SaaS implementation in Node.js/Mongoose using embedded arrays where performant, but linked relations for heavy history logs.

```javascript
// Models/PayrollOpsTask.js
const mongoose = require('mongoose');

const PayrollOpsTaskSchema = new mongoose.Schema({
  // Tenant Identifiers
  clientCode: { type: String, required: true, index: true },
  clientContractCode: { type: String, required: true, index: true },
  
  // Core Tracking
  title: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'manager_approved', 'client_approved', 'closed', 'rejected'], default: 'pending', index: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  riskLevel: String,
  
  // Assignment
  assignee: String,
  assigneeType: { type: String, enum: ['user', 'role', 'usergroup'] },
  
  dueDate: { type: Date, required: true, index: true },
  estimatedTime: String,
  tags: [String],
  
  // App Configs
  isBatch: { type: Boolean, default: false },
  formId: Number,
  workflowId: Number,
  sendNotifications: { type: Boolean, default: true },

  // Embedded Transactions Array (Ideal for NoSQL Document storage)
  transactions: [{
    transactionRef: String,
    label: String,
    amount: Number,
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['pending', 'confirmed', 'rolled_back'], default: 'pending' },
    verifiedBy: String,
    verifiedOn: Date
  }],

  // Recurrency
  recurrence: {
      type: { type: String, enum: ['none', 'once', 'daily', 'weekly', 'monthly', 'yearly'], default: 'none' },
      day: Number,
      weekDays: [Number]
  },
  autoAssign: { type: Boolean, default: false },
  reminderDays: { type: Number, default: 0 },
  
  // Auditing
  managerRemarks: String,
  clientRemarks: String,
  isDeleted: { type: Boolean, default: false, select: false },
  
  createdBy: { type: String, required: true },
  updatedBy: String,
  deletedBy: String,
  deletedOn: Date
}, { timestamps: true });

// Ensure strict multi-tenancy + performance querying
PayrollOpsTaskSchema.index({ clientCode: 1, clientContractCode: 1, status: 1 });

module.exports = mongoose.model('PayrollOpsTask', PayrollOpsTaskSchema);
```

---

## Complete Workflow Lifecycle (Creation to Completion)

Here is the exact state machine and end-to-end flow of how checklists operate through the database.

### 1. Task Creation (`pending`)
- **Trigger**: System auto-generates tasks based on Recurrence rules, OR a SuperAdmin/Client Manager manually creates one.
- **Action**: A row is inserted into `PayrollOpsTasks` with `Status = 'pending'`.
- **Audit**: `TaskWorkflowHistory` logs the creation event.
- **Visibility**: Visible on exactly the `Assignee`'s dashboard (e.g., Payload Ops).

### 2. Execution / Operations (`in_progress`)
- **Trigger**: The assignee (`PayrollOps` User) begins working on the transaction/form.
- **Action**: Task `Status` shifts to `in_progress`.
- **Transactions**: If the task has Batch items (`TaskTransactions`), the user loops through them setting individual item statuses to `confirmed`.

### 3. Submission for Review (`completed`)
- **Trigger**: The assignee finishes the task/transactions and submits.
- **Action**: 
   - Application calls API to shift `PayrollOpsTasks.Status` to `'completed'`.
   - `TaskWorkflowHistory` records the exact SLA metrics taken by the User to complete the task.
- **Visibility**: The task is removed from the `PayrollOps` queue and appears in the `PayrollTechnicalLead` / `PayrollManager` queue under the Manager Dashboard.

### 4. Manager Verification (`manager_approved` / `rejected`)
- **Trigger**: The Approver reviews the records.
- **Action**:
   - **Approve**: Task `Status` updates to `'manager_approved'`. Flow proceeds to Client.
   - **Reject**: Task `Status` shifts back to `'pending'` or `'rejected'`. The previous Assignee gets a notification.
- **Audit**: Remarks are saved to `ManagerRemarks` and the Approval event is locked into the workflow history.

### 5. Final Client Acknowledgment (`client_approved` -> `closed`)
- **Trigger**: The `Client` logs in and reviews the `manager_approved` batch.
- **Action**: 
   - Client acknowledges and signs off. `Status` updates to `'client_approved'`.
   - A background chron-job or trigger officially locks the entire task to `'closed'` blocking all future edits.

---

## Production SQL Stored Procedures
In a high-throughput SaaS environment, complex state transitions should be wrapped in Stored Procedures (SPs) utilizing Transactions. This prevents partial updates (e.g., changing the task status but failing to log the audit history).

### `usp_UpdateTaskWorkflowState`
This SP safely transitions a task from one state to another AND logs it accurately to the Audit table in one atomic transaction.

```sql
CREATE PROCEDURE [dbo].[usp_UpdateTaskWorkflowState]
    @ClientCode NVARCHAR(100),
    @TaskId INT,
    @NewStatus NVARCHAR(50),
    @ActionedBy NVARCHAR(100),
    @RoleAtTime NVARCHAR(100),
    @Remarks NVARCHAR(MAX) = NULL,
    @SlaAllowedHours DECIMAL(10,2) = NULL,
    @SlaTakenHours DECIMAL(10,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PreviousStatus NVARCHAR(50);
    DECLARE @SlaStatus NVARCHAR(50) = NULL;

    BEGIN TRY
        -- Start Atomic Transaction
        BEGIN TRANSACTION;

        -- 1. Lock the row and get previous status
        SELECT @PreviousStatus = [Status]
        FROM [dbo].[PayrollOpsTasks] WITH (UPDLOCK, ROWLOCK)
        WHERE [Id] = @TaskId AND [ClientCode] = @ClientCode AND [IsDeleted] = 0;

        IF @PreviousStatus IS NULL
        BEGIN
            THROW 50001, 'Task does not exist or access denied.', 1;
        END

        -- 2. Calculate SLA Compliance if closing the Ops loop
        IF @SlaAllowedHours IS NOT NULL AND @SlaTakenHours IS NOT NULL
        BEGIN
            IF @SlaTakenHours <= @SlaAllowedHours
                SET @SlaStatus = 'On Time';
            ELSE
                SET @SlaStatus = 'Delayed';
        END

        -- 3. Update Master Task Record
        UPDATE [dbo].[PayrollOpsTasks]
        SET [Status] = @NewStatus,
            [UpdatedBy] = @ActionedBy,
            [UpdatedOn] = GETUTCDATE()
        WHERE [Id] = @TaskId AND [ClientCode] = @ClientCode;

        -- 4. Automatically Log to Audit History
        INSERT INTO [dbo].[TaskWorkflowHistory] (
            [ClientCode], [TaskId], [ActionedBy], [RoleAtTime], [ActionType], 
            [PreviousStatus], [NewStatus], [Remarks], [SlaAllowedHours], [SlaTakenHours], [SlaStatus]
        )
        VALUES (
            @ClientCode, @TaskId, @ActionedBy, @RoleAtTime, 'status_change',
            @PreviousStatus, @NewStatus, @Remarks, @SlaAllowedHours, @SlaTakenHours, @SlaStatus
        );

        -- Commit Transaction
        COMMIT TRANSACTION;
        
        -- Return Success
        SELECT 1 AS [Success], 'State updated successfully.' AS [Message];

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Rethrow Error to API
        THROW;
    END CATCH
END
GO
```

### `usp_GenerateMonthlyRecurringTasks`
To automate the creation of tasks on the 1st of every month automatically, this Stored Procedure should be mapped to a **SQL Server Agent Job** (or called via a backend Cron job like `node-cron` or `Hangfire`) that executes at **00:01 AM on the 1st day of every month**.

It automatically reads all active checklist configurations that have `RecurrenceType = 'monthly'` and clones fresh instances for the current month!

```sql
CREATE PROCEDURE [dbo].[usp_GenerateMonthlyRecurringTasks]
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CurrentDate DATETIME = GETUTCDATE();
    -- Gets the 1st day of the current month
    DECLARE @StartOfMonth DATETIME = DATEADD(month, DATEDIFF(month, 0, @CurrentDate), 0);
    
    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Insert new tasks by finding all active 'monthly' tasks
        INSERT INTO [dbo].[PayrollOpsTasks] (
            [ClientCode], [ClientContractCode], [CategoryId], [Title], [Description], 
            [Status], [Priority], [RiskLevel], [Assignee], [AssigneeType], 
            [DueDate], [EstimatedTime], [Tags], [FormId], [WorkflowId], 
            [SendNotifications], [IsBatch], [RecurrenceType], [RecurrenceDay], 
            [AutoAssign], [ReminderDays], [CreatedBy], [CreatedOn]
        )
        SELECT 
            t.[ClientCode], t.[ClientContractCode], t.[CategoryId], 
            -- Visually append the Month/Year to the cloned task Title (e.g. "Salary Processing (February 2026)")
            t.[Title] + ' (' + DATENAME(month, @CurrentDate) + ' ' + CAST(YEAR(@CurrentDate) AS NVARCHAR) + ')', 
            t.[Description], 
            'pending', t.[Priority], t.[RiskLevel], t.[Assignee], t.[AssigneeType], 
            
            -- Calculate the exact Due Date for this specific month using their chosen RecurrenceDay
            DATEADD(day, ISNULL(t.[RecurrenceDay], 1) - 1, @StartOfMonth), 
            
            t.[EstimatedTime], t.[Tags], t.[FormId], t.[WorkflowId], 
            t.[SendNotifications], t.[IsBatch], t.[RecurrenceType], t.[RecurrenceDay], 
            t.[AutoAssign], t.[ReminderDays], 'System_Chron_Job', @CurrentDate
            
        FROM [dbo].[PayrollOpsTasks] t
        WHERE t.[RecurrenceType] = 'monthly' 
          AND t.[IsDeleted] = 0
          
          -- Safety check array to ensure we don't accidentally duplicate tasks for this month if chron job misfires
          AND NOT EXISTS (
              SELECT 1 FROM [dbo].[PayrollOpsTasks] existing
              WHERE existing.[Title] LIKE t.[Title] + ' (' + DATENAME(month, @CurrentDate) + '%' 
                AND existing.[ClientCode] = t.[ClientCode]
                AND existing.[ClientContractCode] = t.[ClientContractCode]
                AND MONTH(existing.[CreatedOn]) = MONTH(@CurrentDate)
                AND YEAR(existing.[CreatedOn]) = YEAR(@CurrentDate)
          );

        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
```
