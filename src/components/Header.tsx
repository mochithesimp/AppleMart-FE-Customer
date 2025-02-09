import React from 'react';

const Header: React.FC = () => {
    return (
        <div className="px-6 py-4 bg-white border-b">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Customers' List</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span>Customers' List</span>
                    </div>
                </div>
                <button className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
                    + NEW CUSTOMER
                </button>
            </div>
        </div>
    );
};

export default Header;