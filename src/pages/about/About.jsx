import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../components/reusableComp/Input';
import Button from '../../components/reusableComp/Button';
import MyEditor from '../../components/textEditor/MyEditor';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addAboutData, deleteAboutData, getAboutData } from '../../redux/async/eventAsync';
import Popup from '../../hooks/alert';
import { toast } from 'react-toastify';

const About = () => {
    const { loading, aboutData } = useSelector(state => state.event);
    const [openModal, setOpenModal] = useState(false);
    const [content, setContent] = useState('');
    const [renderedImage, setRenderedImage] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAboutData())
    }, [dispatch])

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('description is required'),
        image: Yup.mixed()
            .required('Image is required')
            .test('fileSize', 'Image size should be 2MB or less', value => {
                return value && value.size <= 2 * 1024 * 1024; // 2MB
            })
            .test('fileType', 'Only JPG and PNG files are allowed', value => {
                return value && ['image/jpeg', 'image/png'].includes(value.type);
            }),
        year_of_excellence: Yup.string().required('Year of Excellence is required'),
        events_hosted: Yup.string().required('Events Hosted is required'),
        internationalDjs: Yup.string().required('International DJs is required'),
        happy_customers: Yup.string().required('Happy Customers is required'),
    });

    // function to  add the about data
    const addData = async (values) => {
        try {
            const response = await dispatch(addAboutData(values));
            if (addAboutData.fulfilled.match(response)) {
                toast.success(response.payload.message || 'About data added successfully');
                resetModal();
            } else {
                // This is still considered "successful" from a JS point of view, but rejected by thunk
                toast.error(response.payload?.message || 'Failed to add about data');
            }
        } catch (error) {
            console.log("error", error);

            // This block runs only if dispatch itself throws, which is rare
            toast.error(error?.response?.data?.message || 'Something went wrong');
        }
    }
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            image: '',
            year_of_excellence: '',
            events_hosted: '',
            internationalDjs: '',
            happy_customers: ''
        },
        validationSchema,
        onSubmit: (values,) => {
            addData(values);
        },
    })
    const resetModal = () => { setOpenModal(false); formik.resetForm(); setContent(''); setRenderedImage(''); };
    useEffect(() => {
        formik.setFieldValue('description', content);
    }, [content]);
    // Drag-and-drop functions
    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            formik.setFieldValue('image', droppedFile);
            const renderedImageUrl = URL.createObjectURL(droppedFile);
            setRenderedImage(renderedImageUrl);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };
    const handleImageUpload = (e) => {
        if (e.target.files) {
            formik.setFieldValue('image', e.target.files[0]);
            const renderedImageUrl = URL.createObjectURL(e.target.files[0]);
            setRenderedImage(renderedImageUrl);
        }
    };



    // Function to delete the about data 
    const deleteData = async (id) => {
        const result = await Popup("warning", "Are you sure?", "You won't be able to revert this!");
        if (result.isConfirmed) {
            try {
                const response = await dispatch(deleteAboutData(id));

                if (deleteAboutData.fulfilled.match(response)) {

                    toast.success(response.payload.message || 'About data deleted successfully');

                } else {
                    // This is still considered "successful" from a JS point of view, but rejected by thunk
                    toast.error(response.payload?.message || 'Failed to delete about data');
                }
            } catch (error) {
                console.log("error", error);

                // This block runs only if dispatch itself throws, which is rare
                toast.error(error?.response?.data?.message || 'Something went wrong');
            }
        }
    }


    return (
        <> {/* Header */}
            <div className="mb-6">
                <div className="flex items-center text-sm text-light mb-2">
                    <Link to="/events" className="hover:text-primary">Dashboard</Link>
                    <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                    <span>About</span>
                </div>
            </div>
            <div className="flex flex-row gap-2 md:gap-0 justify-between items-center bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
                <h3 className="text-xl text-black dark:text-lightwhite  font-medium">About</h3>
                {!aboutData && <Button variant='outline' className="py-2 cursor-pointer text-center transition whitespace-nowrap" onClick={() => setOpenModal(true)}>Add New</Button>}
            </div>
            {aboutData ? <div className="relative flex flex-row gap-2 md:gap-0 justify-between items-center bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform space-y-3 my-4">
                <div className='absolute top-4 right-4 flex gap-2'>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-[#8e8e8e] dark:bg-[#252a3a] text-info hover:text-error" onClick={() => deleteData(aboutData?.id)}>
                        <i className="ri-delete-bin-line"></i>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
                    <div className=''>
                        <img src={aboutData?.image} alt={aboutData?.title} className='rounded-lg' />
                    </div>
                    <div className=''>
                        <h3 className="text-lg text-black dark:text-lightwhite font-medium">{aboutData?.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div><span className='font-semibold text-dark dark:text-light'>Year of Excellence</span> : {aboutData?.year_of_excellence}</div>
                            <div><span className='font-semibold text-dark dark:text-light'>Event Hosted</span> : {aboutData?.events_hosted}</div>
                            <div><span className='font-semibold text-dark dark:text-light'>International DJs</span> : {aboutData?.internationalDjs}</div>
                            <div><span className='font-semibold text-dark dark:text-light'>Happy Clients</span> : {aboutData?.happy_customers}</div>
                        </div>
                        <div className='mt-6'>
                            <p className='font-bold text-dark dark:text-light mb-2'>Description</p>
                            <div className='space-y-2' dangerouslySetInnerHTML={{ __html: aboutData?.description }}></div>
                        </div>
                    </div>
                </div>
            </div> : <div className='text-center text-black dark:text-lightwhite mt-5 text-lg'>No data found</div>}



            {/* Modal for add and edit */}
            <div id="uploadModal" className={`fixed inset-0 z-50 overflow-auto flex items-center justify-center ${openModal ? 'block' : 'hidden'}`}>
                <div className="absolute inset-0 bg-black opacity-75"></div>
                <div className="relative bg-white dark:bg-secondary border border-info dark:border-inputborder h-[90vh] rounded-lg w-full max-w-2xl mx-4 flex flex-col">

                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-lightborder dark:border-inputborder">
                        <h3 className="text-xl text-black dark:text-lightwhite font-medium">Add about data</h3>
                        <button
                            id="closeModal"
                            className="text-light cursor-pointer hover:text-dark dark:hover:text-white"
                            onClick={() => resetModal()}
                        >
                            <div className="w-10 h-10 flex items-center justify-center">
                                <i className="ri-close-line text-xl"></i>
                            </div>
                        </button>
                    </div>

                    {/* Body (scrollable) */}
                    <div className="overflow-auto  flex-1 hide-scrollbar">
                        <form className="space-y-8" onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pt-4">

                                {/* Title */}
                                <div className="md:col-span-2">
                                    <label htmlFor="title" className="block text-dark dark:text-info text-sm font-medium mb-2">Title</label>
                                    <Input type="text" id="title" name="title" placeholder="Enter the Title" value={formik.values.title} onChange={formik.handleChange} />
                                    {formik.errors.title && formik.touched.title && <div className="text-error text-xs mt-1">{formik.errors.title}</div>}
                                </div>

                                {/* Fields */}
                                <div>
                                    <label htmlFor="year_of_excellence" className="block text-dark dark:text-info text-sm font-medium mb-2">Year of Excellence</label>
                                    <Input type="text" id="year_of_excellence" name="year_of_excellence" placeholder="Enter year of excellence" value={formik.values.year_of_excellence} onChange={formik.handleChange} />
                                    {formik.errors.year_of_excellence && formik.touched.year_of_excellence && <div className="text-error text-xs mt-1">{formik.errors.year_of_excellence}</div>}
                                </div>

                                <div>
                                    <label htmlFor="events_hosted" className="block text-dark dark:text-info text-sm font-medium mb-2">Event Hosted</label>
                                    <Input type="text" id="events_hosted" name="events_hosted" placeholder="Enter total events hosted" value={formik.values.events_hosted} onChange={formik.handleChange} />
                                    {formik.errors.events_hosted && formik.touched.events_hosted && <div className="text-error text-xs mt-1">{formik.errors.events_hosted}</div>}
                                </div>

                                <div>
                                    <label htmlFor="internationalDjs" className="block text-dark dark:text-info text-sm font-medium mb-2">International DJs</label>
                                    <Input type="text" id="internationalDjs" name="internationalDjs" placeholder="Enter international DJs" value={formik.values.internationalDjs} onChange={formik.handleChange} />
                                    {formik.errors.internationalDjs && formik.touched.internationalDjs && <div className="text-error text-xs mt-1">{formik.errors.internationalDjs}</div>}
                                </div>

                                <div>
                                    <label htmlFor="happy_customers" className="block text-dark dark:text-info text-sm font-medium mb-2">Happy Clients</label>
                                    <Input type="text" id="happy_customers" name="happy_customers" placeholder="Enter happy clients" value={formik.values.happy_customers} onChange={formik.handleChange} />
                                    {formik.errors.happy_customers && formik.touched.happy_customers && <div className="text-error text-xs mt-1">{formik.errors.happy_customers}</div>}
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-dark dark:text-info text-sm font-medium mb-2">Description</label>
                                    <MyEditor content={content}
                                        setContent={setContent}
                                        desHeight="150px" className="w-full bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite placeholder-light dark:placeholder-lightwhite rounded-md" />
                                </div>

                                {/* Image Upload */}
                                <div className="md:col-span-2">
                                    <label className="block text-dark dark:text-info text-sm font-medium mb-2">About Image</label>
                                    <div className="bg-white dark:bg-inputbg border-2 border-dashed border-lightborder dark:border-inputborder rounded-lg p-8 text-center"
                                        onDrop={(event) => handleDrop(event)}
                                        onDragOver={handleDragOver}
                                    >
                                        <input type="file" id="image" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
                                        <label htmlFor="image" className="cursor-pointer">
                                            <div className="flex flex-col items-center">
                                                <i className="fa fa-cloud-upload-alt text-4xl text-primary mb-3"></i>
                                                <p className="text-light mb-2">Drag and drop your image here or</p>
                                                <span className="px-4 py-2 bg-primary text-white dark:text-black rounded !rounded-button whitespace-nowrap">Browse Files</span>
                                                <p className="text-xs text-[#999999] mt-3">Recommended size: 1200 x 600 px</p>
                                            </div>
                                        </label>
                                    </div>
                                    {formik.errors.image && formik.touched.image && <div className="text-error text-xs mt-1">{formik.errors.image}</div>}
                                    {(renderedImage || formik?.values?.image) && (
                                        <div className="relative rounded-lg overflow-hidden mt-2">
                                            <img
                                                src={renderedImage || formik?.values?.image}
                                                alt="Preview"
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>

                            </div>
                            {/* Footer (fixed inside modal) */}
                            <div className="sticky bottom-0 bg-white dark:bg-secondary rounded-b-lg p-4 border-t border-lightborder dark:border-inputborder flex justify-end space-x-4 overflow-hidden">
                                <Button type="button" variant="outline" className="cursor-pointer" onClick={() => resetModal()}>Cancel</Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className={`cursor-pointer flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <i className="ri-loader-line mr-2 animate-spin"></i>
                                            Creating
                                        </>
                                    ) : "Create"}
                                </Button>
                            </div>
                        </form>
                    </div>


                </div>

            </div>

        </>
    )
}

export default About