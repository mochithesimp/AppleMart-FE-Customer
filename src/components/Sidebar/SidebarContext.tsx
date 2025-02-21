import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextProps {
    openSidebar: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [openSidebar, setOpenSidebar] = useState(false);
    const toggleSidebar = () => setOpenSidebar(!openSidebar);

    return (
        <SidebarContext.Provider value={{ openSidebar, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};
