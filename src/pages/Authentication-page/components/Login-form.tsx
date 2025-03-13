import { auth, provider, signInWithPopup, db } from "../components/Firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { GoogleAuthProvider } from "firebase/auth";
import { loginGoogle } from "../../../apiServices/AccountServices/loginGoogleServices";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential?.idToken;
      // console.log("idToken:", idToken );

      if (!idToken) {
        console.error("Không thể lấy ID Token từ Google!");
        return;
      }
      let userName = user.displayName; // Mặc định là tên từ Google
      let phoneNumber = user.phoneNumber;
      if (result.user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userNameFromFirestore = userDocSnap.data().userName;
          if (userNameFromFirestore) userName = userNameFromFirestore;
          const numberPhoneFromFirestore = userDocSnap.data().phoneNumber;
          phoneNumber = numberPhoneFromFirestore;
        } else {
          console.log("User document not found!");
        }
        toast.info("Processing registration, please wait...", {
          position: "top-center",
          autoClose: 1000,
        });
        await setDoc(
          doc(db, "Users", user.uid),
          {
            email: user.email,
            name: user.displayName,
          },
          { merge: true }
        );

        const response = await loginGoogle(
          idToken,
          user.email ?? "",
          userName ?? "",
          phoneNumber ?? ""
        );

        if (response.status === 200) {
          const { accessToken, refreshToken } = response.data;

          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        }
        if (!response) {
          throw new Error("Failed to save user to database");
        }

        navigate("/profile");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Response error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>
        <i className="bx bxl-google"></i>
      </button>
    </div>
  );
};

export default GoogleLogin;
