import { createContext, useState, useContext, useEffect } from "react";
// import { aProduct, ShopContextType } from "../interfaces";
// import { getProduct } from "../apiServices/ProductServices/productServices";
import { aProduct, ProductImg, ProductItem, ShopContextType } from "../interfaces";
import { getProduct } from "../apiServices/ProductServices/productServices";
import { getProductItems } from "../apiServices/ProductServices/productItemServices";
import { getProductImgs } from "../apiServices/ProductServices/productImgSevices";

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

      const productImgsResult = await getProductImgs();

      const productImgs = productImgsResult.$values;

      // Nhóm ảnh theo productItemID
      const imagesByProductItemID = productImgs.reduce(
        (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          acc: { [x: string]: any[] },
          img: { productItemID: string | number }
        ) => {
          if (!acc[img.productItemID]) {
            acc[img.productItemID] = [];
          }
          acc[img.productItemID].push(img);
          return acc;
        },
        {} as Record<number, ProductImg[]>
      );
      // Gán danh sách ảnh vào productItem tương ứng
      const mergedData: ProductItem[] = productItems.items.$values.map(
        (item: ProductItem) => ({
          ...item, // Giữ nguyên dữ liệu từ API
          productImgs: imagesByProductItemID[item.productItemID] || [], // Thêm danh sách ảnh
        })
      );

     
      if (productItems && productItems.items.$values) {
        setProductItems(mergedData);
      } else {
        console.error("Data not found or invalid response structure");
      }
    };
    fetchData();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        allProduct,
        productItems,
        product,
        filterProduct,
        selectedProduct,
        selectedFilter,
        setProduct,
        setAllProduct,
        setFilterProduct,
        setSelectedProduct,
        setSelectedFilter,
      }}
    >
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
