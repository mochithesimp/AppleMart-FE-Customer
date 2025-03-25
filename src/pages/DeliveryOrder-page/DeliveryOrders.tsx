import { motion } from "framer-motion";
import { Search } from "lucide-react";
import useOrderData from "../../components/MyOrder/components/useOrderData";
import { Link, useNavigate } from "react-router-dom";
import "../../components/MyOrder/MyOrder.css";
import { orderConfirm } from "../../apiServices/OrderServices/OrderServices";

const DeliveryOrders = () => {
const navigate = useNavigate();
  const { orderData, searchTerm, setSearchTerm } = useOrderData();

  const handleConfirmClick = async (orderId: number) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
          await swal({
            title: "Oops!",
            text: "You haven't logged in yet! Redirecting to Login Page...",
            icon: "warning",
            buttons: {
              ok: {
                text: "OK",
                value: true,
                className: "swal-ok-button",
              },
            },
          });
          window.location.href = "/login";
          return;
        }
      swal({
        title: "This can not be undo!",
        text: "You are about to confirm the order!",
        icon: "warning",
        buttons: ["Cancel", "Confirm"],
        dangerMode: true,
      }).then(async (confirm) => {
        if (confirm) {
          const response = await orderConfirm(orderId, token);
          if (response) {
            swal("Success!", "The order has been confirmed!", "success").then(() => {
              navigate("/MyOrderPage");
            });
          } else {
            throw new Error("Failed to confirm order");
          }
        }
      });
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  return (
    <motion.div
      className="order-table-container bg-white dark:bg-gray-700 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="order-table-header">
        <h2 className="font-semibold">List Orders</h2>
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
              <td>
                {order.orderStatus === "Pending"  && (
                  <button
                    className="confirm-button"
                    onClick={() => handleConfirmClick(order.orderID)}
                  >
                    Cancel
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

export default DeliveryOrders;
