import { auth, provider, signInWithPopup, db } from "./components/Firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const GoogleLogin = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User info:", result.user);
      const user = result.user;
      console.log("User info111:", user);
      if (result.user) {
        await setDoc(
          doc(db, "Users", user.uid),
          {
            email: user.email,
            name: user.displayName,
            phoneNumber: user.phoneNumber,
          },
          { merge: true }
        );
        toast.success("User logged in Successfully", {
          position: "top-center",
        });
        window.location.href = "/profile";
      }
    } catch (error) {
      console.error("Login error:", error);
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
