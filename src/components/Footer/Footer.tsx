
import { FaLocationArrow, FaMobileAlt } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa6';

const FooterLinks = [
    {
        title: "Home",
        link: "/#",
    },
    {
        title: "About",
        link: "/#about",
    },
    {
        title: "Contact",
        link: "/#contact",
    },
    {
        title: "Blog",
        link: "/#blog",
    },
];


const Footer = () => {
    return (
        <div className='dark:bg-gray-950'>
            <div className="container ">
                <div className="grid md:grid-cols-3 pb-20 pt-5">
                    {/* Company Details */}
                    <div className='py-8 px-4'>
                        <a href="#" className=' text-primary font-semibold tracking-widest text-2xl uppercase sm:text 3xl ' >
                            AppleMart
                        </a>
                        <p className='text-gray-600 dark:text-white/70 lx:pr-24 pt-3'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium voluptatem quidem non quae dicta.
                        </p>
                        <p className='text-gray-500 mt-4'>Software Design</p>
                        <a
                            href="https://www.facebook.com/tantai.chiem.1"
                            target="_blank"
                            className="inline-block bg-primary/90 text-white
                            py-2 px-4 mt-4 text-sm rounded-full"
                        >Visit leader's facebook
                        </a>
                    </div>
                    {/* Footer Link */}
                    <div className='col-span-2 grid gird-cols-2 sm:grid-cols-3 md:pl-10'>
                        <div className='py-8 px-4'>
                            <h1 className='text-xl font-bold sm:text-left mb-3'>Important Links</h1>
                            <ul className='space-y-3'>
                                {
                                    FooterLinks.map((data, index) => (
                                        <li key={index}>
                                            <a
                                                href={data.link}
                                                className="text-gray-600 hover:dark:text-white hover:text-black dark:text-gray-400 duration-300">
                                                {data.title}
                                            </a>

                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        {/* 2nd col */}
                        <div className='py-8 px-4'>
                            <h1 className='text-xl font-bold sm:text-left mb-3'>Quick Links</h1>
                            <ul className='space-y-3'>
                                {
                                    FooterLinks.map((data, index) => (
                                        <li key={index}>
                                            <a
                                                href={data.link}
                                                className="text-gray-600 hover:dark:text-white hover:text-black dark:text-gray-400 duration-300">
                                                {data.title}
                                            </a>

                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        {/*Adress  */}
                        <div className='py-8 px-4 col-span-2 sm:col-auto'>
                            <h1 className='text-xl font-bold sm:text-left mb-3'>Address Links</h1>
                            <div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <FaLocationArrow />
                                        <p>32 Nguyen Thi Thap Street, 7th District, HCM city</p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-6">
                                        <FaMobileAlt />
                                        <p>+84 833280889</p>
                                    </div>
                                    {/* social */}
                                    <div className='flex items-center gap-3 mt-6'>
                                        <a href="#">
                                            <FaInstagram className='text-3xl hover:text-primary duration-300'/>
                                        </a>
                                        <a href="#">
                                            <FaFacebook className='text-3xl hover:text-primary duration-200'/>
                                        </a>
                                        <a href="#">
                                            <FaLinkedin className='text-3xl hover:text-primary duration-200'/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Footer