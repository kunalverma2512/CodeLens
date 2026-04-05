# Feature: Redis-Based OTP Verification & Auth Flow Refactoring 🚀

## 📝 Description
This PR refactors the authentication and registration flow to utilize **Redis** for temporary data storage (OTPs and pending user sessions) instead of MongoDB. This architectural change significantly improves database hygiene by preventing the database from being cluttered with unverified or abandoned accounts.

## ✨ Key Changes & Architectural Improvements

1. **Optimized User Creation (Database Hygiene)**
   - Removed the `isVerified` field from the `User` model.
   - **Old Flow:** Users were created in MongoDB immediately upon registration with `isVerified: false`.
   - **New Flow:** User data is now temporarily cached in Redis under the key `pending_user:<email>` with a 10-minute expiration. The user is ONLY saved to MongoDB permanently *after* they successfully verify their OTP.

2. **Redis-Powered OTP Management**
   - Replaced the MongoDB `Otp.js` model with Redis key-value storage (`otp:<purpose>:<email>`).
   - Leverages Redis's native TTL (Time-To-Live) capabilities to automatically expire OTPs and pending users after 10 minutes, reducing database load and removing the need for MongoDB TTL indexes.
   - Safely deleted the obsolete `server/models/Otp.js` file.

3. **Refactored Auth Modules**
   - Updated `AuthRepository` to include Redis cache interactions (`storePendingUser`, `getPendingUser`, `storeOtp`, etc.).
   - Refactored `AuthService` and `AuthController` to seamlessly handle registration, forgot password, reset password, and resend OTP flows using the new Redis architecture.

## 🛠 Prerequisites for Reviewers/Maintainers
Because of the new Redis dependency, the environment setup has been updated. To run this locally:

1. Ensure you have a Redis server running locally or via Docker.
2. Add the following to your `server/.env` file:
   ```env
   REDIS_URL=redis://localhost:6379  # Or your respective Redis connection string