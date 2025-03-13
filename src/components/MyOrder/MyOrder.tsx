import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import "./MyOrder.css";


interface Order {
    orderID: number;
    product: string;
    status: string;
    date: string;
}


const fakeOrders: Order[] = [
    { orderID: 101, product: "Laptop", status: "Delivered", date: "2025-03-12" },
    { orderID: 102, product: "Headphones", status: "Pending", date: "2025-03-10" },
    { orderID: 103, product: "T-shirt", status: "Shipped", date: "2025-03-11" },
];

const MyOrder = () => {
    const [, setSearchTerm] = useState<string>("");
    const [orders, setOrders] = useState<Order[]>(fakeOrders);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = fakeOrders.filter((order) =>
            order.product.toLowerCase().includes(term)
        );
        setOrders(filtered);
    };

    return (
        <motion.div className="order-table-container bg-white dark:bg-gray-700 dark:text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="order-table-header">
                <h2 className="font-semibold">My Orders</h2>
                <div className="search-box">
                    <input type="text" placeholder="Search orders..." onChange={handleSearch} />
                    <Search className="search-icon" size={18} />
                </div>
            </div>
            <table className="order-table">
                <thead>
                    <tr className="dark:bg-zinc-700 dark:text-black">
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderID}>
                            <td>{order.orderID}</td>
                            <td>{order.product}</td>
                            <td>{order.status}</td>
                            <td>{order.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    );
};

export default MyOrder;
