import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import NavbarforP from "../../components/NavbarProduct/NavbarforP";
import "./Style.css";
import p1 from "../../assets/Product/p-1.jpg";
import p2 from "../../assets/Product/p-2.jpg";
import p3 from "../../assets/Product/p-3.jpg";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import Partners from "../../components/Partners/Partners";
interface Ward {
  Id: string;
  Name: string;
}

interface District {
  Id: string;
  Name: string;
  Wards: Ward[];
}

interface Province {
  Id: string;
  Name: string;
  Districts: District[];
}
const CartPage = () => {
  const cartItems = [
    { id: 1, name: "Tai nghe Sony", price: 120.99, image: p1 },
    { id: 2, name: "Đồng hồ thông minh", price: 199.99, image: p2 },
    { id: 3, name: "Chuột không dây", price: 35.5, image: p3 },
    { id: 4, name: "Chuột không dây", price: 35.5, image: p3 },
    { id: 5, name: "Chuột không dây", price: 35.5, image: p3 },
    { id: 6, name: "Chuột không dây", price: 35.5, image: p3 },
  ];

  const [showForm, setShowForm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("VN");

  // State chứa danh sách tỉnh, quận, phường
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // State lưu giá trị người dùng chọn
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // State lưu địa chỉ sau khi người dùng nhấn Update
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    // Fetch provinces on component mount
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setProvinces(response.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);
  // Xử lý khi chọn tỉnh/thành phố
  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    const province = provinces.find((p) => p.Id === provinceId);
    setDistricts(province?.Districts || []);
    setSelectedDistrict("");
    setWards([]);
    setSelectedWard("");
  };

  // Xử lý khi chọn quận/huyện
  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    const district = districts.find((d) => d.Id === districtId);
    setWards(district?.Wards || []);
    setSelectedWard("");
  };

  // Xử lý khi nhấn nút Update
  const handleUpdateAddress = () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      alert("Vui lòng chọn đầy đủ tỉnh/thành phố, quận/huyện, phường/xã!");
      return;
    }

    // Tìm tên tỉnh, quận, phường
    const provinceName = provinces.find((p) => p.Id === selectedProvince)?.Name;
    const districtName = districts.find((d) => d.Id === selectedDistrict)?.Name;
    const wardName = wards.find((w) => w.Id === selectedWard)?.Name;

    // Cập nhật địa chỉ hiển thị
    setShippingAddress(
      `${wardName}, ${districtName}, ${provinceName}, ${selectedCountry}.`
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 ">
      <NavbarforP />
      <div className="cart-container e-con">
        <div className="e-con-inner">
          <div className="heading-title dark:text-white">
            <Link to="/Cart">Cart</Link>
          </div>
          <div className="elementor-widget">
            <div className="e-cart__container">
              <div className="e-cart__column-start">
                <div className="e-cart__colum-left">
                  <table className="cart-form__contents">
                    <thead>
                      <tr>
                        <th className="product-remove">
                          <span className="screen-reader-text">
                            Remove item
                          </span>
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
                              className=""
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
              </div>
              <div className="e-cart__column-end">
                <div className="e-cart__colum-right">
                  <div className="cart_totals">
                    <h2>Cart Totals</h2>
                    <table className="cart-subtotal__contents">
                      <tbody>
                        <tr className="cart-subtotal">
                          <div>Subtotal</div>
                          <td data-title="Subtotal">
                            <span className="price-amount">$2000</span>
                          </td>
                        </tr>
                        <tr className="shipping-totals">
                          <td data-title="Shipping">
                            <div className="ship">Shipping</div>
                            <ul
                              id="shipping_method"
                              className="shipping-methods"
                            >
                              <li>
                                <label>Flat Rate: $15.00</label>
                              </li>
                            </ul>
                            <p className="shipping-destination">
                              Shipping to{" "}
                              <strong>{shippingAddress || "..."}</strong>
                            </p>
                            <div className="shipping-calculator">
                              <button
                                className={`shipping-calculator-button ${
                                  showForm ? "active" : ""
                                }`}
                                onClick={() => setShowForm(!showForm)}
                              >
                                Change address
                                <span className="dropdown-arrow">▼</span>
                              </button>
                              <div
                                className={`shipping-calulator-form ${
                                  showForm ? "visible" : ""
                                }`}
                              >
                                <div className="form-row chose-country">
                                  <select
                                    className="select-country  dark:bg-black dark:text-white"
                                    value={selectedCountry}
                                    onChange={(e) =>
                                      setSelectedCountry(e.target.value)
                                    }
                                  >
                                    <option value="VN">Vietnam</option>
                                    <option value="US">United States</option>
                                    <option value="JP">Japan</option>
                                  </select>
                                </div>
                                {selectedCountry === "VN" && (
                                  <>
                                    <div className="form-row">
                                      <select
                                        className="select-province dark:bg-black dark:text-white"
                                        value={selectedProvince}
                                        onChange={(e) =>
                                          handleProvinceChange(e.target.value)
                                        }
                                      >
                                        <option value="">
                                          Select a province
                                        </option>
                                        {provinces.map((province) => (
                                          <option
                                            key={province.Id}
                                            value={province.Id}
                                          >
                                            {province.Name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="form-row">
                                      <select
                                        className="select-district  dark:bg-black dark:text-white"
                                        value={selectedDistrict}
                                        onChange={(e) =>
                                          handleDistrictChange(e.target.value)
                                        }
                                        disabled={!selectedProvince}
                                      >
                                        <option value="">
                                          Select a district
                                        </option>
                                        {districts.map((district) => (
                                          <option
                                            key={district.Id}
                                            value={district.Id}
                                          >
                                            {district.Name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="form-row">
                                      <select
                                        className="select-ward dark:bg-black dark:text-white"
                                        value={selectedWard}
                                        onChange={(e) =>
                                          setSelectedWard(e.target.value)
                                        }
                                        disabled={!selectedDistrict}
                                      >
                                        <option value="">Select a ward</option>
                                        {wards.map((ward) => (
                                          <option key={ward.Id} value={ward.Id}>
                                            {ward.Name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="update-address">
                                      <button
                                        className="bt-update-address"
                                        onClick={handleUpdateAddress}
                                      >
                                        Update
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr className="order-total">
                          <div>Total</div>
                          <td data-title="Total">
                            <span className="Price-amount">$2000</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="proceed-to-checkout">
                      <Link to="/Checkout" className="button-checkout">
                        Proceed to Checkout
                      </Link>
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

export default CartPage;
