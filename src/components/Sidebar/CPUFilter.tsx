const cpuFilters = [
    { label: "M1", value: "M1" },
    { label: "M2", value: "M2" },
    { label: "M3", value: "M3" },
    { label: "M3 Pro", value: "M3 Pro" },
    { label: "M3 Max", value: "M3 Max" },
    { label: "Apple M4", value: "Apple M4" },
    { label: "Apple A14 Bionic", value: "Apple A14 Bionic" },
    { label: "Apple A15 Bionic", value: "Apple A15 Bionic" },
  ];
  
  const CPUFilter: React.FC<{
    activeCPU: string;
    handleCPUSort: (val: string | null) => void;
  }> = ({ activeCPU, handleCPUSort }) => {
    const handleSelect = (value: string) => {
      const newValue = activeCPU === value ? null : value;
      handleCPUSort(newValue);
    };
  
    return (
      <div className="mt-2">
        <label className="text-sm font-medium">CPU:</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {cpuFilters.map((cpu) => (
            <label
              key={cpu.value}
              className="flex items-center gap-1 cursor-pointer"
            >
              <input
                type="checkbox"
                name="cpu"
                value={cpu.value}
                checked={activeCPU === cpu.value}
                onChange={() => handleSelect(cpu.value)}
              />
              <span>{cpu.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };
  
  export default CPUFilter;