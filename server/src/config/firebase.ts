import { initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let firebaseApp: App;

export const initializeFirebase = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return firebaseApp;
};

export const getFirebaseAuth = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return getAuth();
};
