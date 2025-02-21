const colors = ["Đen", "Trắng", "Xanh", "Đỏ", "Vàng", "Tím"];

const ColorFilter: React.FC = () => {
    return (
        <div className="mt-2">
            <label className="text-sm font-medium">Màu sắc:</label>
            <div className="flex flex-wrap gap-2 mt-1">
                {colors.map((color) => (
                    <label key={color} className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" name="color" value={color} />
                        <span>{color}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ColorFilter;
