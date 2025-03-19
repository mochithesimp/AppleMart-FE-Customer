
const priceFilters = [
  { label: "No Filter", value: "" },
  { label: "Under $400", value: "under400" },
  { label: "$400 - $800", value: "400-800" },
  { label: "$800 - $1200", value: "800-1200" },
  { label: "$1200 - $2000", value: "1200-2000" },
  { label: "Above $2000", value: "Above2000" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "priceDesc" },
];

const PriceFilter: React.FC<{
  activePrice: string;
  handlePriceSort: (val: string) => void;
}> = ({ activePrice, handlePriceSort }) => {

  return (
    <div className="mt-2">
      <label className="text-sm font-medium">Price range:</label>
      <div className="flex flex-col gap-1">
        {priceFilters.filter((filter) => filter.value !== "").map((filter) => (
          <label key={filter.value} className="flex items-center gap-1">
            <input
              type="radio"
              name="priceFilter"
              value={filter.value}
              checked={activePrice === filter.value}
              onChange={() => {
                handlePriceSort(filter.value);
              }}
            />
            <span>{filter.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PriceFilter;
