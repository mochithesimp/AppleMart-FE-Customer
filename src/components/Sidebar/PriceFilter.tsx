import {  useState } from "react";
import { useAllProduct } from "../../context/ShopContext";

const priceFilters = [
  { label: "Under $400", value: "under400" },
  { label: "$400 - $800", value: "400-800" },
  { label: "$800 - $1200", value: "800-1200" },
  { label: "$1200 - $2000", value: "1200-2000" },
  { label: "Above $2000", value: "Above2000" },
  { label: "Price: Low to High", value: "low-high" },
  { label: "Price: High to Low", value: "high-low" },
];

const PriceFilter: React.FC = () => {
  const { product, allProduct, setFilterProduct, setSelectedFilter } = useAllProduct(); // allProducts là danh sách sản phẩm gốc
  const [selected, setSelected] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!selectedFilter && selected !== null) {
  //     setSelected(null);
  //   }
  // }, [selected, selectedFilter]);

  const handleFilterChange = (value: string) => {
    setSelected(value);

    let filteredProducts = [...allProduct]; // Dữ liệu gốc không thay đổi

    if (value === "under400") {
      filteredProducts = product
        .map((p) => ({
          ...p,
          productItems: p.productItems?.filter((item) => item.price < 400),
        }))
        .filter((p) => p.productItems && p.productItems.length > 0);
    } else if (value === "400-800") {
      filteredProducts = product
        .map((p) => ({
          ...p,
          productItems: p.productItems?.filter(
            (item) => item.price >= 400 && item.price <= 800
          ),
        }))
        .filter((p) => p.productItems && p.productItems.length > 0);
    } else if (value === "800-1200") {
      filteredProducts = product
        .map((p) => ({
          ...p,
          productItems: p.productItems?.filter(
            (item) => item.price >= 800 && item.price <= 1200
          ),
        }))
        .filter((p) => p.productItems && p.productItems.length > 0);
    } else if (value === "1200-2000") {
      filteredProducts = product
        .map((p) => ({
          ...p,
          productItems: p.productItems?.filter(
            (item) => item.price >= 1200 && item.price <= 2000
          ),
        }))
        .filter((p) => p.productItems && p.productItems.length > 0);
    } else if (value === "Above2000") {
      filteredProducts = product
        .map((p) => ({
          ...p,
          productItems: p.productItems?.filter((item) => item.price > 2000),
        }))
        .filter((p) => p.productItems && p.productItems.length > 0);
    } else if (value === "low-high") {
      filteredProducts = [...product].sort((a, b) => {
        const priceA = Math.min(
          ...(a.productItems?.map((item) => item.price) || [Infinity])
        );
        const priceB = Math.min(
          ...(b.productItems?.map((item) => item.price) || [Infinity])
        );
        return priceA - priceB;
      });
    } else if (value === "high-low") {
      filteredProducts = [...product].sort((a, b) => {
        const priceA = Math.min(
          ...(a.productItems?.map((item) => item.price) || [Infinity])
        );
        const priceB = Math.min(
          ...(b.productItems?.map((item) => item.price) || [Infinity])
        );
        return priceB - priceA;
      });
    }
    console.log(
      "check:  newProductsWithItems222222222222222",
      filteredProducts
    );
    setFilterProduct(filteredProducts);
    setSelectedFilter(true);
    // setSelectedProduct(true);
    
  };

  return (
    <div className="mt-2">
      <label className="text-sm font-medium">Price range:</label>
      <div className="flex flex-col gap-1">
        {priceFilters.map((filter) => (
          <label key={filter.value} className="flex items-center gap-1">
            <input
              type="radio"
              name="priceFilter"
              value={filter.value}
              checked={selected === filter.value}
              onChange={() => handleFilterChange(filter.value)}
            />
            <span>{filter.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PriceFilter;
