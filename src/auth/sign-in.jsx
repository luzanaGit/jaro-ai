import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/auth.css";

import { auth } from "../firebase/firebase-config";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("Sign in successful!");
      console.log("Signed in user:", userCredential.user);
      window.location.href = "/deephermes";
    } catch (error) {
      alert("Sign in failed: " + error.message);
      console.error("Sign in error:", error);
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
            <h2 className="auth-title">Sign In</h2>
            <form onSubmit={handleSignIn} className="sign-in-form">
              <input type="email" className="form-input" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className="form-input" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className="submit-button">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
