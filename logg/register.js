import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


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


const form = document.querySelector('form');
const errorDiv = document.getElementById('error-message');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const fullName = document.getElementById('fullname').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;


  if (!email || !fullName || !password || !confirmPassword) {
    errorDiv.textContent = "Please fill in all fields.";
    return;
  }

 
  if (password !== confirmPassword) {
    errorDiv.textContent = "Passwords do not match.";
    return;
  }

 
  const hasUppercase = /[A-Z]/.test(password);
  const isLongEnough = password.length >= 5;

  if (!hasUppercase || !isLongEnough) {
    errorDiv.textContent = "Password must be at least 5 characters long and contain at least one uppercase letter.";
    return;
  }

  errorDiv.textContent = ""; 

  
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Account created successfully!");
      console.log("User:", userCredential.user);
      window.location.href = "index1.html";
    })
    .catch((error) => {
      console.error("Firebase error:", error);
      errorDiv.textContent = error.message;
    });
});