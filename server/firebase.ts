const admin = require('firebase-admin');

// IMPORTANT: The user needs to download their serviceAccountKey.json from Firebase Console
// and place it in the server/config directory.
// For now, we will use environment variables or a placeholder path.

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('./config/serviceAccountKey.json');

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.log("Firebase Admin initialization skipped (serviceAccountKey.json not found). Firebase auth will be disabled.");
}

module.exports = admin;
