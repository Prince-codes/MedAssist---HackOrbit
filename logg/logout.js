import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyB9P5XlgfUFATkYUzOb6gzUVzgDhdXuEuw",
  authDomain: "medassist-4b652.firebaseapp.com",
  projectId: "medassist-4b652",
  storageBucket: "medassist-4b652.appspot.com",
  messagingSenderId: "559510897181",
  appId: "1:559510897181:web:0a27b79f12448a98cabcf4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const logoutBtn = document.getElementById("logout-btn");
const loginBtn = document.querySelector(".login");
const signupBtn = document.querySelector(".signup");


onAuthStateChanged(auth, (user) => {
  if (user) {
    logoutBtn.style.display = "inline-block";
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
  } else {
    logoutBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
  }
});


logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully ✅");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Logout Error:", error);
    });
});
