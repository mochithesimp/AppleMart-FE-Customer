import { motion } from "framer-motion";
import "./MyOrder.css";
import { useOrderDetails } from "./components/useOrderDetails";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useHandleOrderRating } from "./components/HandleOrder";
import { Star } from "lucide-react";
import { getUserProductRatingStatus, getShipperInfo, hasUserRatedShipper } from "../../apiServices/OrderServices/OrderServices";

const OrderDetails = () => {
  //   const { orderData } = useOrderData();
  const { productItems, orderDetails, orderId, orderData } = useOrderDetails();
  const location = useLocation();
  const orderStatus = location.state?.orderStatus;
  const [selectedItemForRating, setSelectedItemForRating] = useState<number | null>(null);
  const [showShipperRating, setShowShipperRating] = useState(false);
  const [ratingStatus, setRatingStatus] = useState<Record<number, boolean>>({});
  const [isLoadingRatingStatus, setIsLoadingRatingStatus] = useState(true);
  const [shipperName, setShipperName] = useState<string>("Unknown");
  const [hasRatedShipper, setHasRatedShipper] = useState<boolean>(false);
  const [isCheckingShipperRating, setIsCheckingShipperRating] = useState<boolean>(false);

  // Fetch rating status for all order details
  useEffect(() => {
    const fetchRatingStatus = async () => {
      if (orderDetails.length === 0) return;

      try {
        setIsLoadingRatingStatus(true);
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("User ID not found, can't check rating status");
          setIsLoadingRatingStatus(false);
          return;
        }

        const orderDetailIds = orderDetails.map(detail => detail.orderDetailID);
        const response = await getUserProductRatingStatus(userId, orderDetailIds);

        if (response && response.status >= 200 && response.status < 300) {
          setRatingStatus(response.data);
        }
      } catch (error) {
        console.error("Error fetching rating status:", error);
      } finally {
        setIsLoadingRatingStatus(false);
      }
    };

    fetchRatingStatus();
  }, [orderDetails]);

  // Get shipper information
  const shipperInfo = orderData && orderData.length > 0 && orderId
    ? orderData.find(o => o.orderID === parseInt(orderId.toString()))
    : null;

  const shipperId = shipperInfo?.shipperID || null;
  const orderIdNumber = orderId ? parseInt(orderId.toString()) : 0;

  // Fetch shipper name if we have a shipper ID
  useEffect(() => {
    const fetchShipperName = async () => {
      if (!shipperId) return;

      try {
        const response = await getShipperInfo(shipperId.toString());
        if (response && response.status >= 200 && response.status < 300 && response.data) {
          setShipperName(response.data.name || "Unknown");
        }
      } catch (error) {
        console.error("Error fetching shipper details:", error);
      }
    };

    fetchShipperName();
  }, [shipperId]);

  // Check if shipper has been rated
  useEffect(() => {
    const checkShipperRating = async () => {
      if (!shipperId || !orderId) return;

      try {
        setIsCheckingShipperRating(true);
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("User ID not found, can't check shipper rating status");
          setIsCheckingShipperRating(false);
          return;
        }

        const response = await hasUserRatedShipper(userId, shipperId.toString(), orderIdNumber);

        if (response && response.status >= 200 && response.status < 300) {
          setHasRatedShipper(response.data);
        }
      } catch (error) {
        console.error("Error checking shipper rating status:", error);
      } finally {
        setIsCheckingShipperRating(false);
      }
    };

    checkShipperRating();
  }, [shipperId, orderId, orderIdNumber]);

  const {
    handleProductRating,
    handleShipperRating,
    productRating,
    setProductRating,
    productComment,
    setProductComment,
    shipperRating,
    setShipperRating,
    shipperComment,
    setShipperComment,
  } = useHandleOrderRating();

  const handleRateShipperClick = () => {
    setShowShipperRating(true);
  };

  const renderStarRating = (currentRating: number, setRatingFunc: (rating: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`cursor-pointer ${currentRating >= i ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          onClick={() => setRatingFunc(i)}
          size={24}
        />
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  const handleRatingSubmit = async (orderDetailId: number, productItemId: number) => {
    const success = await handleProductRating(orderDetailId, productItemId);
    if (success) {
      // Update the rating status locally
      setRatingStatus(prev => ({
        ...prev,
        [orderDetailId]: true
      }));

      // Close the product rating popup first
      setSelectedItemForRating(null);
    }
  };

  const handleShipperRatingSubmit = async () => {
    if (!shipperId || !orderDetails.length) {
      setShowShipperRating(false);
      return;
    }

    const detailForRating = orderDetails[0];
    const success = await handleShipperRating(
      detailForRating.orderDetailID,
      detailForRating.productItemID,
      shipperId.toString()
    );

    if (success) {
      setHasRatedShipper(true);
      setShowShipperRating(false);
    }
  };

  // Helper to determine if the shipper rate button should be shown
  const showRateShipperButton = orderStatus === "Completed" && shipperId && !hasRatedShipper && !isCheckingShipperRating;

  return (
    <motion.div
      className="order-table-container bg-white dark:bg-gray-700 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="order-table-header flex justify-between items-center">
        <h2 className="font-semibold">Order ID: {orderId}</h2>
        {shipperId && (
          <div className="flex items-center gap-4">
            <p className="font-medium">Shipper: {shipperName}</p>
            {isCheckingShipperRating ? (
              <span className="text-gray-400">Checking...</span>
            ) : showRateShipperButton ? (
              <button
                className="rating-button"
                onClick={handleRateShipperClick}
              >
                Rate Shipper
              </button>
            ) : hasRatedShipper ? (
              <span className="text-green-500">Shipper Rated</span>
            ) : null}
          </div>
        )}
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

            const isRated = ratingStatus[order.orderDetailID] === true;
            const showRateButton = orderStatus === "Completed" && !isRated && !isLoadingRatingStatus;

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
                <td>
                  {isLoadingRatingStatus ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : showRateButton ? (
                    <button
                      className="rating-button"
                      onClick={() => setSelectedItemForRating(order.orderDetailID)}
                    >
                      Rate Product
                    </button>
                  ) : isRated ? (
                    <span className="text-green-500">Rated</span>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedItemForRating !== null && !showShipperRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 dark:bg-gray-800 dark:text-white">
            <h2 className="text-xl font-bold mb-4">Rate Product</h2>

            {renderStarRating(productRating, setProductRating)}

            <div className="mt-4">
              <label htmlFor="product-comment" className="block mb-2">Comment (Optional)</label>
              <textarea
                id="product-comment"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows={4}
                value={productComment}
                onChange={(e) => setProductComment(e.target.value)}
                placeholder="Share your experience with this product..."
              ></textarea>
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded dark:bg-gray-600"
                onClick={() => setSelectedItemForRating(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
                onClick={() => {
                  const orderDetail = orderDetails.find(item => item.orderDetailID === selectedItemForRating);
                  if (orderDetail) {
                    handleRatingSubmit(selectedItemForRating, orderDetail.productItemID);
                    // Force close popup after submission
                    setTimeout(() => {
                      setSelectedItemForRating(null);
                    }, 300);
                  }
                }}
                disabled={productRating === 0}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {showShipperRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 dark:bg-gray-800 dark:text-white">
            <h2 className="text-xl font-bold mb-4">Rate Shipper: {shipperName}</h2>

            {renderStarRating(shipperRating, setShipperRating)}

            <div className="mt-4">
              <label htmlFor="shipper-comment" className="block mb-2">Comment (Optional)</label>
              <textarea
                id="shipper-comment"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows={4}
                value={shipperComment}
                onChange={(e) => setShipperComment(e.target.value)}
                placeholder="Share your experience with the delivery service..."
              ></textarea>
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded dark:bg-gray-600"
                onClick={() => {
                  setShowShipperRating(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
                onClick={handleShipperRatingSubmit}
                disabled={shipperRating === 0}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default OrderDetails;
