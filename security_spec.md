# Security Specification for ALFLIX

## Data Invariants
1. A user can only read and write their own profile (except for admins).
2. Menu items and categories are read-only for public users, writeable only by admins.
3. Orders can be created by any authenticated user (or guest, but here we require userId or session).
4. Users can only read their own orders.
5. Admins can read and update all orders (e.g., status changes).
6. Cart is private to the user.

## The "Dirty Dozen" Payloads
1. **Identity Theft**: Attempt to create a user profile with a UID different from the authenticated user.
2. **Admin Escalation**: Attempt to set `role: "admin"` on a user profile during signup.
3. **Menu Poisoning**: Attempt to update a menu item price as a regular user.
4. **Order Spoofing**: Attempt to read another user's order by guessed ID.
5. **Price Manipulation**: Attempt to create an order with a total price that doesn't match the items (requires cloud logic usually, but here we validate types and keys).
6. **Cart Scraping**: Attempt to read another user's cart.
7. **Status Jumping**: Attempt to change order status from `pending` to `delivered` as a regular user.
8. **Resource Exhaustion**: Attempt to write a 1MB string into the menu item name.
9. **ID Injection**: Attempt to use a very long/malicious string as a document ID.
10. **Timestamp Faking**: Attempt to set `createdAt` to a past date instead of server time.
11. **PII Leak**: Attempt to list all user profiles and their emails/addresses.
12. **Immutable Field Write**: Attempt to change `userId` on an existing order.

## Testing Strategy
We will implement rules that handle these cases:
- `isOwner()` check for users and carts.
- `isAdmin()` check for menu and order status updates.
- `isValidMenuItem()`/`isValidOrder()` schema validation.
- `request.time` for all timestamps.
- Default deny for any unspecified path.
