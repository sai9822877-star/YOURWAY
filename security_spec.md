# Security Specification for Firestore Security Rules

## 1. Data Invariants
- `users/{userId}`:
  - User profile can only be created and updated by the authenticated user (`request.auth.uid == userId`).
  - Users cannot spoof another user's `uid`.
  - Display names and bios must conform to maximum length bounds.
  - Username must be alphanumeric + underscore and lowercase (`^[a-z0-9_]{3,30}$`).
  - Read access to public user profile is available to signed-in users so peers can view academic stats/ranks in study groups and leaderboards without exposing PII.
  - PII (email, private settings) resides strictly in `/users/{userId}/private/info` and is accessible only to the owner (`request.auth.uid == userId`).
- `usernames/{username}`:
  - Mapping for uniqueness.
  - A user can only register a username with their own `uid`.
  - Once created, cannot be claimed or overwritten by a different `uid`.
  - Reserved usernames (e.g., admin, official, system, morphic) cannot be claimed.

## 2. The Dirty Dozen Payloads
1. Unauthenticated write to `/users/{userId}` (blocked: requires `request.auth != null`).
2. Spoofed UID write (`auth.uid != userId`) (blocked: `isOwner(userId)`).
3. Privilege Escalation in `/users/{userId}` (e.g. inject `isAdmin: true` or `role: 'admin'`).
4. Overwriting another user's claimed username in `/usernames/{username}`.
5. Registering a reserved username like `admin` or `system`.
6. Reading PII from `/users/{otherUserId}/private/info` by non-owner.
7. Injecting a 1MB payload string into `bio` or `displayName` (blocked by `.size() <= MAX`).
8. Updating `createdAt` on an existing user document (immutable field check).
9. Writing with an invalid username pattern (e.g., symbols, spaces, uppercase).
10. Unverified write when verification is required.
11. Deleting another user's profile.
12. Shadow fields injection on user creation (blocked by exact keys check).
