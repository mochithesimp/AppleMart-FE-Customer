import React from "react";
import ProductItemCard from "../ProductsItems/ProductItemCard";
import { ProductItem } from "../../interfaces";

interface ProductItemListProps {
  productItems: ProductItem[];
}
const ProductItemList: React.FC<ProductItemListProps> = ({ productItems }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {productItems.map((item) => (
        <ProductItemCard 
          key={item.productItemID} 
          productItem={item} 
        />
      ))}
    </div>
  );
};

export default ProductItemList;
