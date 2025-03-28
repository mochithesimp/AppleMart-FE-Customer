import withReactContent from "sweetalert2-react-content";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getRoleFromToken } from "./jwtHelper";

const MySwal = withReactContent(Swal);

const ProtectedRoute = ({
  children,
  allowedRoles = ["Admin", "Staff", "Customer", "Shipper"],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // Trạng thái kiểm tra quyền

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      MySwal.fire({
        title: "Login Required",
        text: "Please log in to continue.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login", { replace: true });
      });

      setIsAuthorized(false); // Không hiển thị nội dung
      return;
    }

    const roleIdentifier = getRoleFromToken(token) ?? ""; // Đảm bảo không có giá trị null

    if (!roleIdentifier || !allowedRoles.includes(roleIdentifier)) {
      MySwal.fire({
        title: "Access Denied",
        text: "You do not have permission to access this page.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(-1); // Quay lại trang trước đó
      });

      setIsAuthorized(false); // Không hiển thị nội dung
      return;
    }

    setIsAuthorized(true); // Cho phép hiển thị nội dung
  }, [allowedRoles, navigate]);

  if (isAuthorized === null) {
    return <div className="w-screen h-screen bg-white"></div>; // Màn hình trắng trong khi kiểm tra quyền
  }

  return isAuthorized ? children : null;
};

export default ProtectedRoute;
