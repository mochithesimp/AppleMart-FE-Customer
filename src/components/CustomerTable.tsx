import React from 'react';
import { Customer } from '../types/types';
import { ChevronDown, Eye, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface CustomerTableProps {
    customers: Customer[];
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers }) => {
    return (
        <div className="bg-white rounded-lg shadow">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">#</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            <div className="flex items-center gap-2">
                                Full Name <ChevronDown size={16} />
                            </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">E-Mail</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date of Birth</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id} className="border-b">
                            <td className="px-6 py-4 text-sm text-gray-500">{customer.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{customer.fullName}</td>
                            <td className="px-6 py-4">
                                <StatusBadge status={customer.status} />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{customer.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{customer.dateOfBirth}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <Eye size={16} className="text-gray-500" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <Pencil size={16} className="text-gray-500" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <Trash2 size={16} className="text-gray-500" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerTable;