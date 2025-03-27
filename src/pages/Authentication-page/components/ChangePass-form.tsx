import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { changePass } from "../../../apiServices/AccountServices/loginServices";
import "../Style.css";

const decodeBase64Url = (base64Url: string): string => {
  // Thay thế các ký tự Base64 URL-encoded thành Base64 chuẩn
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  // Thêm padding nếu cần (Base64 yêu cầu độ dài chia hết cho 4)
  const padding = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const base64Padded = base64 + padding;
  // Decode Base64 và chuyển về chuỗi UTF-8
  return decodeURIComponent(
    atob(base64Padded)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
};

interface ChangePassFormProps {
  activeForm: "login" | "register" | "forget" | "changePass";
  setActiveForm: (form: "login" | "register" | "forget" | "changePass") => void;
}

const ChangePassForm: React.FC<ChangePassFormProps> = ({ activeForm }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log(queryParams);
    const emailFromUrl = queryParams.get("email");
    console.log(emailFromUrl);
    const encodedTokenFromUrl = queryParams.get("token");
    console.log(encodedTokenFromUrl);

    if (!emailFromUrl || !encodedTokenFromUrl) {
      swal("Error", "Invalid reset link. Please request a new password reset link.", "error");
      navigate("/login");
    } else {
      try {
        // Giải mã token từ Base64 URL-encoded về token gốc
        const decodedToken = decodeBase64Url(encodedTokenFromUrl);
        setEmail(emailFromUrl);
        setResetToken(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
        swal("Error", "Invalid token format. Please request a new password reset link.", "error");
        navigate("/login");
      }
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email || !resetToken) {
      swal("Error", "Invalid reset link. Please request a new password reset link.", "error");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      swal("Error", "Passwords do not match.", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await changePass(email, resetToken, password, confirmPassword);

      if (response.status === 200) {
        swal("Success", "Password reset successfully! Redirecting to login...", "success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (response.status === 400) {
        swal("Error", "Invalid or expired token.", "error");
      } else {
        swal("Error", "Failed to reset password. Please try again.", "error");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          swal("Error", "Invalid or expired token.", "error");
        } else {
          swal("Error", "An unexpected error occurred. Please try again.", "error");
        }
      } else {
        console.error("An error occurred:", error);
        swal("Error", "An unexpected error occurred. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email || !resetToken) {
    return null;
  }

  return (
    activeForm === "changePass" && (
      <div className="forget-form">
        <div className="form-title">
          <span>Change Password</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={`bx ${showConfirmPassword ? "bx-hide" : "bx-show"} icon`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
            <div className="input-box">
              <button
                type="submit"
                className="input-submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? "#ccc" : "",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                <span>{isSubmitting ? "Processing..." : "Confirm"}</span>
                <i className="bx bx-right-arrow-alt"></i>
              </button>
            </div>
          </div>
        </form>
        <div className="social-login">
          <i className="bx bxl-google"></i>
          <i className="bx bxl-facebook"></i>
          <i className="bx bxl-github"></i>
        </div>
      </div>
    )
  );
};

export default ChangePassForm;