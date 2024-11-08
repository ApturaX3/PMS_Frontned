import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const {
  VITE_FIREBASE_API_KEY: apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: authDomain,
  VITE_FIREBASE_PROJECT_ID: projectId,
  VITE_FIREBASE_STORAGE_BUCKET: storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_APP_ID: appId,
  VITE_FIREBASE_MEASUREMENT_ID: measurementId,
} = import.meta.env;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

//initialize firebase

const app = initializeApp(firebaseConfig);

//export auth for use in other files
export const auth = getAuth(app);

export const provider = new GithubAuthProvider();

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};
