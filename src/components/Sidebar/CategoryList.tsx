import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Tablet,
  LucideIcon,
  LayoutGrid,
  LaptopMinimal,
} from "lucide-react";
import CategoryItem from "./CategoryItem";
import { useEffect, useState } from "react";
import { getCategory } from "../../apiServices/CategoryServices/categoryServices";
import { iCategory } from "../../interfaces";

const categoryIcons: { [key: string]: LucideIcon } = {
  iPhone: Smartphone,
  iMac: LaptopMinimal,
  AirPods: Headphones,
  "Apple Watch": Watch,
  iPad: Tablet,
  MacBook: Laptop,
  Accessories: LayoutGrid,
};

type CateFilterProps = {
  activeCate: number | string;
  handleCateSort: (value: number) => void;
};

const CategoryList: React.FC<CateFilterProps> = ({ activeCate, handleCateSort }) => {
  const [categories, setCategories] = useState<iCategory[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getCategory();
      if (categories?.$values) {
        // Gán icon dựa trên tên danh mục
        const updatedCategories = categories.$values.map((cat: iCategory) => ({
          ...cat,
          icon: categoryIcons[cat.name] || Headphones,
        }));
        setCategories(updatedCategories);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mt-4">
      {categories.map((cat, index) => (
        <CategoryItem
          key={index}
          icon={categoryIcons[cat.name] || Headphones}
          name={cat.name}
          isActive={activeCate === cat.categoryID}
          onClick={() => handleCateSort(cat.categoryID)}
        />
      ))}
    </div>
  );
};

export default CategoryList;
