import { createContext, useState, useContext, useEffect } from "react";
import { CartContextType, CartProductItem, ProductItem } from "../interfaces"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CartData {
  [orderId: string]: CartProductItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);


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
 
  // useEffect(() => {
  //   const storedCart = localStorage.getItem("cart");

  //   if (storedCart) {
  //     setCart(JSON.parse(storedCart));
  //   }
  // }, []);

  //----------------------------------------------------------------------------------------------------------------------

  const [isToastVisible, setIsToastVisible] = useState(false);

  const addToCart = (ProductItem: ProductItem) => {
    const existingProduct = cart.find(
      (item) => item.productItemID === ProductItem.productItemID
    );

    if (!existingProduct) {
      const updatedCart = [
        ...cart,
        {
          productItemID: ProductItem.productItemID,
          name: ProductItem.name,         
          quantity: 1,
          price: ProductItem.price,
          stock: ProductItem.stock,
          isDeleted: ProductItem.isDeleted,
        },
      ];

      setCart(updatedCart);
      // localStorage.setItem("cart", JSON.stringify(updatedCart));
      setTotals(calculateTotals(updatedCart));
      showToast(ProductItem.name);
    } else {
      const updatedCart = cart.map((item) =>
        item.productItemID === ProductItem.productItemID
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      // localStorage.setItem("cart", JSON.stringify(updatedCart));
      setTotals(calculateTotals(updatedCart));

      if (!isToastVisible) {
        showToast(ProductItem.name);
      }
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
    const updatedCart = cart.map((item) =>
      item.productItemID === productItemID
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
    // localStorage.setItem("cart", JSON.stringify(updatedCart));
    setTotals(calculateTotals(updatedCart));
  };

  const decrementQuantity = (productItemID: number) => {
    const updatedCart = cart.map((item) =>
      item.productItemID === productItemID && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    // localStorage.setItem("cart", JSON.stringify(updatedCart));

    const existingProduct = cart.find((item) => item.productItemID === productItemID);
    if (existingProduct && existingProduct.quantity > 1) {
      setTotals(calculateTotals(updatedCart));
    }

    // localStorage.setItem("cart", JSON.stringify(updatedCart));
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

  const removeItems = (productItemID: number) => {
    const updatedCart = cart.filter((item) => item.productItemID !== productItemID);
    setCart(updatedCart);

    const cartData: CartData = JSON.parse(
      localStorage.getItem("storedCart") || "{}"
    );
    // delete cartData[userId];
    localStorage.setItem("storedCart", JSON.stringify(cartData));

    // localStorage.removeItem("cart");
    // localStorage.setItem("cart", JSON.stringify(updatedCart));

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
