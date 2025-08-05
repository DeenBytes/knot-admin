import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { apiJsonAuth } from "../../api";
import Pagination from "../../components/reusableComp/Pagination";
import { toast } from "react-toastify";
import Popup from "../../hooks/alert";

const ContactUs = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [contactUsers, setContactUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  //=================Function to fetch contact us list data=================//
  const contactUsList = async () => {
    try {
      setLoading(true);
      const res = await apiJsonAuth.get(`api/Admin/adminContectUsList?page=${page}&limit=${limit}`);
      if (res.data?.status === 1) {
        setContactUsers(res.data.result);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      }

    } catch (error) {
      console.log("Error", error);
      if (error?.status === 404) {
        setContactUsers([]);
        setTotalPages(0);
        setLoading(false);
      }
    }

  }
  useEffect(() => {
    contactUsList();
  }, [page, limit]);

  //============ Function To Delete the  contact-us user ==============\\
  const handleDelete = async (id) => {
    try {
      const result = await Popup("warning", "Are you sure?", "You won't be able to revert this!");

      if (result.isConfirmed) {
        const response = await apiJsonAuth.delete(`/api/Admin/adminDeleteContectUs/${id}`);
        if (response.data.status === 1) {
          toast.success(response.data.message);
          contactUsList();
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      error?.response?.data?.message && toast.error(error?.response?.data?.message);
      if (error?.response?.status === 404) {
        setContactUsers([]);
        setTotalPages(0);
        setLoading(false);
      }
    }
  }
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center text-sm text-light">
          <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
          <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
          <span>Contact Us user</span>
        </div>
      </div>
      {loading ? <div className='flex justify-center items-center h-full m-auto '>
        <i className="ri-loader-2-line text-7xl animate-spin text-primary flex items-center justify-center"></i>
      </div> : <div className="rounded-lg w-full bg-white dark:bg-secondary border border-info dark:border-inputborder">
        <div className='overflow-x-auto'>
          <table className="min-w-full text-sm ">
            <thead className="pt-4 ">
              <tr className="text-left text-primary dark:bg-transparent dark:text-light  text-sm border-b border-lightborder dark:border-inputborder">
                {['Sr. No.', 'Full Name', 'Email', 'Subject', 'Message', 'Date', 'Actions'].map((header, i) => (
                  <th key={i} className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contactUsers.length > 0 ? contactUsers.map((sub, i) => (
                <tr key={i} className="border-b border-info dark:border-inputborder hover:bg-foreground dark:hover:bg-[#2d2d2d]/40 transition">
                  <td className="font-medium truncate text-center py-4 px-4 min-w-[120px]">
                    {(page - 1) * limit + i + 1}
                  </td>
                  <td className="py-4 px-4 min-w-[220px]">
                    <p className="font-medium truncate">{sub?.fullName}</p>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">{sub?.email}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{sub?.subject}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{sub?.message}</td>

                  <td className="py-4 px-4 text-center whitespace-nowrap">{new Date(sub?.createdAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "numeric",
                  })}</td>

                  <td className="py-4 px-4">
                    <div className="flex space-x-2 justify-end">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-[#8e8e8e] dark:bg-[#252a3a] text-info hover:text-error" onClick={() => handleDelete(sub?.id)}>
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

        <div className="p-4  flex  gap-2 md:gap-0 justify-end items-center">
          <Pagination totalPages={totalPages} currentPage={page} setCurrentPage={setPage} />
        </div>
      </div>}
    </>
  )
}


export default ContactUs