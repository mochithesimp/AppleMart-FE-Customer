
import { User } from "lucide-react";
import ProfileSection from './ProfileSection';
import './Profile.css'

const Profile = () => {
  return (
    <ProfileSection icon={User} title="User Profile">
    <div className="profile-U-container">
      <img
        src="https://randomuser.me/api/portraits/men/3.jpg"
        alt="User Avatar"
        className="profile-U-avatar"
      />
      <div className="profile-U-info">
        <h3 className="profile-U-name">Vũ</h3>
        <p className="profile-U-email">john.doe@example.com</p>
      </div>
      {/* <button className="profile-U-edit-btn">Edit Profile</button> */}
    </div>

    
   
    </ProfileSection>
  )
}

export default Profile