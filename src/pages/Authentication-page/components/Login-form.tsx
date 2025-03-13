import ResgiterForm from "./Register-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import swal from "sweetalert";
import { toast } from "react-toastify";
import GoogleLogin from "../GoogleLogin";
import "../Style.css";
import { login } from "../../../apiServices/AccountServices/loginServices";
import { AxiosError } from "axios";
interface LoginFormProps {
  activeForm: "login" | "register" | "forget";
  setActiveForm: (form: "login" | "register" | "forget") => void;
}
const LoginForm: React.FC<LoginFormProps> = ({ activeForm, setActiveForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Missing Email or Password");
      return;
    }

    try {

      const response = await login(email, password);

      if (response?.status === 200) {
        const { accessToken, refreshToken } = response.data;

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        navigate("/");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          swal({
            title: "Banned",
            text: "Your account has been banned indefinitely and cannot log in.",
            icon: "error",
            buttons: {
              ok: {
                text: "OK",
                value: true,
                className: "swal-ok-button",
              },
            },
          });
        } else if (error.response?.status === 400) {
          swal("Validation Error", "Incorrect Account or Password", "error");
        } else {
          // Handle other status codes
          console.error("Login failed:", error.response?.status);
          toast.error("Login failed. Please try again.");
        }
      } else {
        console.error("An error occurred:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="bx bx-user icon"></i>
            </div>
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`bx ${showPassword ? "bx-lock-open" : "bx-lock-alt"
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
            <GoogleLogin />
            <i className="bx bxl-facebook"></i>
            <i className="bx bxl-github"></i>
          </div>
        </div>
      </form>
      <ResgiterForm activeForm={activeForm} />
    </div>
  );
};
export default LoginForm;