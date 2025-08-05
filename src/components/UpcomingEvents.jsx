import { useDispatch, useSelector } from 'react-redux';
import Button from './reusableComp/Button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchEvents } from '../redux/async/eventAsync';
import Pagination from './reusableComp/Pagination';

const events = [
    {
        name: 'Neon Nights',
        dj: 'DJ Akshay',
        date: 'June 21, 2025',
        time: '10:00 PM',
        category: 'Music Night',
        icon: 'ri-music-2-fill',
        iconColor: 'text-blue-400',
        bgColor: 'bg-blue-900',
    },
    {
        name: 'Retro Revival',
        dj: 'DJ Sarah',
        date: 'June 28, 2025',
        time: '9:30 PM',
        category: 'Theme Party',
        icon: 'ri-disco-ball-fill',
        iconColor: 'text-purple-400',
        bgColor: 'bg-purple-900',
    },
    {
        name: 'International DJ Night',
        dj: 'Marco Carola',
        date: 'July 5, 2025',
        time: '10:30 PM',
        category: 'Special Event',
        icon: 'ri-global-fill',
        iconColor: 'text-amber-400',
        bgColor: 'bg-amber-900',
    },
];

const UpcomingEvents = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const { events, totalPages, loading, } = useSelector((state) => state.event);

    useEffect(() => {
        dispatch(fetchEvents({ page: currentPage, name: "" }));
    }, [dispatch]);

    return (
        <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
            <div className="flex flex-row gap-2 md:gap-0 justify-between items-center mb-6">
                <h3 className="text-xl text-black dark:text-lightwhite font-medium">Upcoming Events</h3>
                <Button variant='primary' className="text-background cursor-pointer flex items-center whitespace-nowrap">
                    <Link to="/events/add-event" className="flex items-center">
                        <i className="ri-add-line mr-2"></i> Add Event
                    </Link>
                </Button>
            </div>

            {loading ? <div className='flex justify-center items-center h-full m-auto '>
                <i className="ri-loader-2-line text-7xl animate-spin text-primary flex items-center justify-center"></i>
            </div> : <div className="w-full overflow-x-auto mt-4">
                <table className="min-w-full text-sm">
                    <thead className="">
                        <tr className="text-left text-light text-sm border-b border-lightborder dark:border-inputborder">
                            {['Event Name', 'Date', 'Time', 'Description', 'Status', 'Actions'].map((header, i) => (
                                <th key={i} className="pb-3 px-4 font-medium whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, i) => (
                            <tr key={i} className="border-b border-info dark:border-inputborder hover:bg-foreground dark:hover:bg-[#2d2d2d]/40 transition">

                                <td className="py-4 px-4 min-w-[250px]">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border">
                                            <img src={event?.theme_Image} alt={event?.theme_Name} className="w-full h-full object-cover" />
                                        </div>


                                        <div className="ml-2">
                                            <p className="font-medium truncate">{event?.theme_Name}</p>
                                            <p className="text-sm text-light truncate">{event?.djName}</p>
                                        </div>
                                    </div>
                                </td>


                                <td className="py-4 px-4 whitespace-nowrap">{event.date}</td>
                                <td className="py-4 px-4 whitespace-nowrap">{`${event.startTime} - ${event.endTime}`}</td>

                                <td className="py-4 px-4">
                                    <span className="px-3 py-1 bg-opacity-30 text-xs rounded-full whitespace-nowrap" >
                                        {event?.description}
                                    </span>
                                </td>

                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 ${event.status === "Upcoming" ? "bg-success text-lightwhite dark:bg-success/30 dark:text-success" : "bg-error text-lightwhite dark:bg-error/30 dark:text-error"} rounded-full text-xs whitespace-nowrap`}>
                                        {event.status}
                                    </span>
                                </td>

                                <td className="py-4 px-4">
                                    <div className="flex space-x-2">
                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-light dark:bg-[#252a3a] text-info hover:text-warning">
                                            <i className="ri-edit-line"></i>
                                        </button>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-light dark:bg-[#252a3a] text-info hover:text-red-400">
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}


            {/* Pagination */}
            {totalPages > 0 && (<div className="p-4 flex gap-2 md:gap-0 justify-end items-center mt-2">
                <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>)}
        </div>
    );
};

export default UpcomingEvents;
