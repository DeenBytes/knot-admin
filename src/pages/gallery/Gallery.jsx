import { useState, useEffect, use } from "react";
import CustomSelect from "../../components/reusableComp/CustomSelect"
import Button from "../../components/reusableComp/Button";
import { Link } from "react-router-dom";
import Input from "../../components/reusableComp/Input";
import Pagination from "../../components/reusableComp/Pagination";
import { addGallery, deleteGallery, fetchCategory, fetchGallery, updateGallery } from "../../redux/async/galleryAsync";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Popup from "../../hooks/alert";
import { apiJsonAuth } from "../../api";


const Categories = [
    {
        id: 1,
        name: "All Categories",
        value: "all"
    },
    {
        id: 2,
        name: "Event Photos",
        value: "event_photos"
    },
    {
        id: 3,
        name: "Venue",
        value: "venue"
    },
    {
        id: 4,
        name: "Promotional",
        value: "promotional"
    }
]
const galleryItems = [
    {
        id: 1,
        name: "Neon Nights",
        category: "Atmosphere",
        imageUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20with%20neon%20lights%2C%20crowded%20dance%20floor%2C%20professional%20photography%2C%20high%20quality%2C%20vibrant%20colors%2C%20nightlife%20scene%2C%20DJ%20booth%20visible%2C%20atmospheric%20lighting&width=400&height=300&seq=1&orientation=landscape"
    },
    {
        id: 2,
        name: "Retro Revival",
        category: "Events",
        imageUrl: "https://readdy.ai/api/search-image?query=retro%20themed%20nightclub%20with%20disco%20balls%2C%20vintage%20decor%2C%20people%20dancing%20in%20retro%20outfits%2C%20professional%20photography%2C%20high%20quality%2C%20vibrant%20colors%2C%2070s%20and%2080s%20aesthetic%2C%20atmospheric%20lighting&width=400&height=300&seq=2&orientation=landscape"
    },
    {
        id: 3,
        name: "International DJ Night",
        category: "Interior",
        imageUrl: "https://readdy.ai/api/search-image?query=international%20DJ%20performance%20in%20luxury%20nightclub%2C%20diverse%20crowd%2C%20professional%20lighting%20setup%2C%20smoke%20effects%2C%20high-end%20audio%20equipment%20visible%2C%20professional%20photography%2C%20high%20quality%2C%20vibrant%20colors&width=400&height=300&seq=3&orientation=landscape"
    },
    {
        id: 4,
        name: "VIP Section",
        category: "Events",
        imageUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape"
    },
    {
        id: 5,
        name: "Bar Area",
        category: "Atmosphere",
        imageUrl: "https://readdy.ai/api/search-image?query=nightclub%20bar%20area%2C%20expert%20bartenders%20making%20cocktails%2C%20premium%20spirits%20display%2C%20elegant%20bar%20counter%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=5&orientation=landscape"
    },
    {
        id: 6,
        name: "Club Entrance",
        category: "Interior",
        imageUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20entrance%2C%20velvet%20rope%2C%20security%20staff%2C%20well-dressed%20guests%20arriving%2C%20exterior%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20nighttime%20scene%2C%20elegant%20facade&width=400&height=300&seq=6&orientation=landscape"
    }
]

