import { useState } from "react";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  //fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db } from "../components/Firebase";
import { setDoc, doc } from "firebase/firestore";
import GoogleLogin from "../GoogleLogin";
import { toast } from "react-toastify";
import "../Style.css";
import { register } from "../../../apiServices/AccountServices/accountServices";
// import { register } from "../../../apiServices/AccountServices/accountServices";
interface ResgiterFormProps {
  activeForm: "login" | "register" | "forget";
}

const ResgiterForm: React.FC<ResgiterFormProps> = ({ activeForm }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right" });
      return;
    }
    setIsRegistering(true);
    try {
      // // Kiểm tra email đã tồn tại
      // const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      // if (signInMethods.length > 0) {
      //   swal("Warning!", "Email is already in use!", "warning");
      //   setIsRegistering(false);
      //   return;
      // }

      const registerValues = {
        name,
        email,
        password,
        confirmPassword,
      };

      const response = await register(registerValues);
      if (!response) {
        setIsRegistering(false);
        return;
      }
      console.log("User Registered Successfully!!");
      toast.success(
        "Registration successful! The system is processing, please wait...",
        {
          position: "top-center",
        }
      );
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          name: user.displayName,
          userName: name,
          phoneNumber: phoneNumber,
        });
      }
      swal("Success!", "Registration successful!", "success").then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message, {
        position: "top-center",
      });
      setIsRegistering(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleRegister}>
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className="bx bx-envelope icon"></i>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Username"
                  onChange={(e) => setName(e.target.value)}
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
              <div className="input-box">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="Comfirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <i
                  className={`bx ${showConfirmPassword ? "bx-hide" : "bx-show"
                    } icon`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                ></i>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Phone Number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <i className="bx bx-mobile icon"></i>
              </div>
            </div>
            <div className="forgot-pass">
              <Link to="/ForgetPass">Forgot Password?</Link>
            </div>
            <div className="input-box">
              <button
                className="input-submit"
                disabled={isRegistering}
                style={{
                  backgroundColor: isRegistering ? "#ccc" : "", // Đổi màu khi đang xử lý
                  cursor: isRegistering ? "not-allowed" : "pointer",
                  opacity: isRegistering ? 0.7 : 1,
                }}
              >
                <span>{isRegistering ? "Processing..." : "Sign Up"}</span>
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
    </div>
  );
};
export default ResgiterForm;
