import { Link } from "react-router-dom";
import NavbarforP from "../../components/NavbarProduct/NavbarforP";
import "./Style.css";
import p1 from "../../assets/Product/p-1.jpg";
import p2 from "../../assets/Product/p-2.jpg";
import p3 from "../../assets/Product/p-3.jpg";
const CartPage = () => {
  const cartItems = [
    { id: 1, name: "Tai nghe Sony", price: 120.99, image: p1 },
    { id: 2, name: "Đồng hồ thông minh", price: 199.99, image: p2 },
    { id: 3, name: "Chuột không dây", price: 35.5, image: p3 },
    { id: 4, name: "Chuột không dây", price: 35.5, image: p3 },
  ];
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <NavbarforP />
      <div className="cart-container e-con">
        <div className="e-con-inner">
          <div className="heading-title dark:text-white">
            <Link to="/Cart">Cart</Link>
          </div>
          <div className="elementor-widget">
            <div className="e-cart__container">
              <div className="e-cart__colum-left">
                <table className="cart-form__contents">
                  <thead>
                    <tr>
                      <th className="product-remove">
                        <span className="screen-reader-text">Remove item</span>
                      </th>
                      <th className="product-thumbnail">
                        <span className="screen-reader-text">
                          Thumbnail image
                        </span>
                      </th>
                      <th className="product-name">Product</th>
                      <th className="product-price">Price</th>
                      <th className="product-quanity">Quantity</th>
                      <th className="product-subtotal">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item.id}
                        className="cart-form__cart-item cart_item"
                      >
                        <td className="product-remove">
                          <button className="text-red-500">X</button>
                        </td>
                        <td className="product-thumbnail">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16"
                          />
                        </td>
                        <td className="product-name">{item.name}</td>
                        <td className="product-price">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="product-quantity">
                          <div className="quantity flex items-center">
                            <button className="minus-quantity px-2">-</button>
                            <input
                              className="input-text-qty w-12 text-center"
                              type="text"
                              value="1"
                              readOnly
                            />
                            <button className="plus-quantity px-2">+</button>
                          </div>
                        </td>
                        <td className="product-subtotal">
                          ${item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="e-cart__colum-right"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
