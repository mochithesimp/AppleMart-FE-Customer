import React from "react";
import "./../App.css";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="header">
      <div className="top-navbar">
        <ul className="top-navbar-list">
          <li>
            <Link to="/chat">
              <button>Chat</button>
            </Link>
          </li>

          <li className="product">
            <Link to="/product">
              <button>Product</button>
            </Link>
          </li>

          <li className="login">
            {/* <BsFillPeopleFill fontSize="1em" /> */}
            <Link to="/login">
              <button>Login</button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
