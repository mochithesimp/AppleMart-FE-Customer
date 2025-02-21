const romOptions = ["64GB", "128GB", "256GB", "512GB", "1TB"];

const RomFilter: React.FC = () => {
    return (
        <div className="mt-2">
            <label className="text-sm font-medium">Dung lượng ROM:</label>
            <div className="flex flex-wrap gap-2 mt-1">
                {romOptions.map((rom) => (
                    <label key={rom} className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" name="rom" value={rom} />
                        <span>{rom}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RomFilter;
