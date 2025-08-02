import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/reusableComp/Input';
import Button from '../../components/reusableComp/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getSingleEvent, updateEvent } from '../../redux/async/eventAsync';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const EditEvent = () => {
    const dispatch = useDispatch();
    const { loading, singleEvent } = useSelector((state) => state.event);
    const [renderedImage, setRenderedImage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {   
        dispatch(getSingleEvent(id));
    }, [id])

    const validationSchema = Yup.object().shape({
        theme_Name: Yup.string().required('Theme Name is required'),
        description: Yup.string().required('Description is required'),
        startTime: Yup.string().required('Start Time is required'),
        endTime: Yup.string().required('End Time is required'),
        date: Yup.string().required('Date is required'),
        djName: Yup.string().required('DJ Name is required'),
        image: Yup.mixed()
            .required('Image is required')
            .nullable(),

    })
    const formik = useFormik({
        initialValues: {
            theme_Name: singleEvent?.theme_Name || '',
            description: singleEvent?.description || '',
            image: singleEvent?.theme_Image || null,
            startTime: singleEvent?.startTime || '',
            endTime: singleEvent?.endTime || '',
            date: singleEvent?.date || '',
            djName: singleEvent?.djName || '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values,) => {
            const result = await dispatch(updateEvent({ id, data: values }));

            if (updateEvent.fulfilled.match(result)) {
                if (result.payload?.status === 1) {
                    toast.success(result.payload.message || 'Event updated successfully');
                    navigate(-1);
                    setRenderedImage(null);
                } else {
                    toast.error(result.payload.message || 'Something went wrong');
                }
            } else {
                toast.error(result.payload || 'Event update failed');
            }
        }
    })

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

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center text-sm text-light mb-2">
                    <Link to="/events" className="hover:text-primary">Events</Link>
                    <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                    <span>Update Event</span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-8 mb-4">

                {/* Basic Information */}
                <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
                    <h1 className="text-3xl font-bold text-dark dark:text-lightwhite mb-6">Update Event</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="theme_Name" className="block text-dark dark:text-info text-sm font-medium mb-2">Event Name</label>
                            <Input
                                type="text"
                                id="theme_Name"
                                name="theme_Name"
                                value={formik.values.theme_Name}
                                onChange={formik.handleChange}
                                placeholder="Enter event name"
                            />
                            {formik.touched.theme_Name && formik.errors.theme_Name && (
                                <div className="text-error text-xs mt-1">{formik.errors.theme_Name}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-dark dark:text-info text-sm font-medium mb-2">Date</label>
                            <Input
                                type="date"
                                id="date"
                                name="date"
                                value={formik.values.date}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.date && formik.errors.date && (
                                <div className="text-error text-xs mt-1">{formik.errors.date}</div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startTime" className="block text-dark dark:text-info text-sm font-medium mb-2">Start Time</label>
                                <Input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={formik?.values?.startTime}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.startTime && formik.errors.startTime && (
                                    <div className="text-error text-xs mt-1">{formik.errors.startTime}</div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="endTime" className="block text-dark dark:text-info text-sm font-medium mb-2">End Time</label>
                                <Input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={formik?.values?.endTime}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.endTime && formik.errors.endTime && (
                                    <div className="text-error text-xs mt-1">{formik.errors.endTime}</div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="djName" className="block text-dark dark:text-info text-sm font-medium mb-2">DJ Name</label>
                            <Input
                                type="text"
                                id="djName"
                                name="djName"
                                value={formik?.values?.djName}
                                onChange={formik.handleChange}
                                placeholder="Enter dj name"
                            />
                            {formik.touched.djName && formik.errors.djName && (
                                <div className="text-error text-xs mt-1">{formik.errors.djName}</div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-dark dark:text-info text-sm font-medium mb-2">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formik?.values?.description}
                                onChange={formik.handleChange}
                                rows={4}
                                className="w-full bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite 
                placeholder-light dark:placeholder-lightwhite 
                rounded-md py-3 pl-5 pr-5 transition-colors duration-200 ease-in-out focus:outline-none"
                                placeholder="Describe your event"
                            ></textarea>
                            {formik.touched.description && formik.errors.description && (
                                <div className="text-error text-xs mt-1">{formik.errors.description}</div>
                            )}

                        </div>
                        <div className='md:col-span-2'>
                            <label className="block text-dark dark:text-info text-sm font-medium mb-2">Featured Image</label>
                            <div className="bg-white dark:bg-inputbg border-2 border-dashed border-lightborder dark:border-inputborder rounded-lg p-8 text-center"
                                onDrop={(event) => handleDrop(event)}
                                onDragOver={handleDragOver}
                            >
                                <input
                                    type="file"
                                    id="featuredImage"
                                    onChange={(e) => handleImageUpload(e)}
                                    className="hidden"
                                    accept="image/*"

                                />
                                <label htmlFor="featuredImage" className="cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <i className="fa fa-cloud-upload-alt text-4xl text-primary mb-3"></i>
                                        <p className="text-light mb-2">Drag and drop your image here or</p>
                                        <span className="px-4 py-2 bg-primary text-white dark:text-black rounded !rounded-button whitespace-nowrap cursor-pointer">Browse Files</span>
                                        <p className="text-xs text-[#999999] mt-3">Recommended size: 1200 x 600 px</p>
                                    </div>
                                </label>
                            </div>
                            {formik.touched.image && formik.errors.image && (
                                <div className="text-error text-xs mt-1">{formik.errors.image}</div>
                            )}
                            {(renderedImage || formik?.values?.image) && (
                                <div className="relative rounded-lg overflow-hidden mt-2">
                                    <img
                                        src={renderedImage || formik?.values?.image}
                                        alt="Preview"
                                        className="w-24 h-24 object-contain"
                                    />
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <Button
                            type="button"
                            variant='outline'
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={loading}
                            type="submit"
                            variant='primary'
                            className={`cursor-pointer flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <i className="ri-loader-line mr-2 animate-spin"></i>
                                    Updating...
                                </>
                            ) : (
                                'Update Event'
                            )}
                        </Button>
                    </div>
                </div>

            </form>
        </>
    )
}

export default EditEvent