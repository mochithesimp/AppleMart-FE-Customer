import NavbarforP from "../../components/NavbarProduct/NavbarforP";
import p1 from "../../assets/Product/p-1.jpg";
import imomo from "../../assets/Checkout/Primary logo@2x.png";
import "./Style.css";
import { useEffect, useRef, useState } from "react";
import { useCheckoutAnimation } from "./useCheckoutAnimation";
import Partners from "../../components/Partners/Partners";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import { getUserIdFromToken } from "../../utils/jwtHelper";
import { orders, ordersByCash } from "../../apiServices/OrderServices/OrderServices";
import { refreshToken } from "../../apiServices/AccountServices/refreshTokenServices";
import {
  getUserId,
  updateUser,
} from "../../apiServices/UserServices/userServices";
import { Iuser } from "../../interfaces";
import { createPaypalTransaction } from "../../apiServices/PaypalServices/PaypalServices";
import PaypalButton from "../../components/PaypalButton/PaypalButton";
import { AxiosError } from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const CheckoutPage = () => {
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<Partial<Iuser>>({});

  const [ward, setWard] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const truckRef = useRef<HTMLDivElement | null>(null);

  const { cart } = useCart();

  const [selectedValue, setSelectedValue] = useState("option1");
  const [paymentMethod, setPaymentMethod] = useState("By Cash");

  // get data user -----------------------------------------------------------------------------

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("Token not found");
      return;
    }
    const userIdFromToken = getUserIdFromToken(token) || "";
    setUserId(userIdFromToken);
  }, [token]);

  //-----   get user by ID
  useEffect(() => {
    const fetchData = async () => {
      const result = await getUserId(userId);
      if (result) {
        setUser(result);
      } else {
        console.error("Data not found or invalid response structure");
      }
    };
    fetchData();
  }, [userId]);

  // ---------  load data address 
  useEffect(() => {
    const storedAddress = localStorage.getItem("shippingAddress");

    if (!storedAddress && user.address) {
      
      setNewAddress(user.address);
    }

    if (storedAddress) {
      const addressParts = storedAddress.split(", ");
      setWard(addressParts[0] || "");
      setDistrict(addressParts[1] || "");
      setProvince(addressParts[2] || "");
      setCountry(addressParts[3] || "");
      setNewAddress(storedAddress);
    }
  }, [user.address]);

  //------- Update user address ---------------------------------
  useEffect(() => {
    const newAddress = [ward, district, province, country]
      .filter(Boolean)
      .join(", ");

      setNewAddress(newAddress);

  }, [ward, district, province, country]);

  //-------------------------------------------------------------------------------------------
  const totalAmount = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  // selected paymentMethod --------------------------------------------
  const handleRadioChange = (option: string) => {
    setSelectedValue(option);
    setPaymentMethod(option === "option1" ? "By Cash" : "E-wallet");
  };

  // animation ---------------------------------------------------------------------------------------

  const handleButtonClick = useCheckoutAnimation({
    button: buttonRef as React.RefObject<HTMLButtonElement>,
    box: boxRef as React.RefObject<HTMLDivElement>,
    truck: truckRef as React.RefObject<HTMLDivElement>,
  });

  // handle checkout ---------------------------------------------------------------------------------
  const MySwal = withReactContent(Swal);

  const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {

    if (!user || !user.phoneNumber) {
      MySwal.fire({
        icon: "error",
        title: "Missing Phone Number",
        text: "Please provide a valid phone number before proceeding.",
      });
      return;
    }

    if (user.phoneNumber.charAt(0) !== "0" || user.phoneNumber.length !== 10) {
      MySwal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Phone number must start with 0 and be exactly 10 digits long.",
      });
      return;
    }
    if (!newAddress) {
      if (!user || !user.address ) {
        MySwal.fire({
          icon: "error",
          title: "Missing Address",
          text: "Please enter your delivery address before proceeding.",
        });
        return;
      }
    }
    const orderDate = new Date().toISOString();
    const shippingMethodId = 1;
    const voucherID = 0;
    const productItems = cart.map((product) => ({
      productItemID: product.productItemID,
      quantity: product.quantity,
      price: product.price,
    }));

    const order = {
      userID: userId,
      shipperID: null,
      orderDate,
      address: newAddress,
      paymentMethod,
      shippingMethodID: shippingMethodId,
      total: totalAmount + 15,
      voucherID,
      orderDetails: productItems
    };

    console.log(JSON.stringify(order));

    const response = await ordersByCash(order);
    if (!response) {
      throw new Error("Failed to store cart data");
    }

    if (response.status === 401) {
      await refreshToken();
    }
    const updatedUser = { ...user, address: newAddress };
    const response2 = await updateUser(userId, updatedUser);
    if (!response2) {
      throw new Error("Error updating user");
    }

    localStorage.removeItem("storedCart");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("currentQuantities");

    // animation
    handleButtonClick(e);

    setTimeout(() => {
      swal({
        title: "Order Placed Successfully!",
        text: "Thank you for your purchase. Please check your purchase order for order details.",
        icon: "success",
        buttons: {
          ok: {
            text: "OK",
            value: true,
            className: "swal-ok-button",
          },
        },
      }).then(() => {
        window.location.href = "/MyOrderPage";
      });
    }, 5000);
  };

  const handlePaypalSuccess = async (paypalPaymentId: string) => {
    try {
      console.log("PayPal payment successful with ID:", paypalPaymentId);

      const orderDate = new Date().toISOString();
      const shippingMethodId = 1;
      const voucherID = 0;
      const productItems = cart.map((product) => ({
        productItemID: product.productItemID,
        quantity: product.quantity,
        price: product.price,
      }));

      const order = {
        userID: userId,
        shipperID: null,
        orderDate,
        address: user.address || "",
        paymentMethod: "E-Wallet Paypal",
        shippingMethodID: shippingMethodId,
        total: totalAmount + 15,
        voucherID,
        orderDetails: productItems
      };

      console.log("Attempting to create order with data:", JSON.stringify(order, null, 2));

      const orderResponse = await orders(order);
      console.log("Order creation response:", orderResponse);

      if (!orderResponse) {
        throw new Error("Failed to store cart data");
      }

      if (orderResponse.status === 401) {
        console.log("Token expired, refreshing...");
        await refreshToken();
      }

      if (!orderResponse.data || !orderResponse.data.orderID) {
        console.error("No orderId received from order creation:", orderResponse);
        throw new Error("Failed to get orderId from order creation");
      }

      const orderId = orderResponse.data.orderID;
      console.log("Received orderId:", orderId);

      const paypalTransaction = {
        orderId: orderId,
        paypalPaymentId,
        status: "COMPLETED",
        amount: totalAmount + 15,
        currency: "USD",
        createdDate: new Date(),
        isDeleted: false
      };

      console.log("Creating PayPal transaction with data:", JSON.stringify(paypalTransaction, null, 2));
      try {
        const transactionResponse = await createPaypalTransaction(paypalTransaction);
        console.log("PayPal transaction creation successful:", transactionResponse);
      } catch (error) {
        console.error("Failed to create PayPal transaction:", {
          error: error instanceof Error ? error.message : "Unknown error",
          transactionData: paypalTransaction
        });
        throw error;
      }

      const response2 = await updateUser(userId, user);
      if (!response2) {
        throw new Error("Error updating user");
      }

      localStorage.removeItem("storedCart");
      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("currentQuantities");

      swal({
        title: "Order Placed Successfully!",
        text: "Thank you for your purchase. Please check your purchase order for order details.",
        icon: "success",
        buttons: {
          ok: {
            text: "OK",
            value: true,
            className: "swal-ok-button",
          },
        },
      }).then(() => {
        window.location.href = "/MyOrderPage";
      });
    } catch (error) {
      console.error("Error in handlePaypalSuccess:", {
        message: error instanceof Error ? error.message : "Unknown error",
        response: (error as AxiosError)?.response?.data,
        status: (error as AxiosError)?.response?.status,
        stack: error instanceof Error ? error.stack : undefined
      });
      swal({
        title: "Payment Failed",
        text: "There was an error processing your payment. Please try again.",
        icon: "error",
      });
    }
  };

  const handlePaypalError = (error: Error | unknown) => {
    console.error("PayPal error:", error);
    swal({
      title: "Payment Failed",
      text: "There was an error processing your payment. Please try again.",
      icon: "error",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <NavbarforP />
      <div className="checkout-container e-checkout">
        <div className="e-checkout-inner">
          <div className="elementor-bill">
            <div className="heading-title dark:text-white mb-5">Checkout</div>
            <div className="e-checkout__container">
              <div className="e-checkout__column-start">
                <div className="e-checkout__colum-left">
                  <div className="col-bill">
                    <div className="billing-fields">
                      <div className="row-title">Billing Details</div>
                      <div className="billing-fields__field-wrapper">
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              value={user.name}
                              placeholder="Name"
                              readOnly
                            />
                          </span>
                        </p>
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              value={user.email}
                              placeholder="Email"
                              readOnly
                            ></input>
                          </span>
                        </p>                     
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              value={user.phoneNumber ?? ""}
                              placeholder="Phone Number"
                              onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                            />
                          </span>
                        </p>  
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              value={user.address}
                              placeholder="Old Adress"
                              readOnly
                            ></input>
                          </span>
                        </p>
                        <h3 className="adress"> New Adress</h3>      
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              value={country || ""}
                              placeholder="Country"
                              onChange={(e) => setCountry(e.target.value)}
                            />
                          </span>
                        </p>
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              value={province || ""}
                              placeholder="Province"
                              onChange={(e) => setProvince(e.target.value)}
                            />
                          </span>
                        </p>
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              value={district || ""}
                              placeholder="District"
                              onChange={(e) => setDistrict(e.target.value)}
                            />
                          </span>
                        </p>
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              value={ward || ""}
                              placeholder="Ward"
                              onChange={(e) => setWard(e.target.value)}
                            />
                          </span>
                        </p>                                     
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="e-checkout__column-end ">
                <div className="e-checkout__column-inner e-sticky-right-column e-sticky-right-column--active">
                  <div className="e-checkout__order_review">
                    <div className="row-title">Your Order</div>
                    <div className="checkout-review-order">
                      <table className="checkout-review-order-table">
                        <thead>
                          <tr>
                            <th className="product-name">Product</th>
                            <th className="product-total">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item, index) => (
                            <tr key={index} className="cart_item">
                              <td className="product-name">
                                <div className="product-image">
                                  <img
                                    src={p1}
                                    alt={item.name}
                                    className="attachment-thumbnail size-thumbnail"
                                  />
                                </div>
                                <div className="product-content dark:text-white">
                                  <span>{item.name}</span>
                                  <span>x{item.quantity}</span>
                                </div>
                              </td>
                              <td className="product-total">
                                <span className="dark:text-white">
                                  ${item.price}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="cart-subtotal">
                            <th>Subtotal</th>
                            <td>
                              <span className="woocommerce-Price-amount amount">
                                <bdi>
                                  <span className="woocommerce-Price-currencySymbol">
                                    $
                                  </span>
                                  {totalAmount.toFixed(2)}
                                </bdi>
                              </span>
                            </td>
                          </tr>
                          <tr className="shipping-totals shipping twbb-shipping-totals twbb-shipping-totals-title">
                            <th>Shipping</th>
                            <td></td>
                          </tr>
                          <tr className="shipping-last">
                            <th>
                              <label>
                                <span className="shipping-method-label">
                                  Flat Rate
                                </span>
                              </label>
                            </th>
                            <td className="shipping-method-cost">$15.00</td>
                          </tr>

                          <tr className="order-total">
                            <th>Total</th>
                            <td className="Price-amount ">
                              <span>${(totalAmount + 15).toFixed(2)}</span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                  <div className="e-checkout__order_review-2 payment-section">
                    <div className="row-title">Payments</div>
                    <div className="checkout-payment">
                      <ul className="payment_methods">
                        <li className="payment_method_cod">
                          {/* Option 1 */}
                          <label className="custom-radio">
                            <input
                              type="radio"
                              name="reward"
                              hidden
                              checked={selectedValue === "option1"}
                              onChange={() => handleRadioChange("option1")}
                            />
                            <span className="radio-icon"></span>
                            Cash on delivery
                          </label>

                          {/* Option 2 */}
                          <label className="custom-radio">
                            <input
                              type="radio"
                              name="reward"
                              hidden
                              checked={selectedValue === "option2"}
                              onChange={() => handleRadioChange("option2")}
                            />
                            <span className="radio-icon"></span>
                            E-wallet payment
                          </label>
                        </li>
                        {selectedValue === "option2" && (
                          <div className="E-wallet-payment">
                            <div className="paypal-container" style={{ marginTop: "15px" }}>
                              <PaypalButton
                                amount={totalAmount + 15}
                                currency="USD"
                                onSuccess={handlePaypalSuccess}
                                onError={handlePaypalError}
                              />
                            </div>
                            <div className="momo-container">
                              <img src={imomo} alt="momo-img" />
                            </div>
                          </div>
                        )}
                      </ul>
                      <div className="place-order">
                        <div className="privacy-policy-text">
                          <p>
                            Your personal data will be used to process your
                            order, support your experience throughout this
                            website, and for other purposes described in our
                          </p>
                        </div>
                        <div>
                          <button
                            ref={buttonRef}
                            className="truck-button"
                            onClick={handleCheckout}
                          >
                            <span className="default">Pay Now</span>
                            <span className="success">
                              Order Placed
                              <svg viewBox="0 0 12 10">
                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                              </svg>
                            </span>
                            <div className="truck" ref={truckRef}>
                              <div className="wheel"></div>
                              <div className="back"></div>
                              <div className="front"></div>
                              <div className="box" ref={boxRef}></div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Partners />
      <Footer />
    </div>
  );
};
export default CheckoutPage;
