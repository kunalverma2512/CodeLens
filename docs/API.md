# CodeLens API Specifications Reference

This reference catalog details all primary HTTP endpoints exposed by the CodeLens backend server.

---

## 🔐 Authentication Endpoints

### 1. Register User
- **POST** `/api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** `(201 Created)`:
  ```json
  {
    "success": true,
    "message": "Verification OTP sent to email.",
    "data": {
      "id": "603d211...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

### 2. Verify Email OTP
- **POST** `/api/auth/verify-otp`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "otp": "123456"
  }
  ```
- **Response** `(200 OK)`:
  ```json
  {
    "success": true,
    "message": "OTP verified successfully.",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "603d211...",
        "email": "jane@example.com"
      }
    }
  }
  ```

### 3. User Login
- **POST** `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** `(200 OK)`:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "603d211...",
        "email": "jane@example.com"
      }
    }
  }
  ```

---

## 📊 Codeforces Analytics

### 1. Retrieve Connected Account Stats
- **GET** `/api/codeforces/stats`
- **Headers**:
  - `Authorization`: `Bearer <token>`
- **Response** `(200 OK)`:
  ```json
  {
    "success": true,
    "data": {
      "handle": "tourist",
      "rating": 3783,
      "maxRating": 3783,
      "rank": "legendary grandmaster",
      "solvedProblemsCount": 2405
    }
  }
  ```

---

## 🤖 Apex AI Assistant

### 1. Get Code Review Explanation
- **POST** `/api/ai/review`
- **Headers**:
  - `Authorization`: `Bearer <token>`
- **Request Body**:
  ```json
  {
    "code": "int main() { return 0; }",
    "language": "cpp"
  }
  ```
- **Response** `(200 OK)`:
  ```json
  {
    "success": true,
    "data": {
      "review": "The provided code is syntactically correct and represents a standard template structure...",
      "complexity": {
        "time": "O(1)",
        "space": "O(1)"
      }
    }
  }
  ```
