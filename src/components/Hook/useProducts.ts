import { useState, useEffect } from "react";
import img1 from "../../assets/Product/earphone.png";

// 🔹 Danh sách sản phẩm giả lập
const products = new Array(20).fill(null).map((_, index) => ({
  id: index + 1,
  image: img1,
  name: `Sản phẩm ${index + 1}`,
  price: Math.floor(Math.random() * 10000000) + 5000000,
  oldPrice: Math.floor(Math.random() * 12000000) + 7000000,
  discount: Math.floor(Math.random() * 30),
  rating: (Math.random() * 5).toFixed(1),
  sold: Math.floor(Math.random() * 500),
  storageOptions: ["128GB", "256GB"],
}));

export const useProducts = (itemsPerPage: number) => {
  const [visibleProducts, setVisibleProducts] = useState(itemsPerPage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [visibleProducts]);

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + itemsPerPage);
  };

  return { products, visibleProducts, loading, handleLoadMore };
};
