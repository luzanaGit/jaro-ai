import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/sidebar.css";
import "../css/styles.css";

import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function header_signed_out() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignIn = () => {
    signOut(auth)
      .then(() => {
        navigate("/sign-in");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
        alert("Failed to sign out.");
      });
  };

  const handleSignUp = () => {
    signOut(auth)
      .then(() => {
        navigate("/sign-up");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
        alert("Failed to sign out.");
      });
  };

  return (
    <div className="header-sticky-top">
      <header className="app-header">
        <div className="header-content-container">
          <div className="header-left-section">
            <div className="header-logo-container">
              <img src="logo.png" alt="Logo" className="header-logo" />
            </div>
          </div>
          <div className="header-center-section">
            <h4>JaRo AI</h4>
          </div>
          <div className="header-right-section">
            <div className="header-auth-buttons">
              <button className="auth-button success" onClick={handleSignIn}>
                Sign In
              </button>
              <button className="auth-button dark" onClick={handleSignUp}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default header_signed_out;
