# Atlasia Logistics API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication

All endpoints (except `/auth/request-otp` and `/auth/verify-otp`) require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Request OTP
- **URL**: `/auth/request-otp`
- **Method**: POST
- **Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**: OTP sent to email

#### Verify OTP
- **URL**: `/auth/verify-otp`
- **Method**: POST
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "portalType": "customer|admin|transporter"
  }
  ```
- **Response**: JWT token and user info

### Users

#### Get User Profile
- **URL**: `/users/profile`
- **Method**: GET
- **Response**: User profile details

#### Update User Profile
- **URL**: `/users/profile`
- **Method**: PUT
- **Body**:
  ```json
  {
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St"
  }
  ```

### Cargo/Shipments

#### Create Shipment
- **URL**: `/cargo`
- **Method**: POST
- **Body**:
  ```json
  {
    "origin": "Port A",
    "destination": "Port B",
    "weight": "1000kg",
    "description": "Electronics"
  }
  ```

#### Get Shipment Details
- **URL**: `/cargo/:cargoId`
- **Method**: GET

#### Get Live Tracking
- **URL**: `/cargo/:cargoId/tracking`
- **Method**: GET

#### Update Shipment Status
- **URL**: `/cargo/:cargoId/status`
- **Method**: PUT
- **Body**:
  ```json
  {
    "status": "in_transit|delivered|cancelled"
  }
  ```

### Chat

#### Get Chat History
- **URL**: `/chat/:chatRoomId`
- **Method**: GET

#### Send Message
- **URL**: `/chat`
- **Method**: POST
- **Body**:
  ```json
  {
    "chatRoomId": "room-id",
    "message": "Hello",
    "senderId": "user-id"
  }
  ```

#### Get Chat Rooms
- **URL**: `/chat/rooms/:userId`
- **Method**: GET

## Socket.io Events

### Client to Server
- `join_chat`: Join a chat room
- `send_message`: Send a message

### Server to Client
- `receive_message`: Receive a message

## Error Responses

All errors follow this format:
```json
{
  "message": "Error description",
  "errors": []
}
```

Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
