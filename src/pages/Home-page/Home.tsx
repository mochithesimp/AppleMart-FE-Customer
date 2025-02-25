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
import { useState } from "react";

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
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <NavbarforP />
      <Hero handleOrderPopup={handleOrderPopup} />
      <Category />
      <Category2 />
      <Services />
      <Banner data={BannerData} />
      <Products></Products>
      <Banner data={BannerData2} />
      <Blogs />
      <Partners />
      <Footer />
    </div>
  );
};
export default HomePage;
