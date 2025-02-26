import Heading from "../Shared/Heading";
import ProductCard from "./ProductCard";

import { useEffect, useState } from "react";
import { ProductItem } from "../../interfaces";
import { getProductItems } from "../../apiServices/ProductServices/productItemServices";

const Products = () => {
  //   const { allProduct } = useAllProduct();
  const [productItems, setProductItems] = useState<ProductItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const productItems = await getProductItems();
         //console.log("check data search: ", res);
      if (productItems && productItems.$values) {
        setProductItems(productItems.$values);
      } else {
        console.error("Data not found or invalid response structure");
      }
    };
    fetchData();
  }, [productItems]);

  return (
    <div>
      <div className="container">
        {/* Header */}
        <Heading title="Our Products" subtitle={"Explore Our Products"} />
        {/* Body */}
        <ProductCard data={productItems} />
      </div>
    </div>
  );
};

export default Products;
