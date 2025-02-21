import { Filter } from "lucide-react";
import { useSidebar } from "./SidebarContext";

const SidebarToggle: React.FC = () => {
    const { toggleSidebar } = useSidebar();

    return (
        <button
            className="lg:hidden fixed top-4 left-4 bg-gray-300 p-2 rounded-full shadow-md"
            onClick={toggleSidebar}
        >
            <Filter size={24} />
        </button>
    );
};

export default SidebarToggle;
