import { User } from "lucide-react";
import ProfileSection from "./ProfileSection";
import "./Profile.css";
import { useEffect, useState } from "react";
import { getUserIdFromToken } from "../../utils/jwtHelper";
import { getUserId, updateUser } from "../../apiServices/UserServices/userServices";
import { ImageUpload } from "./ImageAvatarUpload";
import noface from "../../assets/NoFace.jpg";

export interface IUser {
  $id: number;
  id: string;
  role: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  address: string;
}

const Profile = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({} as IUser);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Hiển thị ảnh trước khi upload
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }

    try {
      // Upload lên Firebase Storage
      const imageUrl = await ImageUpload(selectedFile, user.$id);

      // Cập nhật avatar mới lên backend
      const updatedUser = { ...user, avatar: imageUrl };
      await updateUser(user.id, updatedUser);

      // Cập nhật state và thông báo thành công
      setUser(updatedUser);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };

  return (
    <ProfileSection icon={User} title="My Profile">
      <div className="profile-U-container">
        <label htmlFor="imageInput" className="profile-U-avatar-label">
          <img
            src={imagePreview || user.avatar || noface}
            alt="User Avatar"
            className="profile-U-avatar"
          />
        </label>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <div className="profile-U-info">
          <h3 className="profile-U-name">{user.name}</h3>
          <p className="profile-U-email">{user.email}</p>
        </div>
        <button className="profile-U-edit-btn" onClick={handleUpload}>Upload</button>
      </div>
    </ProfileSection>
  );
};

export default Profile;
