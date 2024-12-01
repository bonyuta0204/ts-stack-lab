import {
  initializeApp,
  type App,
  applicationDefault,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let firebaseApp: App;

export const initializeFirebase = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp({
      credential: applicationDefault(),
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
