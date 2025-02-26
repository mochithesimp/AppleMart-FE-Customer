import NavbarforP from "../../components/NavbarProduct/NavbarforP";
import p1 from "../../assets/Product/p-1.jpg";
import p2 from "../../assets/Product/p-2.jpg";
import p3 from "../../assets/Product/p-3.jpg";
import imomo from "../../assets/Checkout/Primary logo@2x.png";
import "./Style.css";
import { useRef, useState } from "react";
import { useCheckoutAnimation } from "./useCheckoutAnimation";
import Partners from "../../components/Partners/Partners";
import Footer from "../../components/Footer/Footer";

const CheckoutPage = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const truckRef = useRef<HTMLDivElement | null>(null);

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleRadioChange = (value: string) => {
    setSelectedValue((prev) => (prev === value ? null : value));
  };

  const handleButtonClick = useCheckoutAnimation({
    button: buttonRef as React.RefObject<HTMLButtonElement>,
    box: boxRef as React.RefObject<HTMLDivElement>,
    truck: truckRef as React.RefObject<HTMLDivElement>,
  });
  const cartItems = [
    { id: 1, name: "Tai nghe Sony", price: 120.99, quantity: 1, image: p1 },
    {
      id: 2,
      name: "Đồng hồ thông minh",
      price: 199.99,
      quantity: 2,
      image: p2,
    },
    { id: 3, name: "Chuột không dây", price: 35.5, quantity: 1, image: p3 },
    { id: 4, name: "Chuột không dây", price: 35.5, quantity: 1, image: p3 },
    { id: 5, name: "Chuột không dây", price: 35.5, quantity: 1, image: p3 },
    { id: 6, name: "Chuột không dây", price: 35.5, quantity: 1, image: p3 },
  ];
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
                              placeholder="Name"
                            ></input>
                          </span>
                        </p>
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              placeholder="Country"
                            ></input>
                          </span>
                        </p>
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              placeholder="Province"
                            ></input>
                          </span>
                        </p>
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              placeholder="District"
                            ></input>
                          </span>
                        </p>
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              placeholder="Ward"
                            ></input>
                          </span>
                        </p>
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              placeholder="Phone Number"
                            ></input>
                          </span>
                        </p>
                        <p className="form-row form-row-wide">
                          <span className="input-wrapper">
                            <input
                              className="input-text"
                              placeholder="Email"
                            ></input>
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
                          {cartItems.map((item) => (
                            <tr key={item.id} className="cart_item">
                              <td className="product-name">
                                <div className="product-image">
                                  <img
                                    src={item.image}
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
                                  375.98
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
                              <span>$390.98</span>
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
                            <div
                              className="paypal-container"
                              style={{ marginTop: "15px" }}
                            >
                              <table
                                style={{ border: "0" }}
                                cellPadding="10"
                                cellSpacing="0"
                                align="center"
                              >
                                <tbody>
                                  <tr>
                                    <td align="center">
                                      <a
                                        href="https://www.paypal.com/webapps/mpp/paypal-popup"
                                        title="How PayPal Works"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          window.open(
                                            "https://www.paypal.com/webapps/mpp/paypal-popup",
                                            "WIPaypal",
                                            "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1060,height=700"
                                          );
                                        }}
                                      >
                                        <img
                                          src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                                          alt="PayPal Logo"
                                          style={{ border: 0 }}
                                        />
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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
                            onClick={handleButtonClick}
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
