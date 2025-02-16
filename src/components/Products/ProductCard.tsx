import React from 'react'
import Button from '../Shared/Button';
interface Product {
    id: number;
    img: string;
    title: string;
    price: string;
    // Thêm thuộc tính khác nếu cần
  }
  
  interface ProductCardProps {
    data: Product[];
  }
const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
    return (
        <div className='mb-10'>
            {/* card */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 place-items-center'>
                {
                    data.map((data) => (
                        <div className='group ' key={data.id}>
                            <div className='relative'>
                                <img src={data.img} alt="" className='h-[180px] w-[260px] object-cover rounded-md' />
                                {/* hover btn */}
                                <div className=' hidden  group-hover:flex absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-full w-full text-center group-hover:backdrop-blur-sm justify-center items-center duration-200'>
                                    <Button
                                    text ={ "Add to Cart"}
                                    bgColor = {"bg-primary"}
                                    textColor={'text-whtie'}/>
                                </div>
                            </div>
                            <div className='leading-7'>
                                <h2 className='font-semibold'>{data.title}</h2>
                                <h2 className='font-bold'>${data.price}</h2>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ProductCard