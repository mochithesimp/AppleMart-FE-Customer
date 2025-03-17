import { useState, useEffect } from "react";
// import img1 from "../../assets/Product/earphone.png";
import { useAllProduct } from "../../context/ShopContext";
import { aProduct } from "../../interfaces";

// 🔹 Danh sách sản phẩm giả lập
// const products = new Array(20).fill(null).map((_, index) => ({
//   id: index + 1,
//   image: img1,
//   name: `Sản phẩm ${index + 1}`,
//   price: Math.floor(Math.random() * 10000000) + 5000000,
//   oldPrice: Math.floor(Math.random() * 12000000) + 7000000,
//   discount: Math.floor(Math.random() * 30),
//   rating: (Math.random() * 5).toFixed(1),
//   sold: Math.floor(Math.random() * 500),
//   storageOptions: ["128GB", "256GB"],
// }));

export const useProducts = (itemsPerPage: number) => {
  const [visibleProducts, setVisibleProducts] = useState(itemsPerPage);
  const [loading, setLoading] = useState(false);
  const { product, allProduct, productItems, filterProduct, setProduct, selectedProduct, selectedFilter, setSelectedFilter} = useAllProduct();
 
  const [productsWithItems, setProductsWithItems] =
    useState<aProduct[]>(allProduct);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [visibleProducts]);

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + itemsPerPage);
  };

  useEffect(() => {
    let newProductsWithItems = [];

    if (!product || product.length === 0) {
      newProductsWithItems = allProduct.map((prod) => ({
        ...prod,
        productItems: productItems.filter(
          (item) => item.productID === prod.productID
        ),
      }));

      setProductsWithItems(newProductsWithItems);
      // Chỉ cập nhật product nếu cần thiết
      if (JSON.stringify(allProduct) !== JSON.stringify(product)) {
        setProduct(allProduct);
      }
    } else {
      newProductsWithItems = product.map((prod) => ({
        ...prod,
        productItems: productItems.filter(
          (item) => item.productID === prod.productID
        ),
      }));

      setProductsWithItems(newProductsWithItems);

      if (filterProduct && filterProduct.length > 0 ) {
       
          if (selectedProduct) {
             newProductsWithItems = filterProduct.map(prod => ({
              ...prod,
              productItems: productItems.filter(apiItem =>
                prod.productItems?.some(filteredItem => filteredItem.productItemID === apiItem.productItemID)
              )
            }));
            
            setProductsWithItems(newProductsWithItems);
            // setSelectedFilter(false);
          }
          else {
            setProductsWithItems(filterProduct);
          }
   
      } 
      else if (filterProduct.length === 0 && selectedFilter ) {
        // Nếu filterProduct không có kết quả, không hiển thị gì cả
        setProductsWithItems([]);
      }
  

      // Chỉ cập nhật product nếu newProductsWithItems khác với product hiện tại
      if (JSON.stringify(newProductsWithItems) !== JSON.stringify(product)) {
        setProduct(newProductsWithItems);
      }
    }
  }, [allProduct, filterProduct, product, productItems, selectedFilter, selectedProduct, setProduct, setSelectedFilter]);

  return { productsWithItems, visibleProducts, loading, handleLoadMore };
};
