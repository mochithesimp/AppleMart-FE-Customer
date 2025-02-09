// src/App.tsx
import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CustomerTable from './components/CustomerTable';
import Pagination from './components/Pagination';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { Customer } from './types/types';

const App: React.FC = () => {
  const [customers] = useState<Customer[]>([
    {
      id: 1,
      fullName: "Vu Le",
      status: "Approved",
      email: "vule@gmail.com",
      dateOfBirth: "11/29/2003"
    },

  ]);

  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    // Implement search functionality
    console.log('Searching for:', value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <TopBar />
        <div className="pt-16">
          <Header />
          <SearchBar onSearch={handleSearch} />
          <div className="px-6">
            <CustomerTable customers={customers} />
            <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;