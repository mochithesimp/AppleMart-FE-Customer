import NavbarforP from "../../components/NavbarProduct/NavbarforP";
import Footer from "../../components/Footer/Footer";
import SideBarforProduct from "../../components/SideBarforProduct/SideBarforProduct";
// import ProductSection from "../../components/ProductsSection/ProductsSection";
import React from "react";
const ProductSection = React.lazy(() => import('../../components/ProductsSection/ProductsSection'));

const ProductMenu = () => {
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <NavbarforP />

      {/* Main content */}
      <div className="flex flex-grow bg-gray-100 mt-16 ">
        {/* Sidebar (chiếm 1/4 màn hình) */}
        <div className="dark:bg-gray-900 w-1/5 bg-white shadow-lg p-4 relative ">
          <SideBarforProduct />
        </div>

        {/* Product List (chiếm 3/4 màn hình) */}
        <div className=" dark:bg-gray-900 w-4/5 p-6">
          <ProductSection />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductMenu;
