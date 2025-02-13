import { useState } from "react";
import { Link } from "react-router-dom";
import "../Style.css";
interface ResgiterFormProps {
  activeForm: "login" | "register" | "forget";
}
const ResgiterForm: React.FC<ResgiterFormProps> = ({ activeForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <>
      <div
        className="register-form"
        style={{
          left: activeForm === "register" ? "50%" : "-50%",
          opacity: activeForm === "register" ? 1 : 0,
        }}
      >
        <div className="form-title">
          <span>Create Account</span>
        </div>
        <div className="form-inputs">
          <div className="scroll-form-inputs">
            <div className="input-box">
              <input
                type="text"
                className="input-field"
                placeholder="Email"
                required
              />
              <i className="bx bx-envelope icon"></i>
            </div>
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
            <div className="input-box">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input-field"
                placeholder="Comfirm Password"
                required
              />
              <i
                className={`bx ${
                  showConfirmPassword ? "bx-hide" : "bx-show"
                } icon`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
            <div className="input-box">
              <input
                type="text"
                className="input-field"
                placeholder="Phone Number"
                required
              />
              <i className="bx bx-mobile icon"></i>
            </div>
          </div>
          <div className="forgot-pass">
            <Link to="/ForgetPass">Forgot Password?</Link>
          </div>
          <div className="input-box">
            <button className="input-submit">
              <span>Sign Up</span>
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
      {/* <LoginForm activeForm={activeForm} setActiveForm={setActiveForm} />       */}
    </>
  );
};
export default ResgiterForm;
