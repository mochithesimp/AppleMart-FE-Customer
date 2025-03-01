import React from "react";
import Spinner from "../Shared/Spinner";
import { useProducts } from "../../components/Hook/useProducts";
import ProductList from "./ProductList";
import LoadMoreButton from "./LoadMoreButton";

const itemsPerPage = 8; // Số lượng sản phẩm hiển thị ban đầu

const ProductSection: React.FC = () => {
  const { productsWithItems, visibleProducts, loading, handleLoadMore } = useProducts(itemsPerPage);

  return (
    <div className="container mx-auto px-4">
      <h2 className="dark:text-white text-2xl font-bold mb-4">Product List</h2>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <ProductList products={productsWithItems} visibleProducts={visibleProducts} />
          <LoadMoreButton onClick={handleLoadMore} isDisabled={visibleProducts >= productsWithItems.length} />
        </>
      )}
    </div>
  );
};

export default ProductSection;
