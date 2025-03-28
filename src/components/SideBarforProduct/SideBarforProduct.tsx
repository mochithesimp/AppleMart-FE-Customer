import SidebarToggle from "../Sidebar/SidebarToggle";
import SidebarP from "../Sidebar/SidebarP";
import { SidebarProvider } from "../Sidebar/SidebarContext";
import useProductFilter from "../ProductsSection/useProductFilter";
import { ProductItem } from "../../interfaces";

const SideBarforProduct: React.FC<{
  productFilter: ReturnType<typeof useProductFilter>;
  productItems: ProductItem[];
}> = ({ productFilter, productItems }) => {
  return (
    <SidebarProvider>
      <SidebarToggle />
      <SidebarP productFilter={productFilter}
      productItems={productItems} />
    </SidebarProvider>
  );
};

export default SideBarforProduct;
