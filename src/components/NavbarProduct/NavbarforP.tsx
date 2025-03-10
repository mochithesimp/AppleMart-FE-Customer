import { useEffect, useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import noface from "../../assets/NoFace.jpg";
import DarkMode from "./DarkMode";
import Popup from "../Popup/Popup";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

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
    link: "/#blog",
  },
];
const DropDownLinks = [
  {
    id: 1,
    name: "Trending Product",
    link: "/#",
  },
  {
    id: 2,
    name: "Best Selling",
    link: "/#",
  },
  {
    id: 3,
    name: "Top Rated",
    link: "/#",
  },
];

const NavbarforP = () => {
  const [cartCount, setCartCount] = useState(0);
  const { cart } = useCart();
  const [orderPopup, setOrderPopup] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  //Get token login
  const isLoggedIn = token;

  //Renove token logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    // localStorage.removeItem("cart");
  };

  // Calculate the total quantity in stock
  useEffect(() => {
    const totalQuantityInStock = cart.reduce(
      (total, product) => total + product.quantity,
      0
    );
    setCartCount(totalQuantityInStock);
  }, [cart]);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };
  const iconRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (iconRef.current && iconRef.current.contains(event.target as Node)) ||
        popupRef.current?.contains(event.target as Node)
      ) {
        return;
      }

      setOrderPopup(false);
    }

    if (orderPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [orderPopup]);

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
                <li className="relative cursor-pointer group">
                  <a
                    href="#"
                    className="flex items-center gap-[2px] font-semibold text-gray-500 dark:hover:text-white py-2"
                  >
                    Quick Links
                    <span>
                      <FaCaretDown className="group-hover:rotate-180 duration-300" />
                    </span>
                  </a>
                  {/* Dropdown Link */}
                  <div className="absolute z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white shadow-md dark:bg-gray-900 p-2 dark:text-white ">
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
                    <ul className="space-y-2">
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
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* navbar right section */}
          <div className="flex justify-between items-center gap-4">
            {/* Search Bar section */}
            <div className="relative group hidden sm:block">
              <input type="text" placeholder="Search" className="search-bar" />
              <IoMdSearch className="text-xl text-gray-600 group-hover:text-primary  dark:text-gray-400 absolute top-1/2 -translate-y-1/2 right-3 duration-200" />
            </div>

            {/* Order-button */}
            <button
              className="relative p-3 "
              ref={iconRef}
              onClick={handleOrderPopup}
            >
              <FaCartShopping className="text-xl text-gray-600 dark:text-gray-400" />

              <div className="w-4 h-4 bg-red-500 text-white rounded-full absolute top-0 right-0 flex items-center justify-center text-xs">
                {cartCount}
              </div>
            </button>
            {/* Dark Mode section */}
            <div>
              <DarkMode />
            </div>

            <div className="relative">
              {isLoggedIn ? (
                <div className="relative inline-block">
                  <div className="flex items-center space-x-2 cursor-pointer group">
                    <img
                      src={noface}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="hidden group-hover:block absolute right-0 mt-2 w-32 bg-white border border-gray-300 shadow-lg rounded-lg">
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
                    <button className="">
                      Login
                    </button>
                  </Link>
                </li>
              )}
            </div>
          </div>
        </div>
      </div>
      <Popup
        orderPopup={orderPopup}
        popupRef={popupRef}
        handleOrderPopup={handleOrderPopup}
      />
    </div>
  );
};

export default NavbarforP;
