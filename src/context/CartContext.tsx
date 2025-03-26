import { createContext, useState, useContext, useEffect } from "react";
import { CartContextType, CartProductItem, ProductItem } from "../interfaces";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserIdFromToken } from "../utils/jwtHelper";

interface CartData {
  [orderId: string]: CartProductItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const token = localStorage.getItem("token");

const userIdFromToken = token ? getUserIdFromToken(token) : null;
const userId = userIdFromToken;

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartProductItem[]>([]);
  const [totals, setTotals] = useState<{ [productId: number]: number }>({});

  //------------------------------------------------- localStorage orderData ------------------------------------------

  useEffect(() => {
    if (userId && cart.length > 0) {
      const cartData: CartData = {
        ...JSON.parse(localStorage.getItem("storedCart") || "{}"),
        [userId]: cart,
      };
      localStorage.setItem("storedCart", JSON.stringify(cartData));
    }
  }, [cart]);

  useEffect(() => {
    const cartData: CartData = JSON.parse(localStorage.getItem("storedCart") || "{}");
    const userCartKey = userId || "guest"; // Fix lỗi userId null
    setCart(cartData[userCartKey] || []);
}, []);

  //----------------------------------------------------------------------------------------------------------------------

  const [isToastVisible, setIsToastVisible] = useState(false);

 const addToCart = (ProductItem: ProductItem) => {
    const userCartKey = userId || "guest";
    const cartData: CartData = JSON.parse(localStorage.getItem("storedCart") || "{}");

    const existingProduct = cart.find(
        (item) => item.productItemID === ProductItem.productItemID
    );

    let updatedCart;
    if (!existingProduct) {
        updatedCart = [...cart, { ...ProductItem, quantity: 1 }];
    } else {
        updatedCart = cart.map((item) =>
            item.productItemID === ProductItem.productItemID
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
    }

    setCart(updatedCart);
    cartData[userCartKey] = updatedCart; // Cập nhật dữ liệu trong localStorage
    localStorage.setItem("storedCart", JSON.stringify(cartData));

    setTotals(calculateTotals(updatedCart));
    if (!isToastVisible) {
        showToast(ProductItem.name);
    }
};

  const showToast = (productItemName: string) => {
    setIsToastVisible(true);
    toast.success(`${productItemName} has been added to cart!`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      onClose: () => setIsToastVisible(false),
    });
  };

  const incrementQuantity = (productItemID: number) => {
    const userCartKey = userId || "guest";
    const cartData: CartData = JSON.parse(localStorage.getItem("storedCart") || "{}");

    const updatedCart = cart.map((item) =>
        item.productItemID === productItemID
            ? { ...item, quantity: item.quantity + 1 }
            : item
    );
    
    setCart(updatedCart);
    cartData[userCartKey] = updatedCart;
    localStorage.setItem("storedCart", JSON.stringify(cartData));

    setTotals(calculateTotals(updatedCart));
};

const decrementQuantity = (productItemID: number) => {
  const userCartKey = userId || "guest";
  const cartData: CartData = JSON.parse(localStorage.getItem("storedCart") || "{}");

  const updatedCart = cart.map((item) =>
      item.productItemID === productItemID && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
  );

  setCart(updatedCart);
  cartData[userCartKey] = updatedCart;
  localStorage.setItem("storedCart", JSON.stringify(cartData));

  setTotals(calculateTotals(updatedCart));
};

  const calculateTotals = (cart: CartProductItem[]) => {
    const newTotals: { [productItemID: number]: number } = {};
    cart.forEach((item) => {
      newTotals[item.productItemID] =
        (newTotals[item.productItemID] || 0) + item.price * item.quantity;
    });
    return newTotals;
  };

  useEffect(() => {
    const newTotals = calculateTotals(cart);
    setTotals(newTotals);
  }, [cart]);

  //-------------------------------------------------------
  const removeItems = (productItemID: number) => {
    const updatedCart = cart.filter(
      (item) => item.productItemID !== productItemID
    );
    setCart(updatedCart);

    const cartData: CartData = JSON.parse(
      localStorage.getItem("storedCart") || "{}"
    );
    const userCartKey = userId || "guest";

    cartData[userCartKey] = updatedCart;
    localStorage.setItem("storedCart", JSON.stringify(cartData));

    const storedQuantitiesStr = localStorage.getItem("currentQuantities");
    const storedQuantities = storedQuantitiesStr
      ? JSON.parse(storedQuantitiesStr)
      : {};
    delete storedQuantities[productItemID];

    localStorage.setItem("currentQuantities", JSON.stringify(storedQuantities));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totals,
        removeItems,
        addToCart,
        incrementQuantity,
        decrementQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
