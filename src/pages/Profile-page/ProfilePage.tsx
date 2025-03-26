
import NavbarforP from '../../components/NavbarProduct/NavbarforP'
import Footer from '../../components/Footer/Footer'
import Profile from '../../components/Profile/Profile'
import './ProfilePage.css'
import AccountSection from '../../components/Profile/AccountSection'

const ProfilePage = () => {
  return (
    
    <div className='pro-container'>
        <NavbarforP/>
        <main className='pro-content'>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Profile/>
            <AccountSection/>
          </div>
         
        </main>
        <Footer/>
    </div>
  )
}

export default ProfilePage