import Button from './reusableComp/Button';
import { Link } from 'react-router-dom';

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

            <div className="flex flex-wrap gap-4 mb-6">

                <div className="relative">
                    <input type="text" placeholder="mm/dd/yyyy" className="bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite rounded-lg py-3 pl-5 pr-5 text-sm" />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <i className="ri-calendar-line"></i>
                    </div>
                </div>
            </div>
            <div className="w-full overflow-x-auto ">
                <table className="min-w-full text-sm">
                    <thead className="">
                        <tr className="text-left text-light text-sm border-b border-lightborder dark:border-inputborder">
                            {['Event Name', 'Date', 'Time', 'Category', 'Status', 'Actions'].map((header, i) => (
                                <th key={i} className="pb-3 px-4 font-medium whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, i) => (
                            <tr key={i} className="border-b border-info dark:border-inputborder hover:bg-foreground dark:hover:bg-[#2d2d2d]/40 transition">
                                <td className="py-4 px-4 min-w-[220px]">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded ${event.bgColor} flex items-center justify-center mr-3`}>
                                            <i className={`${event.icon} ${event.iconColor}`}></i>
                                        </div>
                                        <div className="w-full max-w-[160px]">
                                            <p className="font-medium truncate">{event.name}</p>
                                            <p className="text-sm text-light truncate">{event.dj}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-4 px-4 whitespace-nowrap">{event.date}</td>
                                <td className="py-4 px-4 whitespace-nowrap">{event.time}</td>

                                <td className="py-4 px-4">
                                    <span className="px-3 py-1 bg-opacity-30 text-xs rounded-full whitespace-nowrap" >
                                        {event.category}
                                    </span>
                                </td>

                                <td className="py-4 px-4">
                                    <span className="px-3 py-1 bg-success dark:bg-success/30 text-lightwhite dark:text-success rounded-full text-xs whitespace-nowrap">
                                        Upcoming
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
            </div>


            <div className="mt-6 flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center">
                <p className="text-sm text-light">Showing 1 to 3 of 48 entries</p>
                <div className="flex space-x-2">
                    <button className="h-9 w-9 flex items-center justify-center rounded-md cursor-pointer bg-light text-lightwhite dark:bg-[#252a3a] dark:text-light"><i className="ri-arrow-left-s-line"></i></button>
                    {[1, 2, 3].map((num) => (
                        <button key={num} className={`h-9 w-9 flex items-center rounded-md justify-center cursor-pointer ${num === 1 ? 'bg-primary text-lightwhite' : 'bg-light text-lightwhite dark:bg-[#252a3a] dark:text-light'}`}>{num}</button>
                    ))}
                    <button className="h-9 w-9 flex items-center justify-center rounded-md cursor-pointer bg-light text-lightwhite dark:bg-[#252a3a] dark:text-light"><i className="ri-arrow-right-s-line"></i></button>
                </div>
            </div>
        </div>
    );
};

export default UpcomingEvents;
