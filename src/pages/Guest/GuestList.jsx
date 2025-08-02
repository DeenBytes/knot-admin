import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/reusableComp/Pagination';
import { apiJsonAuth } from '../../api';
import Popup from '../../hooks/alert';
import { toast } from 'react-toastify';

const GuestList = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [guestListData, setGuestListData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [firstRender, setFirstRender] = useState(true);
    const [filter, setFilter] = useState({
        startDate: '',
        endDate: '',
    });

    //=================Function to fetch guest list data=================//
    const fetchGuestListData = async () => {
        try {
            setLoading(true);
            const res = await apiJsonAuth.get(`/api/Admin/adminGetGuestList?page=${page}&limit=${limit}&startDate=${filter.startDate}&endDate=${filter.endDate}`);
            if (res.data?.status === 1) {
                console.log("Data");
                setGuestListData(res.data.result);
                setTotalPages(res.data.totalPages);
                setLoading(false);
            }

        } catch (error) {
            console.log("Error", error);
            if (error?.status === 404) {
                setGuestListData([]);
                setTotalPages(0);
                setLoading(false);
            }
        }

    }
    useEffect(() => {
    if (firstRender) {
        fetchGuestListData();
        setFirstRender(false);
    } else {
        if (filter.startDate && filter.endDate) {
            fetchGuestListData();
        }
    }
}, [page, limit, filter.startDate, filter.endDate]);

//============ Function To Delete the  guest list Data ==============\\
const handleDelete = async (id) => {
    try {
        const result = await Popup("warning", "Are you sure?", "You won't be able to revert this!");

        if (result.isConfirmed) {
            const response = await apiJsonAuth.delete(`/api/Admin/adminDeleteGuestList/${id}`);
            if (response.data.status === 1) {
                toast.success(response.data.message);
                fetchGuestListData();
            } else {
                toast.error(response.data.message);
            }
        }
    } catch (error) {
        error?.response?.data?.message && toast.error(error?.response?.data?.message);
        if(error?.response?.status === 404){
            setGuestListData([]);
            setTotalPages(0);
            setLoading(false);
        }
    }
}

    return (
        <>
            <div className="mb-8">
                <div className="flex items-center text-sm text-light mb-2">
                    <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                    <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                    <span>Guest List</span>
                </div>
            </div>
            <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0 md:items-center ">
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <input type="date" name="startDate" className="bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite rounded-lg py-3 px-2 md:px-5 text-sm" value={filter.startDate} onChange={(e) => setFilter({ ...filter, startDate: e.target.value })} />
                        </div>
                        <span>to</span>
                        <div className="relative">
                            <input type="date" name='endDate' className="bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite rounded-lg py-3 px-2 md:px-5text-sm" value={filter.endDate} onChange={(e) => setFilter({ ...filter, endDate: e.target.value })} />
                        </div>
                    <span className="md:ml-4 flex items-center space-x-2 border border-lightborder dark:border-inputborder dark:bg-white/5 hover:bg-white/10 px-4 py-3 rounded-md text-sm whitespace-nowrap cursor-pointer" onClick={() => {setFilter({ startDate: '', endDate: '' })
                    setFirstRender(true)   
                }}>Clear</span>
                    </div>
                    <div className="md:ml-auto">
                        <button className="flex items-center space-x-2 border border-lightborder dark:border-inputborder dark:bg-white/5 hover:bg-white/10 px-4 py-2 rounded-md text-sm whitespace-nowrap cursor-pointer">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <i className="ri-download-2-line"></i>
                            </div>
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? <div className='flex justify-center items-center h-full m-auto '>
                <i className="ri-loader-2-line text-7xl animate-spin text-primary flex items-center justify-center"></i>
            </div> : <div className="rounded-lg w-full bg-white dark:bg-secondary border border-info dark:border-inputborder">
                <div className='overflow-x-auto'>
                    <table className="min-w-full text-sm ">
                        <thead className="pt-4 ">
                            <tr className="text-left text-primary dark:bg-transparent dark:text-light  text-sm border-b border-lightborder dark:border-inputborder">
                                {['OrderId', 'Full Name', 'Email', 'Phone', 'No. of Guests', 'Order Date', 'Actions'].map((header, i) => (
                                    <th key={i} className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {guestListData.length > 0 ? guestListData.map((guest, i) => (
                                <tr key={i} className="border-b border-info dark:border-inputborder hover:bg-foreground dark:hover:bg-[#2d2d2d]/40 transition">
                                    <td className="py-4 px-4 min-w-[220px]">
                                        <p className="font-medium truncate">{guest?.orderId}</p>
                                    </td>
                                    <td className="py-4 px-4 min-w-[220px]">
                                        <p className="font-medium truncate">{guest?.fullName}</p>
                                    </td>

                                    <td className="py-4 px-4 whitespace-nowrap">{guest?.email}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{guest?.phone}</td>
                                    <td className="py-4 px-4 text-center whitespace-nowrap">{guest?.no_of_Guests}</td>
                                    <td className="py-4 px-4 text-center whitespace-nowrap">{guest?.Date}</td>

                                    <td className="py-4 px-4">
                                        <div className="flex space-x-2 justify-end">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-[#8e8e8e] dark:bg-[#252a3a] text-info hover:text-error" onClick={() => handleDelete(guest?.id)}>
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : <tr className="border-b border-info dark:border-inputborder hover:bg-foreground dark:hover:bg-[#2d2d2d]/40 transition">
                                <td colSpan={100} className="py-4 px-4 text-center">
                                    <p className="font-medium">No Data Found</p>
                                </td>
                            </tr>}
                        </tbody>
                    </table>
                </div>

                <div className="p-4  flex flex-col md:flex-row gap-2 md:gap-0 justify-end items-center">
                    <Pagination totalPages={totalPages} currentPage={page} setCurrentPage={setPage} />
                </div>
            </div>}
        </>
    )
}

export default GuestList