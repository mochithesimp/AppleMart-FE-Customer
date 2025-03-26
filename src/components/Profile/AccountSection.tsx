
import './AccountSection.css';

const AccountSection = () => {
  return (
    <div className="account-section-container">
      <div className="account-section-grid">
        <div className="account-section-column">
          <div className="account-input-group">
            <label>First Name</label>
            <input 
              type="text" 
              placeholder="Enter first name" 
              defaultValue="Thanh"
            />
          </div>
          <div className="account-input-group">
            <label>Middle Name</label>
            <input 
              type="text" 
              placeholder="Enter middle name" 
              defaultValue="Joker"
            />
          </div>
          <div className="account-input-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              placeholder="Enter phone number" 
              defaultValue="+84 123456789"
            />
          </div>
          <div className="account-input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="********"
            />
          </div>
        </div>
        <div className="account-section-column">
          <div className="account-input-group">
            <label>Last Name</label>
            <input 
              type="text" 
              placeholder="Enter last name" 
              defaultValue="Vũ"
            />
          </div>
          <div className="account-input-group">
            <label>Gender</label>
            <select defaultValue="female">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="account-input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter email" 
              defaultValue="johndoe@gmail.com"
            />
          </div>
          <div className="account-input-group">
            <button className="account-edit-button">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSection;