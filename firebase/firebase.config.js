import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCJAgi_P77N22bpqqMp_nioTNpZZqLcU5I",
  authDomain: "rn-firebase-imagepicker.firebaseapp.com",
  projectId: "rn-firebase-imagepicker",
  storageBucket: "rn-firebase-imagepicker.appspot.com",
  messagingSenderId: "1089137275211",
  appId: "1:1089137275211:web:735b88d903c2fae5c9b8ce",
  measurementId: "G-X3N4RY4R46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// storage
const storage = getStorage(app);

export { app, storage };
