# API Requirements for Unclaimed Tasks View

## Overview
This document outlines the API endpoints required for the UnclaimedTasksView page functionality, including task claiming, assignment, user management, and task timeline/flow features.

## Core Task Management APIs

### 1. Get Unclaimed Tasks
**Endpoint:** `GET /tasks/unclaimed`
**Service:** `unclaimedTasksService.getUnclaimedTasks(filters)`
**Purpose:** Fetch all unclaimed tasks available for assignment
**Parameters:**
- `filters` (optional): Object containing filter criteria (priority, due date, etc.)
**Response:** Array of unclaimed task objects

### 2. Claim Task
**Endpoint:** `PATCH /tasks/{taskId}/claim`
**Service:** `unclaimedTasksService.claimTask(taskId)`
**Purpose:** Allow current user to claim an unclaimed task
**Parameters:**
- `taskId`: ID of the task to claim
**Response:** Updated task object with assignee set to current user

### 3. Assign Task to User
**Endpoint:** `PATCH /tasks/{taskId}/assign`
**Service:** `unclaimedTasksService.assignTask(taskId, userId)`
**Purpose:** Assign an unclaimed task to a specific team member
**Parameters:**
- `taskId`: ID of the task to assign
- `userId`: ID of the user to assign the task to
**Request Body:**
```json
{
  "userId": "user_id",
  "assignedAt": "timestamp"
}
```
**Response:** Updated task object with new assignee

### 4. Get Available Users
**Endpoint:** `GET /availableUsers`
**Service:** `unclaimedTasksService.getAvailableUsers()`
**Purpose:** Fetch list of users available for task assignment
**Response:** Array of user objects with workload information
```json
[
  {
    "id": "user_id",
    "name": "User Name",
    "role": "Role",
    "workload": 5
  }
]
```

## Task Timeline and Flow APIs

### 5. Get Task History
**Endpoint:** `GET /tasks/{taskId}/history`
**Service:** `workflowService.getTaskHistory(taskId)`
**Purpose:** Retrieve complete timeline of task status changes and actions
**Response:** Array of historical events
```json
[
  {
    "id": "event_id",
    "taskId": "task_id",
    "action": "claimed|assigned|approved|rejected",
    "userId": "user_id",
    "userName": "User Name",
    "timestamp": "2024-01-01T10:00:00Z",
    "details": "Additional action details"
  }
]
```

### 6. Get Task Comments
**Endpoint:** `GET /tasks/{taskId}/comments`
**Service:** `workflowService.getTaskComments(taskId)`
**Purpose:** Fetch all comments and notes associated with a task
**Response:** Array of comment objects
```json
[
  {
    "id": "comment_id",
    "taskId": "task_id",
    "userId": "user_id",
    "userName": "User Name",
    "content": "Comment text",
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

### 7. Add Task Comment
**Endpoint:** `POST /tasks/{taskId}/comments`
**Service:** `workflowService.addTaskComment(taskId, commentData)`
**Purpose:** Add a new comment to a task
**Request Body:**
```json
{
  "content": "Comment text",
  "userId": "user_id",
  "createdAt": "timestamp"
}
```

### 8. Get Task Attachments
**Endpoint:** `GET /tasks/{taskId}/attachments`
**Service:** `workflowService.getTaskAttachments(taskId)`
**Purpose:** Retrieve list of files attached to a task
**Response:** Array of attachment objects

### 9. Get Workflow Stages
**Endpoint:** `GET /workflows/{workflowId}/stages`
**Service:** `workflowService.getWorkflowStages(workflowId)`
**Purpose:** Fetch the stages of a workflow for task flow visualization
**Response:** Array of workflow stage objects

### 10. Get Tasks by Workflow
**Endpoint:** `GET /tasks?workflowId={workflowId}`
**Service:** `workflowService.getTasksByWorkflow(workflowId, params)`
**Purpose:** Get all tasks belonging to a specific workflow
**Parameters:**
- `workflowId`: ID of the workflow
- Additional filter parameters

## User Management APIs

### 11. Get User Workload
**Endpoint:** `GET /tasks/workload?userId={userId}`
**Service:** `workflowService.getUserWorkload(userId)`
**Purpose:** Get current workload information for users (used in assignment dialog)
**Response:** User workload statistics

### 12. Get Team Members
**Endpoint:** `GET /users/team`
**Purpose:** Fetch team members for the current user (for assignment options)
**Response:** Array of team member objects

## Bulk Operations APIs

### 13. Bulk Claim Tasks
**Endpoint:** `PATCH /tasks/bulk/claim`
**Purpose:** Allow bulk claiming of multiple unclaimed tasks
**Request Body:**
```json
{
  "taskIds": ["task1", "task2", "task3"],
  "claimedAt": "timestamp"
}
```

### 14. Bulk Assign Tasks
**Endpoint:** `PATCH /tasks/bulk/assign`
**Service:** `workflowService.bulkAssignTasks(taskIds, assigneeId)`
**Purpose:** Assign multiple tasks to a user at once
**Request Body:**
```json
{
  "taskIds": ["task1", "task2"],
  "assigneeId": "user_id",
  "assignedAt": "timestamp"
}
```

## Notification APIs

### 15. Get Task Notifications
**Endpoint:** `GET /tasks/notifications/{userId}`
**Service:** `workflowService.getWorkflowNotifications(userId, params)`
**Purpose:** Fetch notifications related to task assignments and updates
**Response:** Array of notification objects

### 16. Mark Notification as Read
**Endpoint:** `PATCH /tasks/notifications/{notificationId}`
**Service:** `workflowService.markNotificationAsRead(notificationId)`
**Purpose:** Mark a task notification as read

## Filtering and Search APIs

### 17. Get Filtered Tasks
**Endpoint:** `GET /tasks/unclaimed?filters`
**Service:** `workflowService.getFilteredTasks(filters)`
**Purpose:** Get unclaimed tasks with advanced filtering
**Query Parameters:**
- `priority`: high|medium|low
- `dueDateFrom`: Start date filter
- `dueDateTo`: End date filter
- `complexity`: Low|Medium|High
- `skills`: Required skills filter

### 18. Search Tasks
**Endpoint:** `GET /tasks?q={query}`
**Service:** `workflowService.searchTasks(query, params)`
**Purpose:** Search unclaimed tasks by title, description, or requester

## Dashboard and Analytics APIs

### 19. Get Task Statistics
**Endpoint:** `GET /tasks/stats`
**Service:** `workflowService.getTaskStats(dateRange)`
**Purpose:** Get statistics for dashboard summary cards (total unclaimed, high priority, due soon, etc.)

### 20. Get Overdue Tasks
**Endpoint:** `GET /tasks/overdue`
**Service:** `workflowService.getOverdueTasks(params)`
**Purpose:** Fetch tasks that are past their due date

## Implementation Priority

### High Priority (Core Functionality)
1. Get Unclaimed Tasks
2. Claim Task
3. Assign Task to User
4. Get Available Users
5. Get Task History

### Medium Priority (Enhanced Features)
6. Get Task Comments
7. Add Task Comment
8. Get User Workload
9. Get Filtered Tasks
10. Search Tasks

### Low Priority (Advanced Features)
11. Bulk operations
12. Notifications
13. Attachments
14. Advanced analytics

## Error Handling
All APIs should return appropriate HTTP status codes and error messages:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Authentication
All endpoints require authentication. User context should be available through JWT tokens or session cookies.

## Rate Limiting
Consider implementing rate limiting for bulk operations and search endpoints to prevent abuse.
