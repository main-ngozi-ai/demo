import { initializeApp } from "firebase/app";
// 2) Analytics (optional)
import { getAnalytics } from "firebase/analytics";
import { loadClientConfig } from '../../utils/loadClientConfig'

import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
const config = await loadClientConfig();

const firebaseConfig = {
  apiKey: config.firebaseApiKey,
  authDomain: config.firebaseAuthDomain,
  projectId: config.firebaseProjectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId,
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { app, analytics, auth, googleProvider, appleProvider };