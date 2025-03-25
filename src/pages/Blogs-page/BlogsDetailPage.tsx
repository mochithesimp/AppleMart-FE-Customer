import BlogsDetail from "../../components/Blogs/BlogsDetail"
import Footer from "../../components/Footer/Footer"
import NavbarforP from "../../components/NavbarProduct/NavbarforP"

const BlogsDetailPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <NavbarforP />
      <div className="pt-12"><BlogsDetail/></div>
      <Footer/>
      
   
    </div>
  )
}

export default BlogsDetailPage