const priceFilters = [
    { label: "Từ 5 triệu trở lên", value: "5tr" },
    { label: "Từ 15 triệu trở lên", value: "15tr" },
    { label: "Từ 30 triệu trở lên", value: "30tr" },
    { label: "Giá từ thấp đến cao", value: "asc" },
    { label: "Giá từ cao đến thấp", value: "desc" }
];

const PriceFilter: React.FC = () => {
    return (
        <div className="mt-2">
            <label className="text-sm font-medium">Khoảng giá:</label>
            <div className="flex flex-col gap-1">
                {priceFilters.map((filter) => (
                    <label key={filter.value} className="flex items-center gap-1">
                        <input type="radio" name="priceFilter" value={filter.value} />
                        <span>{filter.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default PriceFilter;
