import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDT2i7bXPMMCy4CCHDxYWMIbpxX_uG3ltw",
  authDomain: "sclae-967eb.firebaseapp.com",
  projectId: "sclae-967eb",
  storageBucket: "sclae-967eb.firebasestorage.app",
  messagingSenderId: "827726697771",
  appId: "1:827726697771:web:949c2b097ec16ac481a16e",
  measurementId: "G-607CF0E61H"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
