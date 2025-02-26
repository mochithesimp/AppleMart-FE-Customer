import { Smartphone, Laptop, Headphones, Watch, Tablet, LucideIcon, LayoutGrid  } from "lucide-react";
import CategoryItem from "./CategoryItem";
import { useEffect, useState } from "react";
import { getCategory } from "../../apiServices/CategoryServices/categoryServices";
import { iCategory } from "../../interfaces";

// const categories = [
//     { name: "Điện thoại", icon: Smartphone },
//     { name: "Laptop", icon: Laptop },
//     { name: "Phụ kiện", icon: Headphones },
//     { name: "Smartwatch", icon: Watch },
//     { name: "Tablet", icon: Tablet }
// ];

const categoryIcons: { [key: string]: LucideIcon } = {
    "iPhone": Smartphone,
    "Mac": Laptop,
    "AirPods": Headphones,
    "Apple watch": Watch,
    "iPad": Tablet,
    "Accessories": LayoutGrid
  };

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<iCategory[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          const categories = await getCategory();
          if (categories?.$values) {
            // Gán icon dựa trên tên danh mục
            const updatedCategories = categories.$values.map((cat: iCategory) => ({
              ...cat,
              icon: categoryIcons[cat.name] || Headphones // Mặc định nếu không tìm thấy
            }));
            setCategories(updatedCategories);
          }
        };
        fetchData();
      }, []);
    return (
        <div className="mt-4">
            {categories.map((cat, index) => (
                <CategoryItem key={index} icon={categoryIcons[cat.name] || Headphones} name={cat.name} />
            ))}
        </div>
    );
};

export default CategoryList;
