
import Heading from '../Shared/Heading';
import Img1 from "../../assets/Product/blog-1.jpg";
import Img2 from "../../assets/Product/blog-2.jpg";
import Img3 from "../../assets/Product/blog-3.jpg";
const BlogData = [
    {
        title: "How to choose perfect smartwatch",
        subtitle:
            "minima facere deserunt vero illo beatae deleniti eiusdolores consequuntur, eligendi corporis maiores molestiaelaudantium. Porro?",
        published: "Jan 20, 2024 by Dilshad",
        image: Img1,
    },
    {
        title: "How to choose perfect gadget",
        subtitle:
            "minima facere deserunt vero illo beatae deleniti eius.dolores consequuntur, eligendi corporis maiores molestiaelaudantium. Porro?",
        published: "Jan 20, 2024 by Satya",
        image: Img2,
    },
    {
        title: "How to choose perfect VR headset",
        subtitle:
            "minima facere deserunt vero illo beatae deleniti eius.dolores consequuntur, eligendi corporis maiores molestiaelaudantium. Porro?",
        published: "Jan 20, 2024 by Satya",
        image: Img3,
    }
]
const Blogs = () => {
    return (
        <div className='my-12'>
            <div className='container'>
                <Heading title="Recent News"
                    subtitle={"Explore Our Blogs"} />
                {/* Body */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-8 sm:gap-4 md:gap-7'>
                    {/* Blog Card */}
                    {
                        BlogData.map((data) => (
                            <div key={data.title} className='bg-white dark:bg-gray-900'>
                                {/* img section */}
                                <div className='overflow-hidden rounded-2xl mb'>
                                    <img src={data.image} alt="" 
                                    className='w-full h-[220px] object-cover rounded-2xl hover:scale-105 duration-500'/>
                                </div>
                                {/* content */}
                                <div className='space-y-2'>
                                    <p className='text-xs text-gray-500'>{data.published}</p>
                                    <p className='font-bold line-clamp-1'>{data.title}</p>
                                    <p className='line-clamp-2 text-sm text-gray dark:text-gray-400'>{data.subtitle}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

        </div>
    )
}

export default Blogs