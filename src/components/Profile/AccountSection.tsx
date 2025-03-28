import { useEffect, useState } from "react";
import "./AccountSection.css";
import {
  getUserId,
  updateUser,
} from "../../apiServices/UserServices/userServices";
import { getUserIdFromToken } from "../../utils/jwtHelper";
import { refreshToken } from "../../apiServices/AccountServices/refreshTokenServices";
import swal from "sweetalert";
export interface IUser {
  id: string;
  role: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  address: string;
}

const AccountSection = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({} as IUser);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          console.error("Token not found");
          return;
        }
        const userIdFromToken = getUserIdFromToken(token) || "";
        const userData = await getUserId(userIdFromToken);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user", error);
        throw new Error("User not found");
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhoneNumber(user.phoneNumber);
      setAddress(user.address);
    }
  }, [user]);

  const handleSave = async () => {
    const errors: string[] = [];
  
    if (phoneNumber.charAt(0) !== "0" || phoneNumber.length !== 10) {
      errors.push("Phone number must start with 0 and be exactly 10 digits long.");
    }
  
    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      swal("Validation Error", errors.join("\n"), "error");
      return;
    }
  
    // Hiển thị hộp thoại xác nhận
    const confirmUpdate = await swal({
      title: "Confirm Update",
      text: "Are you sure you want to save the changes?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
      dangerMode: true,
    });
  
    if (!confirmUpdate) return; // Nếu bấm "Cancel", thoát khỏi hàm
  
    try {
      const updatedUser = {
        ...user,
        name,
        phoneNumber,
        address,
      };
      const response = await updateUser(user.id, updatedUser);
  
      if (response) {
        swal("Success", "User information updated successfully!", "success").then(
          () => {
            window.location.reload();
          }
        );
        refreshToken();
      } else {
        swal("Error", "Failed to update user information.", "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      swal("Error", "Error occurred during updating user information.", "error");
    }
  };

  return (
    <div className="account-section-container">
      <div className="account-section-grid">
        <div className="account-section-column">
          <div className="account-input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="account-input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber || ""}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="account-section-column">
          <div className="account-input-group">
            <label>Adress</label>
            <input
              type="text"
              placeholder="Enter Address"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="account-input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              defaultValue={user.email}
              readOnly
            />
          </div>
          <div className="account-input-group">
            <button
              className="account-edit-button"
              onClick={() => handleSave()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;
