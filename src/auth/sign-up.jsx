import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/auth.css";

import { auth } from "../firebase/firebase-config"; // ✅ import only `auth`

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert("Sign up successful!");
      console.log("Signed up user:", userCredential.user);
      window.location.href = "/deephermes";
    } catch (error) {
      alert("Sign up failed: " + error.message);
      console.error("Sign up error:", error);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-logo-section">
          <img src="logo-black.png" alt="Brand Logo" className="auth-logo-img" />
        </div>

        <div className="auth-form-section">
          <button onClick={handleGoBack} className="back-button" aria-label="Go back">
            &larr;
          </button>
          <div className="auth-form-card">
            <h2 className="auth-title">Sign Up</h2>
            <form onSubmit={handleSubmit} className="sign-up-form">
              <input type="email" className="form-input" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className="form-input" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <input type="password" className="form-input" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button type="submit" className="submit-button">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
