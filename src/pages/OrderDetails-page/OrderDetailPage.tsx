import OrderDetails from '../../components/MyOrder/OrderDetails';
import NavbarforP from '../../components/NavbarProduct/NavbarforP';
const OrderDetailPage = () => {
  
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <NavbarforP />
      <OrderDetails />
    </div>
  )
}

export default OrderDetailPage