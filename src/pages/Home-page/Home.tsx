import NavbarforP from "../../components/NavbarProduct/NavbarforP";
import Hero from "../../components/Hero/Hero";
import Category from "../../components/Category/Category";
import Category2 from "../../components/Category/Category2";
import Services from "../../components/Services/Services";
import Banner from "../../components/Banner/Banner";
import headphone from "../../assets/Product/headphone.png";
import smartwatch2 from "../../assets/Product/smartwatch2-removebg-preview.png";
import Products from "../../components/Products/Products";
import Blogs from "../../components/Blogs/Blogs";
import Partners from "../../components/Partners/Partners";
import Footer from "../../components/Footer/Footer";
import { useEffect, useState } from "react";
import { getProductItems } from "../../apiServices/ProductServices/productItemServices";
import ProductItemCard from "../../components/ProductsItems/ProductItemCard";
import { ProductItem } from "../../interfaces";
import useProductFilter from "../../components/ProductsSection/useProductFilter";
import BlogsCard from "../../components/Blogs/BlogsCard";
const BannerData2 = {
  discount: "30% OFF",
  title: "Happy Hours",
  date: "14 Jan to 28 Jan",
  image: smartwatch2,
  title2: "Smart Solo",
  title3: "Winter Sale",
  title4:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit.Eaque reiciendis",
  bgColor: "#2dcc6f",
};
const BannerData = {
  discount: "30 % OFF",
  title: "Fine Smile",
  date: "10 Jan to 28 Jan",
  image: headphone,
  title2: "Air Solo Bass",
  title3: "Winter Sale",
  title4:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit.Eaque reiciendis",
  bgColor: "#f42c37",
};
const HomePage = () => {
  const [orderPopup, setOrderPopup] = useState<boolean>(false);
  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
    
  };
  const {
    productItems
  } = useProductFilter();
  
  const [products, setProducts] = useState<ProductItem[]>([]);;
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductItems();
        setProducts(response); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <NavbarforP />
      <Hero handleOrderPopup={handleOrderPopup} />
      <Category />
      <Category2 />
      <Services />
      <Banner data={BannerData} />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6">Our Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productItems.length > 0 ? (
            productItems.slice(0,8).map((product) => (
              <ProductItemCard key={product.productItemID} productItem={product} />
            ))
          ) : (
            <p className="text-center col-span-full">Không có sản phẩm nào</p>
          )}
        </div>
      </div>
      
      <Banner data={BannerData2} />
      <div>
        <h2 className="text-2xl font-bold text-center mb-6"> Recent News</h2>
        <BlogsCard limit = {3}/>
        </div>
      
      <Partners />
      <Footer />
    </div>
  );
};
export default HomePage;
