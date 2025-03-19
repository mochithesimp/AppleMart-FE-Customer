import { RefreshCcw } from "lucide-react";
import useProductFilter from "../ProductsSection/useProductFilter";
import ColorFilter from "./ColorFilter";
import PriceFilter from "./PriceFilter";
import RamFilter from "./RamFilter";
import RomFilter from "./RomFilter";
import SearchFilter from "./SearchFilter";
import { motion } from "framer-motion";
import { useState } from "react";

const FilterSection: React.FC<{
  productFilter: ReturnType<typeof useProductFilter>;
}> = ({ productFilter }) => {
  const [isRotating, setIsRotating] = useState(false);
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
      <div>
      <PriceFilter
        activePrice={productFilter.activePrice}
        handlePriceSort={productFilter.handlePriceSort}
      />
      <ColorFilter
        activeColor={productFilter.activeColor}
        handleColorSort={productFilter.handleColorSort}
      />
      </div>
      
      <RomFilter
        activeRom={productFilter.activeRom}
        handleRomSort={productFilter.handleRomSort}
      />
      <RamFilter
        activeRam={productFilter.activeRam}
        handleRamSort={productFilter.handleRamSort}
      />
    </div>
  );
};

export default FilterSection;
