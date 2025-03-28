import React from "react";
import {  ProductItem } from "../../interfaces";
import { HandleAddToCart } from "../../pages/Cart-page/components/HandleAddToCart";
import { Link } from "react-router-dom";
import { useProductRatings } from "../../hooks/useProductRatings";

const ProductItemCard: React.FC<{ productItem: ProductItem }> = ({ productItem }) => {
  const { handleAddToCart } = HandleAddToCart();
  const { getRatingForProduct, loading } = useProductRatings();
  
  // Get rating data for this product
  const { averageRating, totalReviewers } = getRatingForProduct(productItem.productItemID);

  const HandleAddToCartClick = (productItem: ProductItem) => {
    handleAddToCart(productItem);
  };
  return (
    <div className="border rounded-xl shadow-md p-4 bg-white dark:bg-zinc-800 relative group transition-all min-h-[410px] duration-300 hover:scale-105 hover:shadow-xl">
      {/* Hình ảnh sản phẩm */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={productItem.productImgs[0].imageUrl}
          alt={productItem.name}
          className="w-full h-60 object-cover rounded-lg group-hover:brightness-75 transition-all duration-300"
        />
        {/* Nút "Add to Cart" */}
        <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary transition-all duration-200"
          onClick={() => HandleAddToCartClick(productItem)} >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <Link to={`/productDetails/${productItem.productItemID}`}><h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-white">{productItem.name}</h3></Link>

      {productItem.price && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
          ${productItem.price.toLocaleString()}
        </p>
      )}

      <p className="text-red-500 font-bold text-xl">
        {productItem.price ? `$${productItem.price.toLocaleString()}` : "Liên hệ"}
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        ⭐ {!loading && typeof averageRating === 'number' ? averageRating.toFixed(1) : '0.0'} | Đánh giá {totalReviewers || 0}
      </p>
    </div>
  );
};

export default ProductItemCard;









// const ProductItemCard: React.FC<ProductProps> = ({
//   image,
//   name,
//   price,
//   oldPrice,
//   discount,
//   rating,
//   sold,
//   storageOptions,
// }) => {
//   return (
// <div className="border rounded-xl shadow-md p-4 bg-white dark:bg-zinc-800 relative group transition-all duration-300 hover:scale-105 hover:shadow-xl">
//   {/* Hình ảnh sản phẩm */}
//   <div className="relative overflow-hidden rounded-lg">
//     <img
//       src={image}
//       alt={name}
//       className="w-full h-48 object-cover rounded-lg group-hover:brightness-75 transition-all duration-300"
//     />
//     {/* Nút "Add to Cart" hiện khi hover */}
//     <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//       <button className="bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary transition-all duration-200">
//         Add to Cart
//       </button>
//     </div>
//   </div>

//   {/* Thông tin sản phẩm */}
//   <h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-white">{name}</h3>
//   {oldPrice && (
//     <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
//       {oldPrice.toLocaleString()}đ
//     </p>
//   )}
//   <p className="text-red-500 font-bold text-xl">{price.toLocaleString()}đ</p>
//   {discount && <span className="text-green-500 text-sm">-{discount}%</span>}
//   <p className="text-sm text-gray-500 dark:text-gray-400">
//     ⭐ {rating} | Đã bán {sold}+
//   </p>
//   <div className="flex gap-2 mt-2">
//     {storageOptions.map((option) => (
//       <span key={option} className="px-2 py-1 bg-gray-100 dark:bg-zinc-700 text-xs rounded text-gray-900 dark:text-white">
//         {option}
//       </span>
//     ))}
//   </div>
// </div>

  
//   );
// };

// export default ProductItemCard;