import { auth, provider, signInWithPopup, db } from "./components/Firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const GoogleLogin = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User info:", result.user);
      const user = result.user;

      // const response = await fetch('https://localhost:7140/api/Account/Register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: user.email,
      //     name: user.displayName,
      //     password: "",
      //     confirmPassword: "",
      //   }),
      // });
  
      // if (!response.ok) {
      //   throw new Error('Failed to save user to database');
      // }

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
