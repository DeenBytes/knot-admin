import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import useRoutes from "./hooks/useRoutes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // import useSelector

const Layout = ({ children }) => {
    const { user } = useSelector(state => state.auth); // get user from Redux
    const currentPath = useLocation().pathname;
    const { publicRoutes } = useRoutes();
    const [shouldShowLayout, setShouldShowLayout] = useState(true);

    useEffect(() => {
        const isPublicRoute = publicRoutes.some(
            (route) => route.path === currentPath
        );
        setShouldShowLayout(!isPublicRoute);
    }, [currentPath, publicRoutes]);

    // Render layout only if user exists and current route is not public
    if (!user || !shouldShowLayout) return <>{children}</>;

    return (
        <div className="flex">
            <div>
                <Sidebar />
            </div>
            <div className="flex-1 bg-foreground dark:bg-background w-full">
                <Topbar />
                {/* Main content area */}
                <div className="min-h-screen relative px-4 md:px-8 py-8 ml-0 md:ml-64 mt-16 bg-[#F9F9F9] dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-500">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
