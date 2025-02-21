import { useState } from "react";

const SearchFilter: React.FC = () => {
    const [search, setSearch] = useState("");

    return (
        <div className="mt-2">
            <label className="text-sm font-medium">Tên sản phẩm:</label>
            <input
                type="text"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-1 border rounded-md"
            />
        </div>
    );
};

export default SearchFilter;
