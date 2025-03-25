import { Link, useLocation } from "react-router-dom";

interface BlogData2 {
  title: string;
  subtitle: string;
  published: string;
  image: string;
}

const BlogDetail: React.FC = () => {
  const location = useLocation();
  const blogData = location.state as BlogData2;

  if (!blogData) {
    return <div className="text-center text-gray-500">No blog data found.</div>;
  }

  return (
    
    <div className="container mx-auto my-12 p-6 max-w-3xl bg-white dark:bg-gray-900 shadow-lg rounded-2xl">
        
      <div className="overflow-hidden rounded-2xl mb-6">
        <img
          src={blogData.image}
          alt={blogData.title}
          className="w-full h-[300px] object-cover rounded-2xl"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{blogData.title}</h1>
      <p className="text-xs text-gray-500 mt-2">{blogData.published}</p>
      
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">{blogData.subtitle}</p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
        Sed cursus ante dapibus diam. Duis sagittis ipsum. Curabitur sodales ligula in libero.
      </p>

      <Link to="/Blogs" className="text-blue-500 mt-6 inline-block hover:underline">
        ← Back to Blogs
      </Link>
    </div>
  );
};

export default BlogDetail;
