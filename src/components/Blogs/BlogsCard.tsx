import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { bBlogs } from "../../interfaces";
import { getBlogs } from "../../apiServices/BlogsServices/BlogsServices";

const BlogsCard: React.FC = () => {
    const [allBlogs, setAllBlogs] = useState<bBlogs[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getBlogs();
            if (result && result.$values) {
                setAllBlogs(result.$values);
            } else {
                console.error("Data not found or invalid response structure");
            }
        };
        fetchData();
    }, []);

    return (
        <div className='my-12'>
            <div className='container'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-8 sm:gap-4 md:gap-7'>
                    {allBlogs.map((blogs) => (
                        <div key={blogs.blogID} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
                            <Link to="/Blogs/detail" state={blogs}>
                                <div className="overflow-hidden rounded-2xl mb-4">
                                    <img
                                       src={blogs.blogImages?.$values?.[0]?.imageUrl}
                                        alt={blogs.title}
                                        className="w-full h-[220px] object-cover rounded-2xl hover:scale-105 duration-500"
                                    />
                                </div>
                            </Link>
                            <p className="text-xs text-gray-500">{blogs.uploadDate}</p>
                            <p className="font-bold line-clamp-1">{blogs.title}</p>
                            <p className="line-clamp-2 text-sm text-gray dark:text-gray-400">{blogs.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogsCard;
