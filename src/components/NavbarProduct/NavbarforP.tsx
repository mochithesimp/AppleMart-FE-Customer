import { useEffect, useRef, useState } from "react";
import { FaBell, FaCartShopping, FaTrash } from "react-icons/fa6";
import noface from "../../assets/NoFace.jpg";
import DarkMode from "./DarkMode";
import Popup from "../Popup/Popup";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useNotification } from "../../context/NotificationContext";
import { getUserIdFromToken } from "../../utils/jwtHelper";
import { CartProductItem } from "../../interfaces";
import { getUserId } from "../../apiServices/UserServices/userServices";

interface CartData {
  [orderId: string]: CartProductItem[];
}
const MenuLinks = [
  {
    id: 1,
    name: "Home",
    link: "/#",
  },
  {
    id: 2,
    name: "Shop",
    link: "/ProductMenu",
  },
  {
    id: 3,
    name: "Chat",
    link: "/Chat",
  },
  {
    id: 4,
    name: "Blogs",
    link: "/Blogs",
  },
];

export interface IUser {
  id: string;
  role: string;
  name: string;
  avatar: string;
}

const NavbarforP = () => {
  const [cartCount, setCartCount] = useState(0);
  const { cart } = useCart();
  const [user, setUser] = useState({} as IUser);
  const [orderPopup, setOrderPopup] = useState<boolean>(false);
  const [notificationPopup, setNotificationPopup] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const bellIconRef = useRef<HTMLButtonElement>(null);
  const orderPopupRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  // Kiểm tra nếu đường dẫn hiện tại là "/checkout" thì ẩn nút giỏ hàng
  const isCheckoutPage = location.pathname === "/checkout";

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          console.error("Token not found");
          return;
        }
        const userIdFromToken = getUserIdFromToken(token) || "";
        const userData = await getUserId(userIdFromToken);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user", error);
        throw new Error("User not found");
      }
    };

    fetchUser();
  }, [token]);

  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    connectionState,
    testConnection,
  } = useNotification();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        !bellIconRef.current?.contains(event.target as Node)
      ) {
        setNotificationPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead(notificationId);
  };

  const handleDeleteNotification = async (notificationId: number) => {
    await deleteNotification(notificationId);
  };

  const isLoggedIn = token;

  const handleLogout = () => {
    const cartData: CartData = JSON.parse(
      localStorage.getItem("storedCart") || "{}"
    );
    delete cartData[user.id || "guest"];
    localStorage.setItem("storedCart", JSON.stringify(cartData));

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    // localStorage.removeItem("cart");
  };

  useEffect(() => {
    const totalQuantityInStock = cart.reduce(
      (total, product) => total + product.quantity,
      0
    );
    setCartCount(totalQuantityInStock);
  }, [cart]);

  const formatUnreadCount = (count: number): string => {
    return count > 99 ? "99+" : count.toString();
  };

  //debug connection signalR dung` xoa nhung~ dong` nay
  useEffect(() => {
    console.log("Current notification connection state:", connectionState);
  }, [connectionState]);

  useEffect(() => {
    console.log("Current notifications:", notifications);
  }, [notifications]);

  useEffect(() => {
    console.log("Current unread count:", unreadCount);
  }, [unreadCount]);

  const handleTestConnection = async () => {
    await testConnection();
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 fixed z-40 w-[100%]">
      <div className="py-4">
        <div className="container flex justify-between items-center">
          <div className=" flex items-center gap-4">
            {/* Logo */}
            <Link
              to={"/"}
              className=" text-primary font-semibold tracking-widest text-2xl uppercase sm:text 3xl "
            >
              AppleMart
            </Link>
            {/* Menu */}
            <div className=" lg:block">
              <ul className="flex items-center gap-4">
                {MenuLinks.map((data, index) => (
                  <li key={index}>
                    <Link
                      to={data.link}
                      className="inline-block px-4 font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200 p-2 hover:bg-red-400 w-full"
                    >
                      {data.name}
                    </Link>
                  </li>
                ))}
                {/* dropdown */}
                {/* <li className="relative cursor-pointer group">
                  <a
                    href="#"
                    className="flex items-center gap-[2px] font-semibold text-gray-500 dark:hover:text-white py-2"
                  >
                    Quick Links
                    <span>
                      <FaCaretDown className="group-hover:rotate-180 duration-300" />
                    </span>
                  </a> */}
                {/* Dropdown Link */}
                {/* <div className="absolute z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white shadow-md dark:bg-gray-900 p-2 dark:text-white "> */}
                {/* <ul className=" space-y-2">
                      {DropDownLinks.map((data) => (
                        <li>
                          <a
                            className="text-gray-500 dark:hover:text-white duration-200 inline-block w-full p-2 hover:bg-primary/20 rounded-md font-semibold"
                            href={data.link}
                          >
                            {data.name}
                          </a>
                        </li>
                      ))}
                    </ul> */}
                {/* <ul className="space-y-2">
                      {DropDownLinks.map((data, index) => (
                        <li key={index}>
                          <a
                            className="text-gray-500 dark:hover:text-white duration-200 inline-block w-full p-2 hover:bg-primary/20 rounded-md font-semibold"
                            href={data.link}
                          >
                            {data.name}
                          </a>
                        </li>
                      ))}
                    </ul> */}
                {/* </div> */}
                {/* </li> */}
              </ul>
            </div>
          </div>
          {/* navbar right section */}
          <div className="flex justify-between items-center gap-4">
            {/* Search Bar section */}
            {/* <div className="relative group hidden sm:block">
              <input type="text" placeholder="Search" className="search-bar" />
              <IoMdSearch className="text-xl text-gray-600 group-hover:text-primary dark:text-gray-400 absolute top-1/2 -translate-y-1/2 right-3 duration-200" />
            </div> */}

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="relative p-3"
                ref={bellIconRef}
                onClick={() => {
                  setNotificationPopup(!notificationPopup);
                  if (!notificationPopup) {
                    handleTestConnection();
                  }
                }}
              >
                <FaBell className="text-xl text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <div className="w-4 h-4 bg-red-500 text-white rounded-full absolute top-0 right-0 flex items-center justify-center text-xs">
                    {formatUnreadCount(unreadCount)}
                  </div>
                )}
              </button>

              {/* Notification Popup */}
              {notificationPopup && (
                <div
                  ref={notificationRef}
                  className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50"
                >
                  {/* Arrow */}
                  <div className="absolute -top-2 right-[12px] w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-t border-l border-gray-200 dark:border-gray-700"></div>

                  {/* Content Container */}
                  <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        Notifications
                      </h3>
                    </div>

                    {/* Notification Content */}
                    <div className="max-h-[400px] overflow-y-auto">
                      {!Array.isArray(notifications) ||
                      notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 px-4">
                          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                            <span className="text-4xl text-orange-400">😕</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-center font-medium">
                            No notifications yet
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {notifications.map((notification, index) => (
                            <div
                              key={notification.notificationID}
                              className={`relative group hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                !notification.isRead
                                  ? "bg-blue-50 dark:bg-blue-900/20"
                                  : ""
                              }`}
                              onClick={() =>
                                handleMarkAsRead(notification.notificationID)
                              }
                            >
                              <div className="p-4 cursor-pointer">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 pr-8">
                                    <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">
                                      {notification.header}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                                      {notification.content}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                      {new Date(
                                        notification.createdDate
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNotification(
                                        notification.notificationID
                                      );
                                    }}
                                    className="opacity-0 group-hover:opacity-100 absolute right-2 top-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-all"
                                    aria-label="Delete notification"
                                  >
                                    <FaTrash className="text-gray-500 hover:text-red-500 text-sm" />
                                  </button>
                                </div>
                              </div>
                              {index === 4 && notifications.length > 5 && (
                                <div className="text-center py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Scroll to see {notifications.length - 5}{" "}
                                    more notifications
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order-button */}
            {!isCheckoutPage && (
              <button
                className="relative p-3"
                onClick={() => setOrderPopup((prev) => !prev)}
              >
                <FaCartShopping className="text-xl text-gray-600 dark:text-gray-400" />
                <div className="w-4 h-4 bg-red-500 text-white rounded-full absolute top-0 right-0 flex items-center justify-center text-xs">
                  {cartCount}
                </div>
              </button>
            )}
            {/* Dark Mode section */}
            <div>
              <DarkMode />
            </div>

            <div className="relative">
              {isLoggedIn ? (
                <div className="relative inline-block">
                  <div className="flex items-center space-x-2 cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <img
                        src={user.avatar || noface}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />

                      {/* Text */}
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Welcome</span>
                        <span className="text-sm font-semibold">
                          {user.name}
                        </span>
                      </div>
                    </div>
                    <div className="hidden group-hover:block absolute right-0 mt-28 w-32 bg-white border border-gray-300 shadow-lg rounded-lg">
                      {user.role === "Shipper" && (
                        <Link
                          to="/MyOrderPage"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          Delivery
                        </Link>
                      )}
                      {user.role !== "Shipper" && (
                        <Link
                          to="/MyOrderPage"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          My Order
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/login"
                        onClick={handleLogout}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Logout
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <li className="list-none">
                  <Link to="/login">
                    <button className="">Login</button>
                  </Link>
                </li>
              )}
            </div>
          </div>
        </div>
      </div>
      <Popup
        orderPopup={orderPopup}
        popupRef={orderPopupRef}
        handleOrderPopup={() => setOrderPopup(false)}
      />
    </div>
  );
};

export default NavbarforP;
