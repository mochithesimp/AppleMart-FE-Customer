import Footer from '../../components/Footer/Footer';
import MyOrder from '../../components/MyOrder/MyOrder';
import NavbarforP from '../../components/NavbarProduct/NavbarforP';
const MyOrderPage = () => {
  
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <NavbarforP />
      <MyOrder />
      <Footer />
    </div>
  )
}

export default MyOrderPage