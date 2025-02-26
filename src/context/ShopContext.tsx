import { createContext, useState, useContext, useEffect } from "react";
// import { aProduct, ShopContextType } from "../interfaces";
import { getProduct } from "../apiServices/ProductServices/productServices";
import { aProduct, ShopContextType } from "../interfaces";

export const ShopContext = createContext<ShopContextType>({
  allProduct: [],
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAllProduct = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const ShopContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [allProduct, setAllProduct] = useState<aProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getProduct();
      if (result && result.$values) {
        setAllProduct(result.$values);
      } else {
        console.error("Data not found or invalid response structure");
      }
    };
    fetchData();
  }, []);

  return (
    <ShopContext.Provider value={{ allProduct }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
