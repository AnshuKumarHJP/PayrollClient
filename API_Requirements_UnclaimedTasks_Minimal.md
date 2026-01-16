# API Requirements for Unclaimed Tasks View - Minimal Release

## Overview
This document outlines the essential API endpoints required for the UnclaimedTasksView page functionality for the minimal viable release.

## Core APIs Required

### 1. Get Unclaimed Tasks
**Endpoint:** `GET /tasks/unclaimed`  
**Method:** GET  
**Purpose:** Fetch all unclaimed tasks available for assignment  

**Query Parameters:**  
- `priority` (optional): Filter by priority (high|medium|low)  
- `search` (optional): Search term for title/description  
- `limit` (optional): Number of tasks to return (default: 50)  
- `offset` (optional): Pagination offset (default: 0)  

**Request Headers:**  
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (200 OK):**  
```json
{
  "success": true,
  "data": [
    {
      "id": "task_123",
      "title": "Process Employee Data",
      "description": "Validate and process employee information from bulk upload",
      "priority": "high",
      "complexity": "Medium",
      "dueDate": "2024-01-15T10:00:00Z",
      "estimatedHours": 4,
      "requester": "John Doe",
      "department": "HR",
      "skills": ["Data Validation", "Excel"],
      "createdAt": "2024-01-01T09:00:00Z",
      "status": "unclaimed"
    }
  ],
  "total": 25,
  "hasMore": true
}
```

**Error Responses:**  
- `401 Unauthorized`: Invalid or missing authentication token  
- `500 Internal Server Error`: Server error  

### 2. Claim Task
**Endpoint:** `PATCH /tasks/{taskId}/claim`  
**Method:** PATCH  
**Purpose:** Allow current user to claim an unclaimed task  

**Path Parameters:**  
- `taskId`: UUID of the task to claim  

**Request Headers:**  
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**  
```json
{
  "claimedAt": "2024-01-01T10:30:00Z"
}
```

**Response (200 OK):**  
```json
{
  "success": true,
  "data": {
    "id": "task_123",
    "title": "Process Employee Data",
    "assigneeId": "user_456",
    "assigneeName": "Jane Smith",
    "status": "claimed",
    "claimedAt": "2024-01-01T10:30:00Z",
    "updatedAt": "2024-01-01T10:30:00Z"
  },
  "message": "Task claimed successfully"
}
```

**Error Responses:**  
- `400 Bad Request`: Task already claimed or invalid task ID  
- `401 Unauthorized`: Invalid authentication  
- `403 Forbidden`: User doesn't have permission to claim tasks  
- `404 Not Found`: Task not found  

### 3. Assign Task to User
**Endpoint:** `PATCH /tasks/{taskId}/assign`  
**Method:** PATCH  
**Purpose:** Assign an unclaimed task to a specific team member  

**Path Parameters:**  
- `taskId`: UUID of the task to assign  

**Request Headers:**  
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**  
```json
{
  "userId": "user_789",
  "assignedAt": "2024-01-01T11:00:00Z"
}
```

**Response (200 OK):**  
```json
{
  "success": true,
  "data": {
    "id": "task_123",
    "title": "Process Employee Data",
    "assigneeId": "user_789",
    "assigneeName": "Bob Johnson",
    "assignedBy": "user_456",
    "status": "assigned",
    "assignedAt": "2024-01-01T11:00:00Z",
    "updatedAt": "2024-01-01T11:00:00Z"
  },
  "message": "Task assigned successfully"
}
```

**Error Responses:**  
- `400 Bad Request`: Invalid user ID or task already assigned  
- `401 Unauthorized`: Invalid authentication  
- `403 Forbidden`: User doesn't have permission to assign tasks  
- `404 Not Found`: Task or user not found  

### 4. Get Available Users
**Endpoint:** `GET /users/available`  
**Method:** GET  
**Purpose:** Fetch list of users available for task assignment  

