import { Link } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/sidebar.css";
import "../css/styles.css";

function sidebar() {
  return (
    <div className="sidebar bg-dark collapsed" id="sidebar">
      <nav className="nav flex-column">
        <Link className="nav-link" to="/deephermes">
          <span className="icon">
            <i className="bi bi-graph-up-arrow"></i>
          </span>
          <span className="description">Nous: DeepHermes</span>
        </Link>
        <Link className="nav-link" to="/devstral">
          <span className="icon">
            <i className="bi bi-plus-lg"></i>
          </span>
          <span className="description">Mistral: Devstral Small</span>
        </Link>
        <Link className="nav-link" to="/gemma">
          <span className="icon">
            <i className="bi bi-envelope"></i>
          </span>
          <span className="description">Google: Gemma</span>
        </Link>
        <Link className="nav-link" to="/llama">
          <span className="icon">
            <i className="bi bi-person"></i>
          </span>
          <span className="description">Meta: Llama</span>
        </Link>
        <Link className="nav-link" to="/qwen">
          <span className="icon">
            <i className="bi bi-ticket"></i>
          </span>
          <span className="description">Qwen: Qwen3</span>
        </Link>
      </nav>
    </div>
  );
}

export default sidebar;
