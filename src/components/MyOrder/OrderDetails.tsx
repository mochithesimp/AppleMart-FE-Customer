import { motion } from "framer-motion";
import "./MyOrder.css";
import { useOrderDetails } from "./components/useOrderDetails";

const OrderDetails = () => {
  //   const { orderData } = useOrderData();
  const { productItems, orderDetails, orderId } = useOrderDetails();

  return (
    <motion.div
      className="order-table-container bg-white dark:bg-gray-700 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="order-table-header">
        <h2 className="font-semibold">Order ID: {orderId}</h2>
      </div>
      <table className="order-table">
        <thead>
          <tr className="dark:bg-zinc-700 dark:text-black">
            <th>ProductItem ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.map((order, index) => {
            const productItem = productItems.find(
              (p) => p.productItemID === order.productItemID
            );
            return (
              <tr key={index}>
                <td>{order.productItemID}</td>
                <td>
                  <img
                    src={
                      productItem?.productImgs &&
                      productItem.productImgs.length > 0
                        ? productItem?.productImgs[0].imageUrl
                        : "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60"
                    }
                    alt="Product"
                    className="product-image"
                  />
                  {productItem?.name}
                </td>
                <td>{order.quantity}</td>
                <td>{order.price}</td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
};
export default OrderDetails;
