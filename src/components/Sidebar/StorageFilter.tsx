const storageFilters = [
    { label: "128GB", value: "128GB" },
    { label: "256GB", value: "256GB" },
    { label: "512GB", value: "512GB" },
    { label: "1TB", value: "1TB" },
    { label: "2TB", value: "2TB" },
  ];
  
  const StorageFilter: React.FC<{
    activeStorage: string;
    handleStorageSort: (val: string | null) => void;
  }> = ({ activeStorage, handleStorageSort }) => {
    const handleSelect = (value: string) => {
      const newValue = activeStorage === value ? null : value;
      handleStorageSort(newValue);
    };
  
    return (
      <div className="mt-2">
        <label className="text-sm font-medium">Storage:</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {storageFilters.map((storage) => (
            <label
              key={storage.value}
              className="flex items-center gap-1 cursor-pointer"
            >
              <input
                type="checkbox"
                name="storage"
                value={storage.value}
                checked={activeStorage === storage.value}
                onChange={() => handleSelect(storage.value)}
              />
              <span>{storage.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };
  
  export default StorageFilter;