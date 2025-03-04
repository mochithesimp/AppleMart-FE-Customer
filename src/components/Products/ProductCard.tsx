import React from "react";
import Button from "../Shared/Button";
import { ProductItem } from "../../interfaces";
import img1 from "../../assets/Product/earphone.png";
import { HandleAddToCart } from "../../pages/Cart-page/components/HandleAddToCart";
interface ProductCardProps {
  data: ProductItem[];
}
const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const { handleAddToCart } = HandleAddToCart();

  const HandleAddToCartClick = (productItem: ProductItem) => {
    handleAddToCart(productItem);
  };
  return (
    <div className="mb-10">
      {/* card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 place-items-center">
        {data.map((product, index) => (
          <div className="group " key={index}>
            <div className="relative">
              <img
                src={img1}
                alt=""
                className="h-[180px] w-[260px] object-cover rounded-md" 
              />
              {/* hover btn */}
              <div className=" hidden  group-hover:flex absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-full w-full text-center group-hover:backdrop-blur-sm justify-center items-center duration-200">
                <Button
                  text={"Add to Cart"}
                  bgColor={"bg-primary"}
                  textColor={"text-white"} 
                  onClick={() => HandleAddToCartClick(product)} 
                />
              </div>
            </div>
            <div className="leading-7">
              <h2 className="font-semibold">{product.name}</h2>
              <h2 className="font-bold">${product.price}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
