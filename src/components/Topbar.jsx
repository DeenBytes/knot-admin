import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../redux/slices/authSlice';
import Button from './reusableComp/Button';
import { logoutUser } from '../redux/async/authAsync';
import useRoutes from '../hooks/useRoutes';

const Topbar = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openSubListId, setOpenSubListId] = useState(null);
    const { sidebarLink } = useRoutes();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state?.auth)
    const darkMode = useSelector((state) => state?.auth?.darkMode);
    const pathName = useLocation().pathname;
    return (
        <>
            {/* Header (Always Visible) */}
            <header className="fixed top-0 left-0 md:left-64 right-0 bg-foreground dark:bg-secondary border-b border-info dark:border-extralightgray z-50">
                <div className="flex justify-between items-center px-6 py-4">
                    {/* Logo (Mobile Only) */}
                    <div className="w-auto h-10 flex md:hidden items-center justify-center mr-3">
                        <img src="/Knot_Logo.png" alt="Knot Logo" className="w-full h-full object-contain" />
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent dark:bg-inputbg text-black dark:text-lightwhite pl-10 pr-4 py-2 rounded-full focus:outline-none border border-info dark:border-inputborder text-sm w-[200px]"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                            <i className="ri-search-line text-light"></i>
                        </div>
                    </div>

                    {/* Header Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Search */}
                        <div className="flex md:hidden items-center gap-4">
                            <div className="relative">
                                {!showSearch ? (
                                    <button onClick={() => setShowSearch(true)}>
                                        <i className="ri-search-line text-light"></i>
                                    </button>
                                ) : (
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Search..."
                                        className="px-3 py-1 rounded-md bg-transparent dark:bg-inputbg text-black dark:text-lightwhite border border-info dark:border-none focus:outline-none transition-all duration-300 w-48"
                                        onBlur={() => setShowSearch(false)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Notification */}
                        <button className="relative w-8 h-8 flex items-center justify-center text-light hover:text-primary">
                            <i className="ri-notification-3-line"></i>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />
                        </button>

                        {/* Desktop User Info */}
                        <div className="hidden md:flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-info dark:bg-inputbg flex items-center justify-center">
                                <span className="text-primary text-sm font-semibold">{user?.fullName?.charAt(0)}</span>
                            </div>
                            <span className="text-black dark:text-lightwhite">{user?.fullName}</span>
                        </div>


                        {/* Dark Mode Toggle */}
                        <button
                            className="text-light hover:text-primary cursor-pointer transition-all duration-300"
                            onClick={() => {
                                dispatch(toggleDarkMode());
                            }}
                        >
                            {darkMode ? <i className="ri-sun-fill"></i> : <i className="ri-moon-fill text-dark"></i>}
                        </button>
                        {/* Mobile Menu Toggle */}
                        <button
                            className="block md:hidden text-light hover:text-primary cursor-pointer transition-all duration-300"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <i className={isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}></i>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Slide-In Menu */}
            <div
                className={`fixed top-0 left-0 h-full w-64 max-w-[65vw] bg-foreground dark:bg-secondary border-r border-info dark:border-extralightgray z-40 md:hidden transform transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } pt-20 overflow-auto hide-scrollbar`} // pt-20 to push content below the header
            >
                <div className="p-6 space-y-6">
                    <ul className="space-y-2">
                        {sidebarLink?.map((item, i) => (
                            <React.Fragment key={i}>
                                {item.dock ? (
                                    // Regular docked item
                                    <li>
                                        <Link
                                            to={item.link}
                                            className={`flex items-center ${pathName === item?.link ? 'text-primary' : 'text-light'
                                                } p-2 rounded hover:bg-inputbg hover:text-primary transition-all duration-300`}
                                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        >
                                            <div className="w-6 h-6 flex items-center justify-center mr-3">
                                                <i className={`ri-${item.icon}`}></i>
                                            </div>
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ) : (
                                    // Toggleable menu item with subList
                                    <>
                                        <li>
                                            <button
                                                onClick={() =>
                                                    setOpenSubListId(openSubListId === item.id ? null : item.id)
                                                }
                                                className={`flex items-center justify-between w-full text-left p-2 rounded ${pathName.startsWith(item.link)
                                                    ? 'text-primary'
                                                    : 'text-light'
                                                    } hover:bg-inputbg hover:text-primary transition-all duration-300`}
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-6 h-6 flex items-center justify-center mr-3">
                                                        <i className={`ri-${item.icon}`}></i>
                                                    </div>
                                                    <span>{item.label}</span>
                                                </div>
                                                <i
                                                    className={`ri-${openSubListId === item.id
                                                        ? 'arrow-up-s-line'
                                                        : 'arrow-down-s-line'
                                                        } text-lg`}
                                                ></i>
                                            </button>
                                        </li>

                                        {openSubListId === item.id &&
                                            item.subList?.map((subItem, idx) => (
                                                <li key={idx} className="ml-8">
                                                    <Link
                                                        to={subItem.path}
                                                        className={`flex items-center ${pathName === subItem.path ? 'text-primary' : 'text-light'
                                                            } p-2 rounded hover:bg-inputbg hover:text-primary transition-all duration-300`}
                                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                                    >
                                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                                            <i className={`ri-${subItem.icon}`}></i>
                                                        </div>
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </ul>

                </div>
                <div className="flex flex-col px-8 space-y-4 border-t border-info dark:border-extralightgray pt-3">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-info dark:bg-inputbg flex items-center justify-center">
                            <span className="text-primary text-sm font-semibold">{user?.fullName?.charAt(0)}</span>
                        </div>
                        <span className="text-black dark:text-lightwhite">{user?.fullName}</span>
                    </div>
                    <Button variant='outline' className='cursor-pointer mb-6' onClick={() => dispatch(logoutUser())}><i className="ri-logout-circle-r-line mr-2"></i> Log Out</Button>
                </div>
            </div>
        </>

    );
};

export default Topbar;
