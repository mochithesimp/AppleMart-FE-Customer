import "../Style.css";
import { useState } from "react";
import { forgetPassword } from "../../../apiServices/AccountServices/loginServices";
import swal from "sweetalert";
import { AxiosError } from "axios";

interface ForgetFormProps {
  activeForm: "login" | "register" | "forget";
  setActiveForm: (form: "login" | "register" | "forget") => void;
}
const ForgetForm: React.FC<ForgetFormProps> = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await forgetPassword(email); // Gọi API qua service

      if (response.status === 200) {
        setIsEmailSent(true);
      } else if (response.status === 400) {
        swal("Error", "Invalid email or email not found.", "error");
      } else {
        swal("Error", "Failed to send reset link. Please try again.", "error");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          swal("Error", "Invalid email or email not found.", "error");
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

  if (isEmailSent) {
    return (
      <div className="forget-form">
        <div className="form-title">
          <span>Email Sent!</span>
        </div>
        <div className="form-inputs">
          <p>
            A password reset link has been sent to <strong>{email}</strong>.
            Please check your inbox (and spam folder) to reset your password.
          </p>
          <p>
            Didn't receive the email?{" "}
            <button
              onClick={() => setIsEmailSent(false)}
              style={{
                color: "#007bff",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
    <div className="forget-form">
      <div className="form-title">
        <span>Forget Password</span>
      </div>
      <div className="form-inputs">
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
          <button
            className="input-submit"
            disabled={isSubmitting} // Vô hiệu hóa nút khi đang gửi
            style={{
              backgroundColor: isSubmitting ? "#ccc" : "",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            <span>{isSubmitting ? "Processing..." : "Continue"}</span>
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
    </form>
  );
};
export default ForgetForm;
