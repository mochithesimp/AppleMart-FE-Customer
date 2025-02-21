import React from "react";

interface CategoryItemProps {
    icon: React.ElementType;
    name: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ icon: Icon, name }) => {
    return (
        <div className="flex items-center gap-2 p-2 text-black cursor-pointer hover:bg-gray-300 rounded-lg transition">
            <Icon size={24} />
            <span>{name}</span>
        </div>
    );
};

export default CategoryItem;
