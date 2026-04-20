#!/bin/bash
# Generate `shared/config.js` with environment variables and prepare `public/` for Vercel
set -e

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

# Prepare public directory (Vercel expects a build output directory named `public` by default)
rm -rf public
mkdir -p public

# Copy top-level html files (if present)
for f in *.html; do
  if [ -f "$f" ]; then
    cp -v "$f" public/ || true
  fi
done

# Copy folders that make up the site
for d in home admin students shared; do
  if [ -d "$d" ]; then
    mkdir -p "public/$d"
    cp -a "$d/"* "public/$d/" || true
  fi
done

# Cleanup anything that shouldn't be served
rm -f public/build.sh

echo "Build output prepared in public/"
