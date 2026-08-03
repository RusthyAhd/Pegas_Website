import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDgFcNSiQDd-ifdrB9glBpAcsUWFhCgoo",
  authDomain: "flutterhub-4361f.firebaseapp.com",
  projectId: "flutterhub-4361f",
  storageBucket: "flutterhub-4361f.firebasestorage.app",
  messagingSenderId: "581131103021",
  appId: "1:581131103021:web:622e9331893219ba4681a4",
  measurementId: "G-DHZNQMHJY3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
