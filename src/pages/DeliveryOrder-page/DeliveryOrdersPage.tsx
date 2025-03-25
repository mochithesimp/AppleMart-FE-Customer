import Footer from '../../components/Footer/Footer';
import DeliveryOrders from '../../components/MyOrder/DeliveryOrders';
import NavbarforP from '../../components/NavbarProduct/NavbarforP';
const DeliveryOrderPage = () => {
  
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <NavbarforP />
      <DeliveryOrders />
      <Footer />
    </div>
  )
}

export default DeliveryOrderPage