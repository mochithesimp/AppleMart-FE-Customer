import React from "react";
import ProductItemCard from "../ProductsItems/ProductItemCard";
import { aProduct } from "../../interfaces";

// interface P {
//   id: number;
//   image: string,
//   name: string,
//   price: number,
//   oldPrice: number,
//   discount: number,
//   rating: string,
//   sold: number,
//   storageOptions: string[];
// }

interface ProductListProps {
  // products: P[];
  products: aProduct[];
  visibleProducts: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, visibleProducts }) => {
  // Lấy tất cả product items từ các products
  const allProductItems = products.flatMap(p => p.productItems ?? []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {allProductItems.slice(0, visibleProducts).map((item, index) => (
        <ProductItemCard 
          key={item.productItemID || index} 
          productItem={item}  // Truyền từng item đơn lẻ
        />
      ))}
    </div>
  );
};



export default ProductList;
