import { createContext, useState, useContext, useEffect } from "react";
// import { aProduct, ShopContextType } from "../interfaces";
// import { getProduct } from "../apiServices/ProductServices/productServices";
import { aProduct, ProductItem, ShopContextType } from "../interfaces";
import { getProduct } from "../apiServices/ProductServices/productServices";
import { getProductItems } from "../apiServices/ProductServices/productItemServices";


const ShopContext = createContext<ShopContextType| undefined>(undefined);


export const ShopContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [allProduct, setAllProduct] = useState<aProduct[]>([]);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [product, setProduct] = useState<aProduct[]>([]);
  const [filterProduct, setFilterProduct] = useState<aProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<boolean | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<boolean | null>(null);
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

useEffect(() => {
    const fetchData = async () => {
      const productItems = await getProductItems();
      if (productItems && productItems.items.$values) {
        setProductItems(productItems.items.$values);
      } else {
        console.error("Data not found or invalid response structure");
      }
    };
    fetchData();
  }, []);

  return (
    <ShopContext.Provider value={{ allProduct, productItems, product, filterProduct, selectedProduct, selectedFilter, setProduct, setAllProduct, setFilterProduct, setSelectedProduct, setSelectedFilter}}>
      {children}
    </ShopContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAllProduct = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useAllProduct must be used within a ShopContextProvider");
  }
  return context;
};
