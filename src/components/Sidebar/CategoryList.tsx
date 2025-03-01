import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Tablet,
  LucideIcon,
  LayoutGrid,
} from "lucide-react";
import CategoryItem from "./CategoryItem";
import { useEffect, useState } from "react";
import { getCategory } from "../../apiServices/CategoryServices/categoryServices";
import { iCategory } from "../../interfaces";
import { useAllProduct } from "../../context/ShopContext";

// const categories = [
//     { name: "Điện thoại", icon: Smartphone },
//     { name: "Laptop", icon: Laptop },
//     { name: "Phụ kiện", icon: Headphones },
//     { name: "Smartwatch", icon: Watch },
//     { name: "Tablet", icon: Tablet }
// ];

const categoryIcons: { [key: string]: LucideIcon } = {
  iPhone: Smartphone,
  Mac: Laptop,
  AirPods: Headphones,
  "Apple watch": Watch,
  iPad: Tablet,
  Accessories: LayoutGrid,
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<iCategory[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  // const [products, setProducts] = useState<aProduct[]>([]);
  ;const { allProduct, setProduct, setSelectedProduct } = useAllProduct()

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getCategory();
      if (categories?.$values) {
        // Gán icon dựa trên tên danh mục
        const updatedCategories = categories.$values.map((cat: iCategory) => ({
          ...cat,
          icon: categoryIcons[cat.name] || Headphones, // Mặc định nếu không tìm thấy
        }));
        setCategories(updatedCategories);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    const products = allProduct.filter( 
      product => product.categoryID === categoryId
    );
    setProduct(products);
    setSelectedProduct(true);
  };
  return (
    <div className="mt-4">
      {categories.map((cat, index) => (
        <CategoryItem
          key={index}
          icon={categoryIcons[cat.name] || Headphones}
          name={cat.name}
          onClick={() => handleCategoryClick(cat.categoryID)}
        />
      ))}
    </div>
  );
};

export default CategoryList;