**Query Parameters:**  
- `includeWorkload` (optional): Include current workload count (default: true)  
- `department` (optional): Filter by department  

**Request Headers:**  
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (200 OK):**  
```json
{
  "success": true,
  "data": [
    {
      "id": "user_789",
      "name": "Bob Johnson",
      "email": "bob.johnson@company.com",
      "role": "Data Processor",
      "department": "Operations",
      "workload": 3,
      "skills": ["Data Validation", "Excel", "SQL"],
      "isActive": true
    },
    {
      "id": "user_790",
      "name": "Alice Wilson",
      "email": "alice.wilson@company.com",
      "role": "Senior Processor",
      "department": "Operations",
      "workload": 5,
      "skills": ["Data Validation", "Excel", "SQL", "Python"],
      "isActive": true
    }
  ]
}
```

**Error Responses:**  
- `401 Unauthorized`: Invalid authentication  
- `500 Internal Server Error`: Server error  

### 5. Get Task History
**Endpoint:** `GET /tasks/{taskId}/history`  
**Method:** GET  
**Purpose:** Retrieve complete timeline of task status changes and actions  

**Path Parameters:**  
- `taskId`: UUID of the task  

**Query Parameters:**  
- `limit` (optional): Number of history items to return (default: 20)  
- `offset` (optional): Pagination offset (default: 0)  

**Request Headers:**  
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (200 OK):**  
```json
{
  "success": true,
  "data": [
    {
      "id": "history_001",
      "taskId": "task_123",
      "action": "created",
      "userId": "system",
      "userName": "System",
      "timestamp": "2024-01-01T09:00:00Z",
      "details": "Task created from bulk upload",
      "oldValue": null,
      "newValue": "unclaimed"
    },
    {
      "id": "history_002",
      "taskId": "task_123",
      "action": "claimed",
      "userId": "user_456",
      "userName": "Jane Smith",
      "timestamp": "2024-01-01T10:30:00Z",
      "details": "Task claimed by user",
      "oldValue": "unclaimed",
      "newValue": "claimed"
    }
  ],
  "total": 2
}
```

**Error Responses:**  
- `401 Unauthorized`: Invalid authentication  
- `403 Forbidden`: User doesn't have permission to view task history  
- `404 Not Found`: Task not found  

### 6. Get Task Statistics
**Endpoint:** `GET /tasks/stats`  
**Method:** GET  
**Purpose:** Get statistics for dashboard summary cards  

**Query Parameters:**  
- `dateRange` (optional): Date range for statistics (last_7_days, last_30_days, etc.)  

**Request Headers:**  
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (200 OK):**  
```json
{
  "success": true,
  "data": {
    "totalUnclaimed": 25,
    "highPriority": 8,
    "dueSoon": 5,
    "totalHours": 120,
    "overdue": 2
  }
}
```

## Implementation Notes

### Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Common Response Structure
All successful responses follow this structure:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

All error responses follow this structure:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Optional detailed error information"
  }
}
```

### Rate Limiting
- GET endpoints: 100 requests per minute per user
- PATCH/POST endpoints: 30 requests per minute per user

### Pagination
For list endpoints, use standard pagination:
- `limit`: Maximum items per page (default: 50, max: 100)
- `offset`: Number of items to skip (default: 0)

## Priority Implementation Order
1. **Get Unclaimed Tasks** - Essential for displaying the task list
2. **Claim Task** - Core functionality for self-assignment
3. **Assign Task to User** - Core functionality for manager assignment
4. **Get Available Users** - Required for the assignment dialog
5. **Get Task Statistics** - Needed for dashboard summary cards
6. **Get Task History** - Timeline feature for task details view

## Testing Checklist
- [ ] All endpoints return proper HTTP status codes
- [ ] Authentication works correctly
- [ ] Request/response formats match specifications
- [ ] Error handling covers edge cases
- [ ] Pagination works for list endpoints
- [ ] Rate limiting is enforced
