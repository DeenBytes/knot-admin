import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './reusableComp/Button';
import { logoutUser } from '../redux/async/authAsync';
import { useDispatch } from 'react-redux';
import useRoutes from '../hooks/useRoutes';


const Sidebar = () => {
    const dispatch = useDispatch()
    const { sidebarLink } = useRoutes();
    const [isExpanded, setIsExpanded] = useState(true);
    const [openSubListId, setOpenSubListId] = useState(null);
    const pathName = useLocation().pathname;
    return (
        <>
            <aside className={`fixed hidden md:block  left-0 top-0 min-h-screen ${isExpanded ? 'w-64' : 'w-16'} bg-foreground dark:bg-secondary border-r border-info dark:border-extralightgray z-50`}>
                <div className="p-4 border-b border-info dark:border-extralightgray">

                    <div className="w-auto h-12 flex items-center justify-center mr-3">
                        <img src="/Knot_Logo.png" alt="Knot Logo" className="w-full h-full object-contain" />
                    </div>
                </div>
                <div className="overflow-scroll h-screen hide-scrollbar">
                    <nav className="p-4">
                        <ul className="space-y-2">
                            {sidebarLink?.map((item, i) => (
                                <React.Fragment key={i}>
                                    {item.dock ? (
                                        // Regular docked item
                                        <li>
                                            <Link
                                                to={item.link}
                                                onClick={() => setOpenSubListId(null)}
                                                className={`flex items-center ${pathName === item?.link ? 'text-primary' : 'text-light'
                                                    } p-2 rounded hover:bg-inputbg hover:text-primary transition-all duration-300`}
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


                    </nav>
                    <div className='relative bottom-4 p-6 mb-8'>
                        <Button variant='outline' className='cursor-pointer' onClick={() => dispatch(logoutUser())}><i className="ri-logout-circle-r-line mr-2"></i>Log Out</Button>
                    </div>   
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
