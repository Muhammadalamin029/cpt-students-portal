#!/bin/bash
# Generate shared/config.js with Vercel Environment Variables
echo "export const CONFIG = {
  FIREBASE: {
    apiKey: \"$FIREBASE_API_KEY\",
    authDomain: \"$FIREBASE_AUTH_DOMAIN\",
    projectId: \"$FIREBASE_PROJECT_ID\",
    storageBucket: \"$FIREBASE_STORAGE_BUCKET\",
    messagingSenderId: \"$FIREBASE_MESSAGING_SENDER_ID\",
    appId: \"$FIREBASE_APP_ID\",
    measurementId: \"$FIREBASE_MEASUREMENT_ID\",
  },
  CLOUDINARY: {
    CLOUD_NAME: \"$CLOUD_NAME\",
    UPLOAD_PRESET: \"$UPLOAD_PRESET\",
  }
};" > shared/config.js
