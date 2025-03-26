// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import img1 from "../../assets/image.png";
import NavbarforP from "../../components/NavbarProduct/NavbarforP";
// import Blogs from "../../components/Blogs/Blogs";
import BlogsCard from "../../components/Blogs/BlogsCard";
import Footer from "../../components/Footer/Footer";



const Blog = () => {
//   const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <NavbarforP />
      <div className="pt-12"><BlogsCard/></div>
      <Footer/>
      
    </div>
  );
};

export default Blog;
