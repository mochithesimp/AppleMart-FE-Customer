
type SearchFilterProps = {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
  };

const SearchFilter: React.FC<SearchFilterProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="mt-2 ">
            <label className="text-sm font-medium">Product name:</label>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-1 border rounded-md dark:text-black"
            />
        </div>
    );
};

export default SearchFilter;
