const ramOptions = ["4GB", "8GB", "16GB", "32GB"];

const RamFilter: React.FC = () => {
    return (
        <div className="mt-2">
            <label className="text-sm font-medium">Dung lượng RAM:</label>
            <div className="flex flex-wrap gap-2 mt-1">
                {ramOptions.map((ram) => (
                    <label key={ram} className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" name="ram" value={ram} />
                        <span>{ram}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RamFilter;
