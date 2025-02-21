import React from "react";
import ProductItemCard from "../ProductsItems/ProductItemCard";

interface ProductListProps {
  products: any[];
  visibleProducts: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, visibleProducts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.slice(0, visibleProducts).map((product) => (
        <ProductItemCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductList;
