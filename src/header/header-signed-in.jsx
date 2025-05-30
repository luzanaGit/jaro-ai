import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/header.css";
import "../css/sidebar.css";
import "../css/styles.css";

import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

const BOT_NAMES = ["deephermes", "devstral", "gemma", "llama", "qwen"];

function header_signed_in() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);

      BOT_NAMES.forEach((botName) => {
        localStorage.removeItem(`chatId_${botName}`);
        console.log(`Cleared chatId_${botName} from localStorage`);
      });

      alert("Signed out successfully.");
      navigate("/");
    } catch (error) {
      alert("Error signing out: " + error.message);
      console.error("Sign-out error:", error);
    }
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
            <div className="header-sign-out-placeholder"></div>
            <div className="header-sign-out-button-wrapper">
              <button className="sign-out-button" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default header_signed_in;
