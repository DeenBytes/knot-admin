import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Input from '../../components/reusableComp/Input';
import Button from '../../components/reusableComp/Button';

const Editblog = () => {
     const [eventData, setEventData] = useState({
            title: '',
            description: '',
            publishOption: '',
            thumbImage: null,
            featuredImage: null,
        });
    
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setEventData({
                ...eventData,
                [name]: value
            });
        };
    
    
        const handleImageUpload = (e, type) => {
            if (e.target.files) {
                setEventData({
                    ...eventData,
                    [type]: e.target.files[0]
                });
            }
        };
    
        const handleSubmit = () => {
            e.preventDefault();
            console.log('Form submitted:', eventData);
            // Submit logic here
        };
  return (
    <>
    
       {/* Header */}
            <div className="mb-6">
                <div className="flex items-center text-sm text-light mb-2">
                    <Link to="/blog" className="hover:text-primary">Blog</Link>
                    <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                    <span>Edit blog</span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8 mb-4">

                {/* Basic Information */}
                <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
                    <h1 className="text-3xl font-bold text-dark dark:text-lightwhite mb-6">Edit Blog</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-dark dark:text-info text-sm font-medium mb-3">Event Name</label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                value={eventData.title}
                                onChange={handleInputChange}
                                placeholder="Enter event name"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-dark dark:text-info text-sm font-medium mb-3">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={eventData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite 
             placeholder-light dark:placeholder-lightwhite 
             rounded-md py-3 pl-5 pr-5 transition-colors duration-200 ease-in-out focus:outline-none"
                                placeholder="Describe your event"
                            ></textarea>

                        </div>
                        <div>
                            <label className="block text-dark dark:text-info text-sm font-medium mb-3">Thumbnail Image</label>
                            <div className="bg-white dark:bg-inputbg border-2 border-dashed border-lightborder dark:border-inputborder rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    id="thumbImage"
                                    name='thumbImage'
                                    onChange={(e) => handleImageUpload(e)}
                                    className="hidden"
                                    accept="image/*"

                                />
                                <label htmlFor="thumbImage" className="cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <i className="fa fa-cloud-upload-alt text-4xl text-primary mb-3"></i>
                                        <p className="text-light mb-2">Drag and drop your image here or</p>
                                        <span className="px-4 py-2 bg-primary text-white dark:text-black rounded !rounded-button whitespace-nowrap cursor-pointer">Browse Files</span>
                                        <p className="text-xs text-[#999999] mt-3">Recommended size: 1200 x 600 px</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                         <div>
                            <label className="block text-dark dark:text-info text-sm font-medium mb-3">Featured Image</label>
                            <div className="bg-white dark:bg-inputbg border-2 border-dashed border-lightborder dark:border-inputborder rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    id="featuredImage"
                                    name='featuredImage'
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
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <Button
                            type="button"
                            variant='outline'
                            className='cursor-pointer'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            type="submit"
                            variant='primary'
                            className="!rounded-button whitespace-nowrap cursor-pointer "
                        >
                           Update
                        </Button>
                    </div>
                </div>

            </form>
    </>
  )
}

export default Editblog