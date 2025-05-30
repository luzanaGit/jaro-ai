import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebase_config = {
  apiKey: "AIzaSyAXRkoktT5PXYSOduBggPengSMkl_afUxw",
  authDomain: "jaro-ai.firebaseapp.com",
  projectId: "jaro-ai",
  storageBucket: "jaro-ai.firebasestorage.app",
  messagingSenderId: "758047924094",
  appId: "1:758047924094:web:9901aea25ca622c6ff9d2f",
};

const app = initializeApp(firebase_config);

export const auth = getAuth(app);
