import React from "react";

interface CategoryItemProps {
  icon: React.ElementType;
  name: string;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  icon: Icon,
  name,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center gap-2 p-2 mb-2 cursor-pointer rounded-lg transition 
      ${isActive ? "bg-gray-300 text-black dark:bg-[#52525B] dark:text-white" : "hover:bg-gray-300 hover:dark:bg-[#52525B] text-black dark:text-white "}`}
      onClick={onClick}
    >
      <Icon size={24} />
      <span>{name}</span>
    </div>
  );
};
//pl-2 pr-2 mb-3
export default CategoryItem;
