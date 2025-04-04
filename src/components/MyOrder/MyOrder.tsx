import { motion } from "framer-motion";
import { Search } from "lucide-react";
import "./MyOrder.css";
import useOrderData from "./components/useOrderData";
import { Link, useNavigate } from "react-router-dom";
import {
  useHandleCancelOrder,
  useHandleOrderConfirm,
  useHandleRefundRequest,
} from "./components/HandleOrder";

const MyOrder = () => {
  const { orderData, searchTerm, setSearchTerm } = useOrderData();
  const { handleCancelOrder } = useHandleCancelOrder();
  const { handleConfirmClick } = useHandleOrderConfirm();
  const { handleRefundRequest } = useHandleRefundRequest();
  const navigate = useNavigate();

  const handleRateOrderClick = (orderId: number) => {
    navigate(`/orderdetails/${orderId}`, { state: { orderStatus: "Completed" } });
  };

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
            placeholder="Search orders by status..."
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
            {/* <th>Shipping Method</th> */}
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
              {/* <td>{order.shippingMethodId}</td> */}
              <td>{order.total}</td>
              <td>{order.orderStatus}</td>
              <td>
                {order.orderStatus === "Pending" && (
                  <button
                    className="cancel-button"
                    onClick={() => handleCancelOrder(order.orderID)}
                  >
                    Cancel
                  </button>
                )}
                {order.orderStatus === "Delivered" && (
                  <>
                    <button
                      className="confirm-button mr-2"
                      onClick={() => handleConfirmClick(order.orderID)}
                    >
                      Confirm
                    </button>
                    <button
                      className="refund-button"
                      onClick={() => handleRefundRequest(order.orderID)}
                    >
                      Refund
                    </button>
                  </>
                )}
                {order.orderStatus === "Completed" && (
                  <button
                    className="rating-button"
                    onClick={() => handleRateOrderClick(order.orderID)}
                  >
                    Rate Order
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default MyOrder;
