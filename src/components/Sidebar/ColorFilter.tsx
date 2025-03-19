
const colorFilters = [
  { label: "Black", value: "Black" },
  { label: "White", value: "White" },
  { label: "Blue", value: "Blue" },
  { label: "Red", value: "Red" },
  { label: "Silver", value: "Silver" },
  { label: "Gold", value: "Gold" },
];

const ColorFilter: React.FC<{
  activeColor: string;
  handleColorSort: (val: string | null) => void;
}> = ({ activeColor, handleColorSort }) => {

  const handleSelect = (value: string) => {
    const newValue = activeColor === value ? null : value;
    handleColorSort(newValue);
  };

  return (
    <div className="mt-2">
      <label className="text-sm font-medium">Color:</label>
      <div className="flex flex-wrap gap-2 mt-1">
        {colorFilters.map((color) => (
          <label key={color.value} className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              name="color"
              value={color.value}
              checked={activeColor === color.value}
              onChange={() => handleSelect(color.value)}
            />
            <span>{color.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;
