// import { orderRating } from "../../../apiServices/OrderServices/OrderServices";
import { orderConfirm } from "../../../apiServices/ShipperServices/ShipperServices";
import { orderCancel, orderCompleted } from "../../../apiServices/UserServices/userServices";
import { useNavigate, swal } from "../../../import/import-another";

const useHandleCancelOrder = () => {
  const navigate = useNavigate();

  const handleCancelOrder = async (orderId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        swal("Error", "You must be logged in to cancel an order.", "error");
        return;
      }

      swal({
        title: "This can not be undo!",
        text: "You are about to cancel the order!",
        icon: "warning",
        buttons: ["Cancel", "Confirm"],
        dangerMode: true,
      }).then(async (confirmCancel) => {
        if (confirmCancel) {
          try {
            const response = await orderCancel(orderId);
            if (response && response.status >= 200 && response.status < 300) {

              swal("Success!", "Order was canceled!", "success").then(() => {
                navigate("/MyOrderPage");
              });
            } else {
              throw new Error(response?.data?.message || "Failed to cancel order");
            }
          } catch (cancelError) {
            console.error("Error canceling order:", cancelError);
            swal("Error", "Failed to cancel the order. Please try again later.", "error");
          }
        }
      });
    } catch (error) {
      console.error("Error in handleCancelOrder:", error);
      swal("Error", "An unexpected error occurred. Please try again later.", "error");
    }
  };

  return { handleCancelOrder };
};

const useHandleOrderConfirm = () => {
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
        text: "You are about to mark this order as Delivered!",
        icon: "warning",
        buttons: ["Cancel", "Confirm"],
        dangerMode: true,
      }).then(async (confirm) => {
        if (confirm) {
          const response = await orderConfirm(orderId, token);
          if (response && response.status >= 200 && response.status < 300) {
            swal("Success!", "The order has been marked as Delivered!", "success").then(() => {
              window.location.reload();
            });
          } else {
            throw new Error("Failed to update order status");
          }
        }
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return { handleConfirmClick };
};

const useHandleOrderReceived = () => {
  const handleOrderReceived = async (orderId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      swal({
        title: "Confirm Order Received",
        text: "Have you received your order in good condition?",
        icon: "warning",
        buttons: ["Cancel", "Yes, I have"],
        dangerMode: true,
      }).then(async (confirmReceived) => {
        if (confirmReceived) {
          const response = await orderCompleted(orderId);
          if (response && response.status >= 200 && response.status < 300) {
            let successMessage = "Thank you for shopping at AppleMart. We hope to see you again!";

            if (response.data && response.data.shipperName) {
              const shipperName = response.data.shipperName;
              successMessage = `Thank you for confirming delivery from ${shipperName}. We hope to see you again!`;
            }

            swal("Order Completed!", successMessage, "success").then(() => {
              window.location.reload();
            });
          } else {
            throw new Error("Failed to complete order");
          }
        }
      });
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  

  return { handleOrderReceived };
};
// const useHandleOrderRating = () => {
//   const [productRating, setProductRating] = useState(0);
//   const [productComment, setProductComment] = useState('');
//   const [shipperRating, setShipperRating] = useState(0);
//   const [shipperComment, setShipperComment] = useState('');

//   const handleProductRating = async (orderId: number) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         swal("Error", "You must be logged in to rate.", "error");
//         return;
//       }

  //     const response = await orderRating(orderId, {
  //       productRating,
  //       productComment,
  //       shipperRating: 0,
  //       shipperComment: ''
  //     });

  //     if (response && response.status >= 200 && response.status < 300) {
  //       swal("Success", "Product rating submitted!", "success");
  //       // Reset rating state
  //       setProductRating(0);
  //       setProductComment('');
  //       return true;
  //     } else {
  //       throw new Error("Failed to submit product rating");
  //     }
  //   } catch (error) {
  //     console.error("Error rating product:", error);
  //     swal("Error", "Failed to submit rating. Please try again.", "error");
  //     return false;
  //   }
  // };

  // const handleShipperRating = async (orderId: number) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       swal("Error", "You must be logged in to rate.", "error");
  //       return;
  //     }

  //     const response = await orderRating(orderId, {
  //       productRating: 0,
  //       productComment: '',
  //       shipperRating,
  //       shipperComment
  //     });

  //     if (response && response.status >= 200 && response.status < 300) {
  //       swal("Success", "Shipper rating submitted!", "success");
  //       // Reset rating state
  //       setShipperRating(0);
  //       setShipperComment('');
  //       return true;
  //     } else {
  //       throw new Error("Failed to submit shipper rating");
  //     }
  //   } catch (error) {
  //     console.error("Error rating shipper:", error);
  //     swal("Error", "Failed to submit rating. Please try again.", "error");
  //     return false;
  //   }
  // };

//   return { 
//     handleProductRating, 
//     handleShipperRating,
//     productRating,
//     setProductRating,
//     productComment,
//     setProductComment,
//     shipperRating,
//     setShipperRating,
//     shipperComment,
//     setShipperComment
//   };
// };


export { useHandleCancelOrder, useHandleOrderConfirm, useHandleOrderReceived};
