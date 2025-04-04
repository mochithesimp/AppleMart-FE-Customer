import React from "react";
import Spinner from "../Shared/Spinner";
import { useProducts } from "../../components/Hook/useProducts";
// import ProductList from "./ProductList";
// import LoadMoreButton from "./LoadMoreButton";
import ProductItemList from "./ProductItemsList";
import { ProductItem } from "../../interfaces";
import PaginationControls from "./PaginationControls";

const itemsPerPage = 8; // Số lượng sản phẩm hiển thị ban đầu

const ProductSection: React.FC<{ 
  productItems: ProductItem[], 
  productFilter: { pageNumber: number; totalPages: number; handlePageChange: (newPage: number) => void } 
}> = ({ productItems, productFilter }) => {
  const { loading } =
    useProducts(itemsPerPage);

  return (
    <div className="container mx-auto px-4">
      <h2 className="dark:text-white text-2xl font-bold mb-4">Product List</h2>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <ProductItemList productItems={productItems} />
          {productItems.length > 0 && (
            <PaginationControls
              pageNumber={productFilter.pageNumber}
              totalPages={productFilter.totalPages}
              handlePageChange={productFilter.handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductSection;
