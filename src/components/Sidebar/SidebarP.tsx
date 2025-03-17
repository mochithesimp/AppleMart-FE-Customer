import { X, Filter } from "lucide-react";
import CategoryList from "./CategoryList";
import FilterSection from "./FilterSection";
import { useSidebar } from "./SidebarContext";
import classNames from "classnames";
import { useState } from "react";

const SidebarP: React.FC = () => {
    const { openSidebar, toggleSidebar } = useSidebar();
    const [showFilter, setShowFilter] = useState(false);

    return (
        <>
            {/* Sidebar */}
            <div
                className={classNames(
                    " dark:text-white sticky top-20 mt-5 left-7  bg-gray-100 dark:bg-zinc-700 shadow-lg z-30 w-64 p-4 transition-transform duration-300 lg:w-56 rounded-[15px]",
                    {
                        "translate-x-0": openSidebar, 
                        "-translate-x-full lg:translate-x-0": !openSidebar 
                    }
                )}
            >
                {/* Nút đóng sidebar trên mobile */}
                <button
                    className="lg:hidden absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full"
                    onClick={toggleSidebar}
                >
                    <X size={24} />
                </button>

                {/* Icon Bộ lọc với dropdown */}
                <div className="relative">
                    <button
                        className="  flex items-center gap-2 bg-gray-200 dark:bg-zinc-600 p-2 rounded-lg w-full hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                        onMouseEnter={() => setShowFilter(true)}
                        onMouseLeave={() => setShowFilter(false)}
                    >
                        <Filter size={20} />
                        <span className="font-semibold">Product Filter</span>
                    </button>

                    {/* Dropdown Filter Section */}
                    <div 
                        className={`absolute top-0 left-full ml-3 w-64 bg-white dark:bg-zinc-800 shadow-lg p-3 rounded-lg transition-all duration-300 ${
                            showFilter ? "opacity-100 visible translate-x-0" : "opacity-0 invisible -translate-x-2"
                        }`}
                        onMouseEnter={() => setShowFilter(true)}
                        onMouseLeave={() => setShowFilter(false)}
                    >
                        <FilterSection />
                    </div>
                </div>

                {/* Danh mục */}
                <CategoryList />
            </div>

            {/* Overlay khi sidebar mở trên mobile */}
            {openSidebar && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default SidebarP;
