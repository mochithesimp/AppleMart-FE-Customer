// import Button from "../Shared/Button";
// import { IoCloseCircleOutline } from "react-icons/io5";
import React from "react";
import p1 from "../../assets/Product/p-1.jpg";
// import p2 from "../../assets/Product/p-2.jpg";
// import p3 from "../../assets/Product/p-3.jpg";
import empty1 from "../../assets/Empty-1.png";
import empty2 from "../../assets/Empty-2.png";
import "./Style.css";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Popup: React.FC<{
  orderPopup: boolean;
  handleOrderPopup: () => void;
  popupRef: React.RefObject<HTMLDivElement | null>;
}> = ({ orderPopup, popupRef }) => {
  // const cartItems = [
  //   { id: 1, name: "Tai nghe Sony", price: 120.99, image: p1 },
  //   { id: 2, name: "Đồng hồ thông minh", price: 199.99, image: p2 },
  //   { id: 3, name: "Chuột không dây", price: 35.5, image: p3 },
  //   { id: 4, name: "Chuột không dây", price: 35.5, image: p3 },
  // ];

  const { cart, removeItems } = useCart();
  const totalAmount = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  return (
    <>
      <div className="menu-cart__container">
        <div
          ref={popupRef}
          className="menu-cart__main dark:bg-zinc-700 dark:border-none z-30"
          style={{
            left: orderPopup === true ? "76%" : "100%",
            opacity: orderPopup === true ? 1 : 0,
          }}
        >
          <div className="widget_shopping_cart_content ">
            {cart.length > 0 ? (
              <>
                <div className="menu-cart__products">
                  {cart.map((item, index) =>  (
                      <div
                        key={index}
                        className="menu-cart__product dark:border-white"
                      >
                        <div className="menu-cart__product-image w-20 h-20">
                          <img
                            src={p1}
                            alt={item.name}
                            className="menu-cart__product__image w-full h-full object-cover"
                          />
                        </div>
                        <div className="menu-cart__product-name">
                          {item.name}
                        </div>
                        <div className="menu-cart__product-price">
                          {item.quantity} × ${item.price.toLocaleString()}
                        </div>
                        <button className="menu-cart__product-remove" onClick={() => {
                            removeItems(item.productItemID);
                          }}>X</button>
                      </div>
                    )
                  )}
                </div>

                <div className="menu-cart__subtotal dark:border-white">
                  <span>Subtotal: </span> $
                  {totalAmount.toLocaleString()}
                </div>

                <div className="menu-cart__footer-buttons">
                  <Link to="/cart" className="button--view-cart">
                    View cart
                  </Link>
                  <Link to="/checkout" className="button--view-checkout">
                    Checkout
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="empty-message dark:text-white">
                  No products in the cart
                </p>
                <div className="empty--view-cart relative ">
                  <img
                    src={empty1}
                    className="absolute w-40 hidden dark:block opacity-100"
                  ></img>
                  <img src={empty2} className="absolute w-40 dark:hidden"></img>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Popup;
