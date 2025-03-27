
import './AccountSection.css';

const AccountSection = () => {
  return (
    <div className="account-section-container">
      <div className="account-section-grid">
        <div className="account-section-column">
          <div className="account-input-group">
            <label>Name</label>
            <input 
              type="text" 
              placeholder="Enter Name" 
              defaultValue="VU CO"
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
          
        </div>
        <div className="account-section-column">
          <div className="account-input-group">
            <label>Adress</label>
            <input 
              type="text" 
              placeholder="Enter Address" 
              defaultValue="1 Wall Street HCM City"
            />
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