const admin = require('firebase-admin');

// IMPORTANT: The user needs to download their serviceAccountKey.json from Firebase Console
// and place it in the server/config directory.
// For now, we will use environment variables or a placeholder path.

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('./config/serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error("Firebase Admin initialization failed. Make sure server/config/serviceAccountKey.json exists.");
}

module.exports = admin;
