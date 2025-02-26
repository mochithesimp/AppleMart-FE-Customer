import SidebarToggle from "../Sidebar/SidebarToggle";
import SidebarP from "../Sidebar/SidebarP";
import { SidebarProvider } from "../Sidebar/SidebarContext";

const SideBarforProduct: React.FC = () => {
  return (
    <SidebarProvider>
      <SidebarToggle />
      <SidebarP />
    </SidebarProvider>
  );
};

export default SideBarforProduct;
