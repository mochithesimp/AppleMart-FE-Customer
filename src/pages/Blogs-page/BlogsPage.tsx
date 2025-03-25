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
      
      {/* <div className="max-w-6xl mx-auto p-6 bg-black text-white min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-400">
          Latest Articles
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Posts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
            >
              <motion.img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-2xl hover:brightness-110 transition duration-300"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                <button
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  Read More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Blog;
