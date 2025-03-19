import SidebarToggle from "../Sidebar/SidebarToggle";
import SidebarP from "../Sidebar/SidebarP";
import { SidebarProvider } from "../Sidebar/SidebarContext";
import useProductFilter from "../ProductsSection/useProductFilter";

const SideBarforProduct: React.FC<{ productFilter: ReturnType<typeof useProductFilter> }> = ({ productFilter }) => {
  return (
    <SidebarProvider>
      <SidebarToggle />
      <SidebarP productFilter={productFilter} />
    </SidebarProvider>
  );
};

export default SideBarforProduct;
