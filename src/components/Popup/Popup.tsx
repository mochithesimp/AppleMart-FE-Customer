// import Button from "../Shared/Button";
// import { IoCloseCircleOutline } from "react-icons/io5";
import React from "react";
import p1 from "../../assets/Product/p-1.jpg";
import p2 from "../../assets/Product/p-2.jpg";
import p3 from "../../assets/Product/p-3.jpg";
import empty1 from "../../assets/Empty-1.png";
import empty2 from "../../assets/Empty-2.png";
import "./Style.css";
import { Link } from "react-router-dom";
// type PopupProps = {
//   orderPopup: boolean;
//   handleOrderPopup: () => void;
// };

const Popup: React.FC<{
  orderPopup: boolean;
  handleOrderPopup: () => void;
  popupRef: React.RefObject<HTMLDivElement | null>;
}> = ({ orderPopup, popupRef }) => {
  const cartItems = [
    { id: 1, name: "Tai nghe Sony", price: 120.99, image: p1 },
    { id: 2, name: "Đồng hồ thông minh", price: 199.99, image: p2 },
    { id: 3, name: "Chuột không dây", price: 35.5, image: p3 },
    { id: 4, name: "Chuột không dây", price: 35.5, image: p3 },
  ];

  return (
    <>
      <div className="menu-cart__container">
        <div
          ref={popupRef}
          className="menu-cart__main dark:bg-zinc-800 dark:border-none "
          style={{
            left: orderPopup === true ? "76%" : "100%",
            opacity: orderPopup === true ? 1 : 0,
          }}
        >
          <div className="widget_shopping_cart_content ">
            {cartItems.length > 0 ? (
              <>
                <div className="menu-cart__products">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="menu-cart__product dark:border-white"
                    >
                      <div className="menu-cart__product-image w-20 h-20">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="menu-cart__product__image w-full h-full object-cover"
                        />
                      </div>
                      <div className="menu-cart__product-name">{item.name}</div>
                      <div className="menu-cart__product-price">
                        1 × ${item.price.toFixed(2)}
                      </div>
                      <button className="menu-cart__product-remove">✖</button>
                    </div>
                  ))}
                </div>

                <div className="menu-cart__subtotal dark:border-white">
                  <span>Subtotal: </span> $
                  {cartItems
                    .reduce((acc, item) => acc + item.price, 0)
                    .toFixed(2)}
                </div>

                <div className="menu-cart__footer-buttons">
                  <Link to="/cart" className="button--view-cart">View cart</Link>                
                  <button className="button--view-checkout">Checkout</button>
                </div>
              </>
            ) : (
              <>
                <p className="empty-message dark:text-white">
                  No products in the cart
                </p>
                <div className="empty--view-cart relative ">
                  <img src={empty1} className="absolute w-40 hidden dark:block opacity-100"></img>
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

// {orderPopup && (
//   <div>
//     <div className="h-screen w-screen fixed top-0 left-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm">
//       <div className="w-[300px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 rounded-xl">
//         {/* HeaderSection */}
//         <div className="flex items-center justify-between">
//           <h1>Order Now</h1>
//           <div>
//             <IoCloseCircleOutline
//               onClick={handleOrderPopup}
//               className="text-2xl cursor-pointer"
//             />
//           </div>
//         </div>
//         {/* FormSection */}
//         <div className="mt-4 flex flex-col gap-y-4">
//           <input type="text" placeholder="Name" className="form-input" />
//           <input type="text" placeholder="Email" className="form-input" />
//           <input
//             type="text"
//             placeholder="Address"
//             className="form-input"
//           />
//           <div className="flex justify-center">
//             <Button
//               text="Order Now"
//               bgColor={"bg-primary"}
//               textColor={"text-white"}
//             ></Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
