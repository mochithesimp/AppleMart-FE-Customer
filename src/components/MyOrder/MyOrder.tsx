import { motion } from "framer-motion";
import { Search } from "lucide-react";
import "./MyOrder.css";
import useOrderData from "./components/useOrderData";
import { Link } from "react-router-dom";
import {
  useHandleCancelOrder,
  useHandleOrderConfirm,
  // useHandleOrderRating,
  useHandleOrderReceived,
} from "./components/HandleOrder";
import { useState } from "react";

const MyOrder = () => {
  const { orderData, searchTerm, setSearchTerm } = useOrderData();
  const { handleCancelOrder } = useHandleCancelOrder();
  const { handleOrderReceived } = useHandleOrderReceived();
  const { handleConfirmClick } = useHandleOrderConfirm();
  // const { handleProductRating, handleShipperRating } = useHandleOrderRating();
  const [selectedOrderForRating, setSelectedOrderForRating] = useState<number | null>(null);
  const [ratingStage, setRatingStage] = useState<'product' | 'shipper' | null>(null);
  const openRatingModal = (orderId: number) => {
    setSelectedOrderForRating(orderId);
    setRatingStage('product');
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
                      onClick={() => handleConfirmClick(order.orderID)}
                    >
                      Refund
                    </button>
                  </>
                )}
                {order.orderStatus === "Completed" && (
                  <button
                    className="rating-button"
                    onClick={() => openRatingModal(order.orderID)}
                  >
                    Rate Order
                  </button>
                )}
                {order.orderStatus === "Completed" && (
                  <button
                    className="refund-button cursor-pointer"
                    onClick={() => handleOrderReceived(order.orderID)}
                  >
                    Refund
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOrderForRating && ratingStage === 'product' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Rate Product</h2>
           
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setSelectedOrderForRating(null)}
              >
                Exit
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setRatingStage('shipper')}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrderForRating && ratingStage === 'shipper' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Rate Shipper</h2>
          
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setSelectedOrderForRating(null)}
              >
                Exit
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
               
                  setSelectedOrderForRating(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MyOrder;
