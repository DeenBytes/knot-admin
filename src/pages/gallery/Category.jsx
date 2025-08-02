import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Button from '../../components/reusableComp/Button';
import Pagination from '../../components/reusableComp/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../components/reusableComp/Input';
import { addCategory, deleteCategory, fetchCategory, updateCategory } from '../../redux/async/galleryAsync';
import { toast } from 'react-toastify';
import Popup from '../../hooks/alert';
import { apiJsonAuth } from '../../api';

const Category = () => {
    const { catTotalPages, categories, catLoading } = useSelector((state) => state?.gallery);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(3);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    //============== Function to reset the form =========== \\
    const resetForm = () => {
        setOpenModal(false)
        setEditMode(false);
        setEditId(null);
        setCategoryName('');
    }

    useEffect(() => {
        let data = {
            page: currentPage,
            limit: limit
        }
        dispatch(fetchCategory(data));
    }, [currentPage,limit])
    // ============ function to add the new category ========= ==\\
    const handleSumit = async (e) => {
        e.preventDefault();
        const trimmedCategory = categoryName.trim();
        if (trimmedCategory === '') {
            setError('Category name is required');
            return;
        }

        if (trimmedCategory.length <= 5) {
            setError('Category name must be at least 5 characters long');
            return;
        }
        let data = {
            categoryName: trimmedCategory
        }
        const result = await dispatch(addCategory(data));

        if (addCategory.fulfilled.match(result)) {
            toast.success(result.payload.message || 'Category added successfully');
            setOpenModal(false);
            setCurrentPage(1); // Reset to page 1 after new addition
            dispatch(fetchCategory({ page: 1, limit }));
            setCategoryName('');
        } else {
            toast.error(result.payload.message || 'Something went wrong');
        }
    };
    //=============== Function to get one details of the category =========== \\
    const getOneDetails = async (id) => {
        try {
            const result = await apiJsonAuth.get(`/api/Admin/adminGetCategoryById/${id}`);
            if (result.status === 200) {
                const { categoryName } = result.data.result;
                setCategoryName(categoryName);
                setEditMode(true);
                setEditId(id);
                setOpenModal(true);
            }
        } catch (error) {
            console.log(error.response.data.message);
        }

    };
    //=============== Function to update the category =========== \\
    const handleUpdata = async (e) => {
        e.preventDefault();
        const trimmedCategory = categoryName.trim();

        if (trimmedCategory === '') {
            setError('Category name is requireṣd');
            return;
        }

        if (trimmedCategory.length <= 5) {
            setError('Category name must be at least 5 characters long');
            return;
        }
        let data = {
            categoryName: trimmedCategory,
            id: editId
        }
        const result = await dispatch(updateCategory(data));
        if (updateCategory.fulfilled.match(result)) {
            toast.success(result.payload.message || 'Category updated successfully');
            setOpenModal(false);
            setCurrentPage(1); // Reset to page 1 after new addition
            dispatch(fetchCategory({ page: 1, limit }));
            setCategoryName('');
        } else {
            toast.error(result.payload.message || 'Something went wrong');
        }
    }

    //============== Function to delete the category =========== \\
    const handleDelete = async (id) => {
        const result = await Popup("warning", "Are you sure?", "You won't be able to revert this!");
        if (result.isConfirmed) {
            try {
                const response = await dispatch(deleteCategory(id));

                if (deleteCategory.fulfilled.match(response)) {
                    toast.success(response.payload.message || 'Category deleted successfully');
                    setCurrentPage(1); // Reset to page 1 after deletion
                    dispatch(fetchCategory({ page: 1, limit }));
                } else {
                    // This is still considered "successful" from a JS point of view, but rejected by thunk
                    toast.error(response.payload?.message || 'Failed to delete the category');
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Something went wrong');
            }
        }

    }



    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center text-sm text-light">
                    <Link to="/gallery" className="hover:text-primary">Gallery</Link>
                    <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                    <span>Category</span>
                </div>
                <Button variant="primary" className="cursor-pointer" id="uploadButton" onClick={() => setOpenModal(true)}>
                    <i className="ri-add-line mr-2"></i> Add New
                </Button>
            </div>

            {/* category table start  */}
            {catLoading ? <div className='flex justify-center items-center h-full m-auto '>
                <i className="ri-loader-2-line text-7xl animate-spin text-primary flex items-center justify-center"></i>
            </div> :
                <div className="rounded-lg w-full bg-white dark:bg-secondary border border-info dark:border-inputborder">
                    <div className='overflow-x-auto'>
                        {categories?.length > 0 ? <table className="min-w-full text-sm ">
                            <thead className="pt-4 ">
                                <tr className="text-left text-primary dark:bg-transparent dark:text-light  text-sm border-b border-lightborder dark:border-inputborder">
                                    {['Sr. No.', 'Category Name', 'Actions'].map((header, i) => (
                                        <th key={i} className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {categories?.map((cat, i) => (
                                    <tr key={i} className="border-b border-info dark:border-inputborder hover:bg-foreground dark:hover:bg-[#2d2d2d]/40 transition">
                                        <td className="py-4 px-4">
                                            <p className="font-medium truncate text-center">{(currentPage - 1) * limit + i + 1}</p>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap text-center">{cat?.categoryName}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex space-x-2 items-center justify-center">
                                                <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-[#8e8e8e] dark:bg-[#252a3a] text-info hover:text-warning" onClick={() => getOneDetails(cat?.id)}>
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-[#8e8e8e] dark:bg-[#252a3a] text-info hover:text-error" onClick={() => handleDelete(cat?.id)}>
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> : <div className="flex justify-center items-center p-4">
                            <p className="text-sm text-light">No Data Found.</p>
                        </div>}
                    </div>

                    <div className={`${catTotalPages > 0 ? "block" : "hidden"} py-4 px-4 flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-start md:items-center`}>
                        <select name="limit" onChange={(e) => setLimit(e.target.value)} value={limit} className="w-24 py-2 px-3 rounded-md bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite" id="">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                        </select>
                        <Pagination totalPages={catTotalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    </div>
                </div>}

            {/* Modal start here  */}
            <div id="uploadModal" className={`fixed inset-0 z-50 overflow-auto flex items-center justify-center ${openModal ? 'block' : 'hidden'}`}>
                <div className="absolute inset-0 bg-black opacity-75"></div>
                <div className="relative bg-white dark:bg-secondary border border-info dark:border-inputborder max-h-[90vh] rounded-lg w-full max-w-2xl mx-4 flex flex-col">

                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-lightborder dark:border-inputborder">
                        <h3 className="text-xl text-black dark:text-lightwhite font-medium ">{editMode ? 'Edit Category' : 'Add New Category'}</h3>
                        <button
                            id="closeModal"
                            className="text-light cursor-pointer hover:text-dark dark:hover:text-white"
                            onClick={resetForm}
                        >
                            <div className="w-10 h-10 flex items-center justify-center">
                                <i className="ri-close-line text-xl"></i>
                            </div>
                        </button>
                    </div>
                    {/* Body (scrollable) */}
                    <div className="overflow-auto  flex-1 hide-scrollbar">
                        <form className="space-y-8" onSubmit={editMode ? handleUpdata : handleSumit}>
                            <div className="px-4">
                                <div className="my-4">
                                    <label htmlFor="title" className="block text-dark dark:text-info text-sm font-medium mb-2">Category Name</label>
                                    <Input
                                        type="text"
                                        id="title"
                                        name="title"
                                        placeholder="Enter category name"
                                        value={categoryName}
                                        onChange={(e) => {
                                            setCategoryName(e.target.value)
                                            setError('')
                                        }}
                                    />
                                    {error && <p className="text-error text-sm mt-1">{error}</p>}

                                </div>
                            </div>
                            <div className="sticky bottom-0 bg-white dark:bg-secondary rounded-b-lg p-4 border-t border-lightborder dark:border-inputborder flex justify-end space-x-4 overflow-hidden">
                                <Button onClick={resetForm} variant="outline" className="cursor-pointer rounded-button whitespace-nowrap">Cancel</Button>
                                <Button variant="primary" type='submit' disabled={catLoading} className={`cursor-pointer flex items-center justify-center ${catLoading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white ' : ''}`}> {catLoading ? (
                                    <>
                                        <i className="ri-loader-line mr-2 animate-spin"></i>
                                        {editMode ? 'Updating...' : 'Adding...'}
                                    </>
                                ) : editMode ? 'Update' : 'Add'}
                                </Button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Category