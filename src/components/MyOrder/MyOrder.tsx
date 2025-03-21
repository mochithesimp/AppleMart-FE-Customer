import { motion } from "framer-motion";
import { Search } from "lucide-react";
import "./MyOrder.css";
import useOrderData from "./components/useOrderData";
import { Link } from "react-router-dom";

const MyOrder = () => {
  const { orderData, searchTerm, setSearchTerm } = useOrderData();

  return (
    <motion.div
      className="order-table-container bg-white dark:bg-gray-700 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="order-table-header">
        <h2 className="font-semibold">My Orders</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search status orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="search-icon" size={18} />
        </div>
      </div>
      <table className="order-table">
        <thead>
          <tr className="dark:bg-zinc-700 dark:text-black">
            <th>Date</th>
            <th>Order ID</th>
            <th>Address</th>
            <th>Payment Method</th>
            <th>Shipping Method</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderData.map((order, index) => (
            <tr key={index}>
              <td>
                <Link
                  to={`/orderdetails/${order.orderID}`}
                  state={{ orderStatus: order.orderStatus }}
                >
                  {order.orderDate}
                </Link>
              </td>
              <td>{order.orderID}</td>
              <td>{order.address}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.shippingMethodId}</td>
              <td>{order.total}</td>
              <td>{order.orderStatus}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default MyOrder;
