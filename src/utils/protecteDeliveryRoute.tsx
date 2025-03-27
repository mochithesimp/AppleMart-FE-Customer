import withReactContent from "sweetalert2-react-content";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getRoleFromToken } from "./jwtHelper";

const MySwal = withReactContent(Swal);

const ProtecteDeliveryRoute = ({ children }: { children: React.ReactNode }) => {
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

    const role = getRoleFromToken(token ?? "");

    if (role !== "Shipper") {
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
  }, [navigate]);

  if (isAuthorized === null) {
    return <div className="w-screen h-screen bg-white"></div>; // Màn hình trắng trong khi kiểm tra quyền
  }

  return isAuthorized ? children : null;
};

export default ProtecteDeliveryRoute;
