import ResgiterForm from "./Register-form";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../Style.css";

interface LoginFormProps {
  activeForm: "login" | "register" | "forget";
  setActiveForm: (form: "login" | "register" | "forget") => void;
}
const LoginForm: React.FC<LoginFormProps> = ({ activeForm, setActiveForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div
        className="login-form"
        style={{
          left: activeForm === "login" ? "50%" : "150%",
          opacity: activeForm === "login" ? 1 : 0,
        }}
      >
        <div className="form-title">
          <span>Sign In</span>
        </div>
        <div className="form-inputs">
          <div className="input-box">
            <input
              type="text"
              className="input-field"
              placeholder="Username"
              required
            />
            <i className="bx bx-user icon"></i>
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              className="input-field"
              placeholder="Password"
              required
            />
            <i
              className={`bx ${
                showPassword ? "bx-lock-open" : "bx-lock-alt"
              } icon`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
          <div className="forgot-pass">
            <NavLink
              to="/ForgetPass"
              className={`${activeForm === "forget" ? "active-btn" : ""}`}
              onClick={() => setActiveForm("forget")}
            >
              Forgot Password?
            </NavLink>
          </div>
          <div className="input-box">
            <button className="input-submit">
              <span>Sign In</span>
              <i className="bx bx-right-arrow-alt"></i>
            </button>
          </div>
        </div>
        <div className="social-login">
          <i className="bx bxl-google"></i>
          <i className="bx bxl-facebook"></i>
          <i className="bx bxl-github"></i>
        </div>
      </div>
      <ResgiterForm activeForm={activeForm} />
    </>
  );
};
export default LoginForm;