const Gallery = () => {
    const { categories, galleryItems, totalPages, loading } = useSelector(state => state?.gallery);
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [singleGallery, setSingleGallery] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [openModal, setOpenModal] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [renderedImage, setRenderedImage] = useState(null);
    //============== Function to reset the form =========== \\
    const resetForm = () => {
        setOpenModal(false)
        setEditMode(false);
        setEditId(null);
    }

    ///======== validation for gallery =========== \\
    const validation = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        categoryId: Yup.string().required("Category is required"),
        image: editMode ? Yup.mixed().nullable() : Yup.mixed()
            .required('Image is required')
            .test('fileSize', 'Image size should be 2MB or less', value => {
                return value && value.size <= 2 * 1024 * 1024; // 2MB
            })
            .test('fileType', 'Only JPG and PNG files are allowed', value => {
                return value && ['image/jpeg', 'image/png'].includes(value.type);
            }),
    })

    //========== function to add new gallery =========== \\
    const addNewGallery = async (values) => {
        try {
            const result = await dispatch(addGallery(values));

            if (addGallery.fulfilled.match(result)) {
                const { payload } = result;
                if (payload?.status === 1) {
                    toast.success(payload.message || 'Gallery added successfully');
                    resetForm();
                    formik.resetForm();
                    setRenderedImage(null);
                    setPage(1); // Reset to page 1 after new addition
                    dispatch(fetchGallery({ page: 1, limit }));
                } else {
                    toast.error(payload?.message || 'Something went wrong');
                }
            } else {
                throw new Error(result?.payload || 'Gallery add failed');
            }
        } catch (error) {
            console.error('Add Gallery Error:', error);
            toast.error(error.message || 'Something went wrong');
        }
    };

    const editGallery = async (values) => {
        const data = { id: editId, data: values };
        try {
            const result = await dispatch(updateGallery(data));

            if (updateGallery.fulfilled.match(result)) {
                const { payload } = result;
                if (payload?.status === 1) {
                    toast.success(payload.message || 'Gallery updated successfully');
                    resetForm();
                    formik.resetForm();
                    setRenderedImage(null);
                    setPage(1); // Reset to page 1 after new addition
                    dispatch(fetchGallery({ page: 1, limit }));
                } else {
                    toast.error(payload?.message || 'Something went wrong');
                }
            } else {
                throw new Error(result?.payload || 'Gallery update failed');
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }
    //============== formik for gallery =============== \\
    const formik = useFormik({
        initialValues: {
            title: singleGallery?.title || "",
            image: singleGallery?.gallery_Image || null,
            categoryId: singleGallery?.categoryId || null,
        },
        validationSchema: validation,
        enableReinitialize: true,
        onSubmit: (values) => {
            if (editMode) {
                editGallery(values);
            } else {
                addNewGallery(values);
            }
        }
    })
    //================== fetch category ================ \\
    useEffect(() => {
        dispatch(fetchCategory());
    }, [])

    //================== fetch gallery ================ \\
    useEffect(() => {
        let data = {
            page: page,
            limit: limit,
            name: selectedCategory === "All Categories" ? "" : selectedCategory
        }
        dispatch(fetchGallery(data));

    }, [page, limit, selectedCategory])
    //================== handle image upload ================ \\
    const handleImageUpload = (e) => {
        if (e.target.files) {
            formik.setFieldValue('image', e.target.files[0]);
            const renderedImage = URL.createObjectURL(e.target.files[0]);
            setRenderedImage(renderedImage);

        }
    }
    //================== Drag-and-drop functions =============== \\
    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            formik.setFieldValue('image', droppedFile);
            const renderedImage = URL.createObjectURL(droppedFile);
            setRenderedImage(renderedImage);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };
    const removeImage = (e) => {
        e.preventDefault();
        formik.setFieldValue('image', null);
        setRenderedImage(null);
    };

    //=============== Function to get one details of the gallery =========== \\
    const getOneDetails = async (id) => {
        try {
            const result = await apiJsonAuth.get(`/api/Admin/adminGetGalleryById/${id}`);
            if (result.status === 200) {
                console.log(result.data.result);
                setSingleGallery(result.data.result);
                setEditMode(true);
                setEditId(id);
                setOpenModal(true);
            }
        } catch (error) {
            console.log(error.response.data.message);
        }

    };
    useEffect(() => {
        if (singleGallery?.gallery_Image) {
            setRenderedImage(singleGallery.gallery_Image);
        }
    }, [singleGallery]);


    //============== Function to delete the gallery =========== \\
    const handleDelete = async (id) => {
        const result = await Popup("warning", "Are you sure?", "You won't be able to revert this!");
        if (result.isConfirmed) {
            try {
                const response = await dispatch(deleteGallery(id));

                if (deleteGallery.fulfilled.match(response)) {
                    toast.success(response.payload.message || 'Category deleted successfully');
                    setPage(1); // Reset to page 1 after deletion
                    dispatch(fetchGallery({ page: 1, limit }));
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
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-sm text-light">
                    <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                    <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                    <span>Gallery</span>
                </div>
                <Button variant="primary" className="cursor-pointer" id="uploadButton" onClick={() => setOpenModal(true)}>
                    <i className="ri-upload-2-line"></i> Upload Image
                </Button>
            </div>
            <div className="flex-1  px-2 py-3">

                {/* <!-- Filters --> */}
                <div className="flex  gap-4 mb-6">
                    <div className="relative">
                        <CustomSelect options={[{ categoryName: "All Categories" }, ...categories].map(cat => cat?.categoryName)} placeholder="Select Category" value={selectedCategory} onChange={(value) => {
                            setSelectedCategory(value);
                        }} />
                    </div>
                </div>

                {/* <!-- Gallery Grid --> */}
                {loading ? <div className='flex justify-center items-center h-full m-auto '>
                    <i className="ri-loader-2-line text-7xl animate-spin text-primary flex items-center justify-center"></i>
                </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* <!-- Gallery Item 1 --> */}
                    {galleryItems.length > 0 ? galleryItems?.map((item) => (
                        <div key={item.id} className="gallery-item rounded-lg overflow-hidden">
                            <img
                                src={item?.gallery_Image}
                                alt={item?.categoryName}
                                className="w-full h-64 object-cover"
                            />

                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="bg-blue-600 text-xs text-white px-2 py-1 rounded-full">{item?.categoryName}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Overlay appears on hover */}
                            <div className="absolute gallery-overlay inset-0 bg-[rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in flex items-center justify-center px-4">
                                <div className="text-center">
                                    <h3 className="text-white font-bold">{item?.title}</h3>
                                    <p className="text-gray-300 text-sm">{item?.categoryName}</p>
                                </div>
                                <div className="absolute bottom-4 right-4 flex space-x-2">
                                    <button className="w-8 h-8 bg-gray-800 bg-opacity-70 cursor-pointer rounded-full flex items-center justify-center text-white hover:bg-primary transition" onClick={() => getOneDetails(item?.id)}>
                                        <i className="ri-edit-line"></i>
                                    </button>
                                    <button className="w-8 h-8 bg-gray-800 bg-opacity-70 cursor-pointer rounded-full flex items-center justify-center text-white hover:bg-error transition" onClick={() => handleDelete(item?.id)}>
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </div>
                        </div>)) : <div className="flex justify-center items-center p-4 col-span-3">
                        <p className="text-sm text-light text-center">No Data Found.</p>
                    </div>}

                </div>}

                {/* <!-- Pagination --> */}
                {totalPages > 0 && <div className="flex justify-center mt-8">
                    <Pagination totalPages={totalPages} currentPage={page} setCurrentPage={setPage} />
                </div>}
            </div>
            {/* <!-- Upload Modal --> */}
            <div id="uploadModal" className={`fixed inset-0 z-50 overflow-auto flex items-center justify-center ${openModal ? 'block' : 'hidden'}`}>
                <div className="absolute inset-0 bg-black opacity-75"></div>
                <div className="relative bg-white dark:bg-secondary border border-info dark:border-inputborder h-[90vh] rounded-lg w-full max-w-2xl mx-4 flex flex-col">

                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-lightborder dark:border-inputborder">
                        <h3 className="text-xl text-black dark:text-lightwhite font-medium">{editMode ? 'Update gallery' : 'Add new gallery'}</h3>
                        <button
                            id="closeModal"
                            className="text-light cursor-pointer hover:text-dark dark:hover:text-white"
                            onClick={() => resetForm()}
                        >
                            <div className="w-10 h-10 flex items-center justify-center">
                                <i className="ri-close-line text-xl"></i>
                            </div>
                        </button>
                    </div>
                    {/* Body (scrollable) */}
                    <div className="overflow-auto  flex-1 hide-scrollbar">
                        <form className="space-y-8" onSubmit={formik.handleSubmit}>
                            <div className="px-4">
                                <div className="w-full mb-6">
                                    <label className="block text-dark dark:text-info text-sm font-medium mb-2 mt-4">Gallery Image</label>
                                    <div className="bg-white dark:bg-inputbg border-2 border-dashed border-lightborder dark:border-inputborder rounded-lg p-8 text-center"
                                        onDrop={(event) => handleDrop(event)}
                                        onDragOver={handleDragOver}
                                    >
                                        <input
                                            type="file"
                                            name="galleryImage"
                                            id="galleryImage"
                                            onChange={(e) => handleImageUpload(e)}
                                            className="hidden"
                                            accept="image/*"

                                        />
                                        <label htmlFor="galleryImage" className="cursor-pointer">
                                            <div className="flex flex-col items-center">
                                                <i className="ri-upload-cloud-2-line text-4xl text-primary mb-1"></i>
                                                <p className="text-light mb-2">Drag and drop your image here or</p>
                                                <span className="px-4 py-2 bg-primary text-white dark:text-black rounded !rounded-button whitespace-nowrap cursor-pointer">Browse Files</span>
                                                <p className="text-xs text-[#999999] mt-3">Recommended size: 1200 x 600 px</p>
                                            </div>
                                        </label>
                                    </div>
                                    {formik.touched.image && formik.errors.image && (
                                        <div className="text-error text-xs mt-1">{formik.errors.image}</div>
                                    )}
                                </div>
                                {(renderedImage || formik?.values?.image) && (<div id="previewContainer" className={`grid grid-cols-3 gap-4 mb-6 ${renderedImage ? '' : 'hidden'}`}>
                                    <div className="relative rounded-lg overflow-hidden">
                                        <img src={renderedImage || formik?.values?.image} alt="Preview" className="w-full h-24 object-cover" />
                                        <button className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white" onClick={removeImage}>
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                <i className="ri-close-line"></i>
                                            </div>
                                        </button>
                                    </div>
                                </div>)}
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label htmlFor="title" className="block text-dark dark:text-info text-sm font-medium mb-2">Title</label>
                                        <Input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            placeholder="Enter gallery image title"
                                        />
                                        {formik.touched.title && formik.errors.title && (
                                            <div className="text-error text-xs mt-1">{formik.errors.title}</div>
                                        )}

                                    </div>
                                    <div>
                                        <label htmlFor="categoryId" className="block text-dark dark:text-info text-sm font-medium mb-2">Category</label>
                                        <select name="categoryId" id="categoryId"
                                            className="w-full py-3 pl-5 pr-5 text-left bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-sm text-black dark:text-lightwhite rounded-lg focus:outline-none"
                                            value={formik.values.categoryId} onChange={formik.handleChange} placeholder="Select Category">
                                            <option value="" selected disabled>Select Category</option>
                                            {categories.map((cat, index) => (
                                                <option key={index} value={cat.id}>{cat.categoryName}</option>
                                            ))}
                                        </select>
                                        {formik.touched.categoryId && formik.errors.categoryId && (
                                            <div className="text-error text-xs mt-1">{formik.errors.categoryId}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="sticky bottom-0 bg-white dark:bg-secondary rounded-b-lg p-4 border-t border-lightborder dark:border-inputborder flex justify-end space-x-4 overflow-hidden">
                                <Button onClick={() => resetForm()} variant="outline" className="cursor-pointer rounded-button whitespace-nowrap">Cancel</Button>
                                <Button disabled={loading}
                                    type="submit"
                                    variant='primary'
                                    className={`cursor-pointer flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <i className="ri-loader-line mr-2 animate-spin"></i>
                                            {editMode ? 'Updating...' : 'Uploading...'}
                                        </>
                                    ) : (
                                        editMode ? 'Update' : "Upload"
                                    )}</Button>
                            </div>


                        </form>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Gallery