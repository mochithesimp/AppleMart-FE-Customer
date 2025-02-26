import ColorFilter from "./ColorFilter";
import PriceFilter from "./PriceFilter";
import RamFilter from "./RamFilter";
import RomFilter from "./RomFilter";
import SearchFilter from "./SearchFilter";

const FilterSection: React.FC = () => {
    return (
        <div className="dark:text-white bg-gray-100 dark:bg-zinc-700 mt-2 shadow-md p-3 border rounded-lg h-full max-h-[600px] overflow-y-auto">
            <h2 className="text-lg font-semibold">Product Filter</h2>
            <SearchFilter />
            <PriceFilter />
            <ColorFilter />
            <RomFilter />
            <RamFilter />
        </div>
    );
};

export default FilterSection;
