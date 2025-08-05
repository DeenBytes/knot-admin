import React, { useEffect, useState } from 'react';
import Button from '../../components/reusableComp/Button';
import CustomSelect from '../../components/reusableComp/CustomSelect';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../components/reusableComp/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEvent, fetchEvents } from '../../redux/async/eventAsync';
import Popup from '../../hooks/alert';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const statusOptions = ['Upcoming', 'Completed', 'Cancelled'];

const Events = () => {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10; 
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { events, totalPages, loading, } = useSelector((state) => state.event);

    useEffect(() => {
        dispatch(fetchEvents({ page: currentPage, name: "" }));
    }, [dispatch]);

    const handleDelete = async (id) => {
        const result = await Popup("warning", "Are you sure?", "You won't be able to revert this!");
        if (result.isConfirmed) {
            try {
                const response = await dispatch(deleteEvent(id));

                if (deleteEvent.fulfilled.match(response)) {

                    toast.success(response.payload.message || 'Event deleted successfully');
                    // dispatch(fetchEvents({ page: currentPage, name: "" }));
                } else {
                    // This is still considered "successful" from a JS point of view, but rejected by thunk
                    toast.error(response.payload?.message || 'Failed to delete the event');
                }
            } catch (error) {
                console.log("error", error);

                // This block runs only if dispatch itself throws, which is rare
                toast.error(error?.response?.data?.message || 'Something went wrong');
            }
        }
    };



    return (
        <>
            <div className="mb-8">
                <div className="flex items-center text-sm text-light mb-2">
                    <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                    <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                    <span>Upcoming Events</span>
                </div>
            </div>
            <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0 md:items-center ">
                    <div className="flex flex-wrap gap-4">
                        <div className="relative">
                            <CustomSelect
                                options={statusOptions}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                placeholder="Select Status"
                            />
                        </div>
                        <div className="relative">
                            <input type="date" className="bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite rounded-lg py-3 pl-5 pr-5 text-sm" />
                        </div>
                    </div>
                    <Link to="/events/add-event">
                        <Button variant='primary' className="text-background cursor-pointer flex items-center justify-center whitespace-nowrap">
                            <i className="ri-add-line mr-2"></i> Add Event
                        </Button>
                    </Link>
                </div>
            </div>

            {loading ? <div className='flex justify-center items-center h-full m-auto '>
                <i className="ri-loader-2-line text-7xl animate-spin text-primary flex items-center justify-center"></i>
            </div>  : <div className="rounded-lg w-full bg-white dark:bg-secondary border border-info dark:border-inputborder">
                {events.length > 0 ? (<div className='overflow-x-auto'>
                    <table className="min-w-full text-sm ">
                        <thead className="pt-4 ">
                            <tr className="text-left text-primary dark:bg-transparent dark:text-light  text-sm border-b border-lightborder dark:border-inputborder">
                                {['Sr. No.', 'Event Name', 'Discription', 'Date', 'Start Time', 'End Time', 'Status', 'Actions'].map((header, i) => (
                                    <th key={i} className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {events?.map((event, i) => (
                                <tr key={i} className="border-b border-info dark:border-inputborder hover:bg-foreground dark:hover:bg-[#2d2d2d]/40 transition">
                                     <td className="py-4 px-4 min-w-[120px] text-center">
                                        {(currentPage - 1) * limit + i + 1}
                                    </td>
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
                                    <td className="py-4 px-4 whitespace-normal">
                                        {event?.description}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">{event?.date}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{event?.startTime}</td>

                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 bg-opacity-30  rounded-full whitespace-nowrap" >
                                            {event.endTime}
                                        </span>
                                    </td>

                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 ${event.status==="Upcoming" ? "bg-success text-lightwhite dark:bg-success/30 dark:text-success" : "bg-error text-lightwhite dark:bg-error/30 dark:text-error"} rounded-full text-xs whitespace-nowrap`}>
                                            {event.status}
                                        </span>
                                    </td>

                                    <td className="py-4 px-4">
                                        <div className="flex space-x-2">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-[#8e8e8e] dark:bg-[#252a3a] text-info hover:text-warning" onClick={() => navigate(`/events/edit-event/${event.id}`)}>
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button onClick={() => handleDelete(event.id)} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-[#8e8e8e] dark:bg-[#252a3a] text-info hover:text-error">
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>) : (
                    <div className="text-center py-4">
                        <p className="text-sm text-light">No events found.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 0 && (<div className="p-4  flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center">
                    <p className="text-sm text-light">Showing 1 to 10 of 48 entries</p>
                    <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>)}
            </div>}
        </>
    )
}

export default Events