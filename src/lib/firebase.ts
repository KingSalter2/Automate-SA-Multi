import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBmPAZszGYNKt1rIFOmgCx91jukDmIlP2Q",
  authDomain: "automate-sa-multi.firebaseapp.com",
  projectId: "automate-sa-multi",
  storageBucket: "automate-sa-multi.firebasestorage.app",
  messagingSenderId: "488769006903",
  appId: "1:488769006903:web:4a17c884b6ecb7e2c7feb2",
  measurementId: "G-BG6LHK5GQX",
};

const requiredKeys: Array<keyof typeof firebaseConfig> = ["apiKey", "authDomain", "projectId", "appId"];

export const isFirebaseConfigured = requiredKeys.every((k) => {
  const v = firebaseConfig[k];
  return typeof v === "string" && v.trim().length > 0;
});

export const firebaseApp = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const googleAuthProvider = firebaseApp ? new GoogleAuthProvider() : null;

export const analyticsPromise =
  firebaseApp && firebaseConfig.measurementId
    ? isSupported().then((ok) => (ok ? getAnalytics(firebaseApp) : null))
    : Promise.resolve(null);
