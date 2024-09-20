

// firebase app name Hackathon mini


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

import {
  getFirestore,
  addDoc,
  getDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-GsuUqpygPtCnqfB7XAf9Y7az60Cv98I",
  authDomain: "hackathon-mini-24b86.firebaseapp.com",
  projectId: "hackathon-mini-24b86",
  storageBucket: "hackathon-mini-24b86.appspot.com",
  messagingSenderId: "910216334443",
  appId: "1:910216334443:web:88f695d6bb3aa42b77752e",
  measurementId: "G-5K7G1MNWZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log(db);

export {
  app,
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
  addDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
};




