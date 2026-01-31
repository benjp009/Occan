/**
 * One-time script to set a user as admin
 * Run: node scripts/set-admin.js <user-email>
 *
 * Note: You must have Firebase Admin SDK credentials set up
 * For now, use Firebase Console: https://console.firebase.google.com/project/logiciel-france/firestore
 */

console.log(`
=== Set User as Admin ===

To make yourself an admin:

1. Go to Firebase Console:
   https://console.firebase.google.com/project/logiciel-france/firestore/databases/-default-/data

2. Find your user document in the "users" collection
   (Your document ID is your Firebase Auth UID)

3. Click on your user document

4. Edit the "role" field:
   - Change the value from "user" to "admin"

5. Click "Update"

Done! You now have admin access to /admin/claims and /admin/edits
`);
