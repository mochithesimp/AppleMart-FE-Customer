import { RefreshCcw } from "lucide-react";
import useProductFilter from "../ProductsSection/useProductFilter";
import ColorFilter from "./ColorFilter";
import PriceFilter from "./PriceFilter";
import RamFilter from "./RamFilter";
import RomFilter from "./RomFilter";
import SearchFilter from "./SearchFilter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAttributes } from "../../apiServices/ProductServices/attributeServices";
import { Attribute, ProductItem, ProductItemAttribute } from "../../interfaces";
import { getProductItemAttributes } from "../../apiServices/ProductServices/productItemAttributeServices";

const FilterSection: React.FC<{
  productFilter: ReturnType<typeof useProductFilter>;
  productItems: ProductItem[];
}> = ({ productFilter, productItems }) => {
  const [isRotating, setIsRotating] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [filteredAttributes, setFilteredAttributes] = useState<Attribute[]>([]);
  const [mergedProductItems, setMergedProductItems] = useState<ProductItem[]>([]);
  const [productItemAttributes, setProductItemAttributes] = useState<
      ProductItemAttribute[]
    >([]);
    
  useEffect(() => {
    const fetchAttributes = async () => {
      const response = await getAttributes(); // Gọi API lấy danh sách thuộc tính
      if (response && response.$values) {
        setAttributes(response.$values);
      } else {
        console.error("Data not found or invalid response structure");
      }
    };
    fetchAttributes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const productItemAttributes = await getProductItemAttributes();

      if (productItemAttributes && productItemAttributes.items.$values) {
        setProductItemAttributes(productItemAttributes.items.$values);
      } else {
        console.error("Data not found or invalid response structure");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!productItems.length || !productItemAttributes.length) return;
  
    const merged = productItems.map((product) => {
      const relatedAttributes = productItemAttributes.filter(
        (pia) => pia.productItemID === product.productItemID
      );
  
      return { ...product, productItemAttributes: relatedAttributes };
    });
  
    setMergedProductItems(merged);
  }, [productItems, productItemAttributes]);



  useEffect(() => {
    if (!attributes.length || !mergedProductItems.length) return;
  
    const filtered = attributes.filter((attribute) =>
      mergedProductItems.some(
        (product) =>
          Array.isArray(product.productItemAttributes) && // Kiểm tra tránh lỗi
          product.productItemAttributes.some(
            (pia) => Number(pia.attributeID) === attribute.attributeID
          )
      )
    );
  
    setFilteredAttributes(filtered);
  }, [attributes, mergedProductItems]);

  console.log(">>>>>>>>>>>>>>>>>>>", filteredAttributes)
  return (
    <div className="dark:text-white bg-gray-100 dark:bg-zinc-700 mt-2 shadow-md p-3 border rounded-lg h-full max-h-[600px] overflow-y-auto">
      <div className="flex items-end">
        <h2 className="text-lg font-semibold">Product Filter</h2>
        <motion.div
          animate={{ rotate: isRotating ? 360 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={() => {
            productFilter.resetFilters();
            setIsRotating(true);
            setTimeout(() => setIsRotating(false), 500);
          }}
          className="cursor-pointer ml-9"
        >
          <RefreshCcw />
        </motion.div>
      </div>

      <SearchFilter
        searchTerm={productFilter.searchTerm}
        setSearchTerm={productFilter.setSearchTerm}
      />

      <PriceFilter
        activePrice={productFilter.activePrice}
        handlePriceSort={productFilter.handlePriceSort}
      />

      {/* Duyệt qua danh sách attributes có trong productItems */}
      {filteredAttributes.map((attribute) => {
        if (attribute.attributeName === "Color") {
          return (
            <ColorFilter
              key={attribute.attributeID}
              activeColor={productFilter.activeColor}
              handleColorSort={productFilter.handleColorSort}
            />
          );
        }
        if (attribute.attributeName === "RAM") {
          return (
            <RamFilter
              activeRam={productFilter.activeRam}
              handleRamSort={productFilter.handleRamSort}
            />
          );
        }
        if (attribute.attributeName === "ROM") {
          return (
            <RomFilter
              activeRom={productFilter.activeRom}
              handleRomSort={productFilter.handleRomSort}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default FilterSection;
