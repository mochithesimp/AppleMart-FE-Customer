import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getRoleFromToken } from "./jwtHelper";

const MySwal = withReactContent(Swal);

const ProtectedRoute = ({ children, allowedRoles = ["Admin", "Staff", "Customer", "Shipper"], }: { children: React.ReactNode; allowedRoles?: string[]; }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      MySwal.fire({
        title: "Login Required",
        text: "Please log in to continue.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    const roleIdentifier = getRoleFromToken(token) ?? ""; // Đảm bảo không có giá trị null

    if (!roleIdentifier || !allowedRoles.includes(roleIdentifier)) {
      window.history.back();
      return;
    }
  }, [allowedRoles, navigate]);

  return children;
};

export default ProtectedRoute;
