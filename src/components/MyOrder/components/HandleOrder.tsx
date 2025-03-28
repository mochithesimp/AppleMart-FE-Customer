// import { orderRating } from "../../../apiServices/OrderServices/OrderServices";
import { orderCancel, orderCompleted, requestRefund } from "../../../apiServices/UserServices/userServices";
import { orderConfirm } from "../../../apiServices/ShipperServices/ShipperServices";
import { swal } from "../../../import/import-another";
import { useState } from "react";
import { rateProduct, rateShipper } from "../../../apiServices/OrderServices/OrderServices";
import * as signalR from "@microsoft/signalr";

const isDevelopment = window.location.hostname === 'localhost';
const API_URL = isDevelopment
  ? 'https://localhost:7140'
  : 'https://deployed-backend-url.azurewebsites.net';

const getSignalRConnection = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const hubUrl = `${API_URL}/notificationHub`;
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => token,
      transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  if (connection.state !== "Connected") {
    await connection.start();
  }

  return connection;
};

const sendDirectNotification = async (userId: string, header: string, content: string) => {
  try {
    const connection = await getSignalRConnection();
    await connection.invoke("SendDirectNotification", userId, header, content);
    console.log(`Notification sent to user ${userId}`);
    await connection.stop();
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sendProductRatingNotification = async (customerName: string, rating: number, productItemId: number) => {
  try {
    const connection = await getSignalRConnection();

    await connection.invoke("SendProductRatingNotification", customerName, rating, productItemId);
    console.log("Product rating notification sent to staff");
    await connection.stop();
  } catch (error) {
    console.error("Error sending product rating notification:", error);
  }
};

const sendProductRatingNotificationWithName = async (customerName: string, rating: number, productItemId: number, productName: string) => {
  try {
    const connection = await getSignalRConnection();

    await connection.invoke("SendProductRatingNotificationWithName", customerName, rating, productItemId, productName);
    console.log("Product rating notification (with name) sent to staff");
    await connection.stop();
  } catch (error) {
    console.error("Error sending product rating notification:", error);
  }
};

const useHandleCancelOrder = () => {

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
                window.location.reload();
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
        title: "Confirm Order Receipt",
        text: "Are you confirming that you've received this order in good condition?",
        icon: "warning",
        buttons: ["Cancel", "Yes, I confirm"],
        dangerMode: true,
      }).then(async (confirm) => {
        if (confirm) {
          const response = await orderCompleted(orderId);
          if (response && response.status >= 200 && response.status < 300) {
            let successMessage = "Thank you for confirming receipt of your order!";

            if (response.data && response.data.shipperName) {
              const shipperName = response.data.shipperName;
              successMessage = `Thank you for confirming delivery from ${shipperName}. We hope to see you again!`;
            }

            swal("Order Completed!", successMessage, "success").then(() => {
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

const useHandleOrderDelivered = () => {
  const handleDeliveredClick = async (orderId: number) => {
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
        title: "Mark as Delivered",
        text: "Are you confirming that you've delivered this order to the customer?",
        icon: "warning",
        buttons: ["Cancel", "Yes, Delivered"],
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
      swal("Error", "Failed to mark order as delivered. Please try again.", "error");
    }
  };

  return { handleDeliveredClick };
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

const useHandleRefundRequest = () => {
  const handleRefundRequest = async (orderId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        swal("Error", "You must be logged in to request a refund.", "error");
        return;
      }

      const refundDialog = await swal({
        title: "Request Refund",
        text: "Please provide a reason for your refund request:",
        content: {
          element: "input",
          attributes: {
            placeholder: "Enter your reason here...",
            type: "text",
          },
        },
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
          },
          confirm: {
            text: "Submit Request",
            value: true,
          }
        },
        dangerMode: true,
      });

      if (!refundDialog) {
        return;
      }

      const reason = refundDialog.toString().trim();

      if (!reason) {
        swal("Error", "You must provide a reason for your refund request.", "error");
        return;
      }

      try {
        const response = await requestRefund(orderId, reason);
        if (response && response.status >= 200 && response.status < 300) {
          swal("Success!", "Refund request submitted successfully!", "success").then(() => {
            window.location.reload();
          });
        } else {
          throw new Error(response?.data?.message || "Failed to submit refund request");
        }
      } catch (refundError) {
        console.error("Error requesting refund:", refundError);
        swal("Error", "Failed to submit refund request. Please try again later.", "error");
      }
    } catch (error) {
      console.error("Error in handleRefundRequest:", error);
      swal("Error", "An unexpected error occurred. Please try again later.", "error");
    }
  };

  return { handleRefundRequest };
};

const useHandleOrderRating = () => {
  const [productRating, setProductRating] = useState(0);
  const [productComment, setProductComment] = useState('');
  const [shipperRating, setShipperRating] = useState(0);
  const [shipperComment, setShipperComment] = useState('');

  const handleProductRating = async (orderDetailId: number, productItemId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        swal("Error", "You must be logged in to rate.", "error");
        return false;
      }

      if (productRating === 0) {
        swal("Error", "Please select a rating.", "error");
        return false;
      }

      const userId = localStorage.getItem("userId") || localStorage.getItem("userID") || localStorage.getItem("userid") || localStorage.getItem("UserID") || localStorage.getItem("user_id");
      if (!userId) {
        swal("Error", "User ID not found. Please log in again.", "error");
        return false;
      }

      const response = await rateProduct({
        userID: userId,
        orderDetailID: orderDetailId,
        productItemID: productItemId,
        rating: productRating,
        comment: productComment
      });

      if (response && response.status >= 200 && response.status < 300) {
        swal("Success", "Product rating submitted!", "success");

        const productName = sessionStorage.getItem(`product_${productItemId}_name`) || "";

        const userName = localStorage.getItem("userName") || userId;

        if (productName) {
          await sendProductRatingNotificationWithName(userName, productRating, productItemId, productName);
        } else {
          await sendProductRatingNotification(userName, productRating, productItemId);
        }

        setProductRating(0);
        setProductComment('');
        return true;
      } else {
        throw new Error("Failed to submit product rating");
      }
    } catch (error) {
      console.error("Error rating product:", error);
      swal("Error", "Failed to submit rating. Please try again.", "error");
      return false;
    }
  };

  const handleShipperRating = async (orderDetailId: number, productItemId: number, shipperId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        swal("Error", "You must be logged in to rate.", "error");
        return false;
      }

      if (shipperRating === 0) {
        swal("Error", "Please select a rating.", "error");
        return false;
      }

      const userId = localStorage.getItem("userId") || localStorage.getItem("userID") || localStorage.getItem("userid") || localStorage.getItem("UserID") || localStorage.getItem("user_id");
      if (!userId) {
        swal("Error", "User ID not found. Please log in again.", "error");
        return false;
      }

      const response = await rateShipper({
        userID: userId,
        orderDetailID: orderDetailId,
        productItemID: productItemId,
        shipperID: shipperId,
        rating: shipperRating,
        comment: shipperComment
      });

      if (response && response.status >= 200 && response.status < 300) {
        swal("Success", "Shipper rating submitted!", "success");

        const orderId = sessionStorage.getItem("currentOrderId") || response.data?.orderID || "Unknown";

        const header = "New Rating Received";
        const content = `A User has rated you ${shipperRating} stars on your delivery service for order with ${orderId}.`;
        await sendDirectNotification(shipperId, header, content);

        setShipperRating(0);
        setShipperComment('');
        return true;
      } else {
        throw new Error("Failed to submit shipper rating");
      }
    } catch (error) {
      console.error("Error rating shipper:", error);
      swal("Error", "Failed to submit rating. Please try again.", "error");
      return false;
    }
  };

  return {
    handleProductRating,
    handleShipperRating,
    productRating,
    setProductRating,
    productComment,
    setProductComment,
    shipperRating,
    setShipperRating,
    shipperComment,
    setShipperComment
  };
};

export { useHandleCancelOrder, useHandleOrderConfirm, useHandleOrderDelivered, useHandleOrderReceived, useHandleRefundRequest, useHandleOrderRating };
