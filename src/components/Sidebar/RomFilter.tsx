const romFilters = [
  { label: "64GB", value: "64GB" },
  { label: "128GB", value: "128GB" },
  { label: "256GB", value: "256GB" },
  { label: "512GB", value: "512GB" },
  { label: "1TB", value: "1TB" },
];

const RomFilter: React.FC<{
  activeRom: string;
  handleRomSort: (val: string | null) => void;
}> = ({ activeRom, handleRomSort }) => {
    
  const handleSelect = (value: string) => {
    const newValue = activeRom === value ? null : value;
    handleRomSort(newValue);
  };

  return (
    <div className="mt-2">
      <label className="text-sm font-medium">ROM:</label>
      <div className="flex flex-wrap gap-2 mt-1">
        {romFilters.map((rom) => (
          <label
            key={rom.value}
            className="flex items-center gap-1 cursor-pointer"
          >
            <input
              type="checkbox"
              name="rom"
              value={rom.value}
              checked={activeRom === rom.value}
              onChange={() => handleSelect(rom.value)}
            />
            <span>{rom.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RomFilter;
