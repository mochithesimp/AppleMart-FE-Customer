import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      MySwal.fire({
        title: "Login Required",
        text: "Please log in to continue.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });

      return;
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoute;
