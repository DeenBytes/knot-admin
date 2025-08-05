import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Pagination from '../../components/reusableComp/Pagination'
import Button from '../../components/reusableComp/Button'
import { apiJsonAuth } from '../../api'
import Popup from '../../hooks/alert'
import { toast } from 'react-toastify'

const Review = () => {
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [reviewData, setReviewData] = useState([])

    const navigate = useNavigate();

    //========= Function to get the review data =============\\
    const fetchReviewData = async () => {
        try {
            setLoading(true);
            const res = await apiJsonAuth.get(`/api/Admin/adminGetAllReview?page=${page}&limit=${limit}`);
            if (res.data?.status === 1) {
                setReviewData(res.data.result);
                setTotalPages(res.data.totalPages);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error", error);
            if (error?.status === 404) {
                setReviewData([]);
                setTotalPages(0);
                return
            }
            if (error?.response?.status === 400) {
                setReviewData([]);
                setTotalPages(0);
            }
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchReviewData();
    }, [page, limit]);

    //============ function to delete the review data ===========\\
    const handleDelete = async (id) => {
        try {
            const result = await Popup("warning", "Are you sure?", "You won't be able to revert this!");
            if (result.isConfirmed) {
                const response = await apiJsonAuth.delete(`/api/Admin/adminDeleteReview/${id}`);
                console.log(response);
                if (response.status === 200) {
                    toast.success(response.data.message);
                    fetchReviewData();
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            error?.response?.data?.message && toast.error(error?.response?.data?.message);
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center text-sm text-light">
                    <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                    <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                    <span>Review</span>
                </div>
                <Link to="/website/reviews/add-review" className="hover:text-primary">
                    <Button variant="primary" className="cursor-pointer" >
                        <i className="ri-add-line mr-2"></i> Add Review
                    </Button>
                </Link>
            </div>
            {loading ? <div className='flex justify-center items-center h-full m-auto '>
                <i className="ri-loader-2-line text-7xl animate-spin text-primary flex items-center justify-center"></i>
            </div> : <div className="rounded-lg w-full bg-white dark:bg-secondary border border-info dark:border-inputborder">
                <div className='overflow-x-auto'>
                    <table className="min-w-full text-sm ">
                        <thead className="pt-4 ">
                            <tr className="text-left text-primary dark:bg-transparent dark:text-light  text-sm border-b border-lightborder dark:border-inputborder">
                                {['Sr. No.', 'User Name', 'Rating', 'Description', 'Actions'].map((header, i) => (
                                    <th key={i} className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reviewData.length > 0 ? reviewData.map((review, i) => (
                                <tr key={i} className="border-b border-info dark:border-inputborder hover:bg-foreground dark:hover:bg-[#2d2d2d]/40 transition">
                                    <td className="">
                                        <p className="font-medium truncate text-center">{(page - 1) * limit + i + 1}</p>
                                    </td>
                                    <td className="py-4 px-4 min-w-[220px]">
                                        <p className="font-medium truncate">{review?.userName}</p>
                                    </td>
                                    <td className="py-4 px-4 min-w-[220px]">
                                        <p className="font-medium truncate">{review?.rating}</p>
                                    </td>

                                    <td className="py-4 px-4 whitespace-nowrap">{review?.description}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex space-x-2 justify-end">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-[#8e8e8e] dark:bg-[#252a3a] text-info hover:text-warning" onClick={() => navigate(`/website/reviews/edit-review/${review.id}`)}>
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-[#8e8e8e] dark:bg-[#252a3a] text-info hover:text-error" onClick={() => handleDelete(review?.id)}>
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

export default Review