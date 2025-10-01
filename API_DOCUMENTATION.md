# TodoList API Documentation

## Base URL
`http://localhost:3000/api/todos`

## Endpoints

### 1. Get All Todos
- **GET** `/api/todos`
- **Query Parameters:**
  - `completed` (boolean): Filter by completion status
  - `priority` (string): Filter by priority (low, medium, high)
  - `sort` (string): Sort fields (e.g., "createdAt", "-priority,createdAt")

### 2. Get Single Todo
- **GET** `/api/todos/:id`
- **Parameters:**
  - `id` (string): Todo ID

### 3. Create New Todo
- **POST** `/api/todos`
- **Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "priority": "low|medium|high (optional, default: medium)",
  "dueDate": "ISO date string (optional)"
}
```

### 4. Update Todo
- **PUT** `/api/todos/:id`
- **Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "completed": "boolean (optional)",
  "priority": "low|medium|high (optional)",
  "dueDate": "ISO date string (optional)"
}
```

### 5. Toggle Todo Completion
- **PATCH** `/api/todos/:id/toggle`

### 6. Delete Todo
- **DELETE** `/api/todos/:id`

### 7. Delete All Completed Todos
- **DELETE** `/api/todos`

### 8. Get Todo Statistics
- **GET** `/api/todos/stats/summary`

## Response Format
All responses follow this format:
```json
{
  "success": boolean,
  "message": "string (optional)",
  "data": object|array,
  "count": number (for list endpoints),
  "errors": array (for validation errors)
}
```

## Todo Object Structure
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "priority": "low|medium|high",
  "dueDate": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```