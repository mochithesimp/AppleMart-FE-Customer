const ramFilters = [
  { label: "4GB", value: "4GB" },
  { label: "8GB", value: "8GB" },
  { label: "16GB", value: "16GB" },
  { label: "32GB", value: "32GB" },
];

const RamFilter: React.FC<{
  activeRam: string;
  handleRamSort: (val: string | null) => void;
}> = ({ activeRam, handleRamSort }) => {
  
  const handleSelect = (value: string) => {
    const newValue = activeRam === value ? null : value;
    handleRamSort(newValue);
  };

  return (
    <div className="mt-2">
      <label className="text-sm font-medium">RAM: </label>
      <div className="flex flex-wrap gap-2 mt-1">
        {ramFilters.map((ram) => (
          <label
            key={ram.value}
            className="flex items-center gap-1 cursor-pointer"
          >
            <input
              type="checkbox"
              name="ram"
              value={ram.value}
              checked={activeRam === ram.value}
              onChange={() => handleSelect(ram.value)}
            />
            <span>{ram.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RamFilter;
