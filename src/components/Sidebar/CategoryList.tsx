import { Smartphone, Laptop, Headphones, Watch, Tablet } from "lucide-react";
import CategoryItem from "./CategoryItem";

const categories = [
    { name: "Điện thoại", icon: Smartphone },
    { name: "Laptop", icon: Laptop },
    { name: "Phụ kiện", icon: Headphones },
    { name: "Smartwatch", icon: Watch },
    { name: "Tablet", icon: Tablet }
];

const CategoryList: React.FC = () => {
    return (
        <div className="mt-4">
            {categories.map((cat, index) => (
                <CategoryItem key={index} icon={cat.icon} name={cat.name} />
            ))}
        </div>
    );
};

export default CategoryList;
