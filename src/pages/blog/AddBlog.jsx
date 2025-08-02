import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Input from '../../components/reusableComp/Input';
import Button from '../../components/reusableComp/Button';
import MyEditor from '../../components/textEditor/MyEditor';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { addBlog } from '../../redux/async/blogAsync';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

const AddBlog = () => {
    const { loading } = useSelector((state) => state.blog);
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const [draft, setDraft] = useState(false);
    const [renderedImage, setRenderedImage] = useState({
        thumbnailImage: null,
        featuredImage: null,
    });

    function createSlug(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }


    //=========== Set Discription data =========== \\
    useEffect(() => {
        formik.setFieldValue('description', content);
    }, [content])

    //============= Validation Schema =========== \\
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        status: Yup.string().required('Publish Option is required'),
        thumbnailImage: Yup.mixed().required('Thumb Image is required').test('fileSize', 'Image size should be 2MB or less', value => {
            return value && value.size <= 2 * 1024 * 1024; // 2MB
        })
            .test('fileType', 'Only JPG and PNG files are allowed', value => {
                return value && ['image/jpeg', 'image/png'].includes(value.type);
            }),
        featuredImage: Yup.mixed().required('Featured Image is required').test('fileSize', 'Image size should be 2MB or less', value => {
            return value && value.size <= 2 * 1024 * 1024; // 2MB
        })
            .test('fileType', 'Only JPG and PNG files are allowed', value => {
                return value && ['image/jpeg', 'image/png'].includes(value.type);
            }),
        metaTitle: Yup.string().required('Meta Title is required').min(5, 'Meta Title must be at least 5 characters'),
        metaDescription: Yup.string().required('Meta Description is required').min(100, 'Meta Description must be at least 100 characters'),
        metaKeywords: Yup.string().required('Meta Keywords is required'),
        slug: Yup.string().required('Slug is required'),
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            status: 'Published',
            thumbnailImage: null,
            featuredImage: null,
            metaTitle: '',
            metaDescription: '',
            metaKeywords: '',
            slug: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            const data = {
                ...values,
                status: draft ? 'Draft' : 'Published',
            };
            const result = await dispatch(addBlog(data));
            
            if (addBlog.fulfilled.match(result)) {
                if (result.payload?.status === 1) {
                    toast.success(result.payload.message || 'Blog added successfully');
                    resetForm();
                    setRenderedImage({
                        thumbnailImage: null,
                        featuredImage: null
                    });
                    setContent('');
                } else {
                    toast.error(result.payload.message || 'Something went wrong');
                }
            } else {
                toast.error(result.payload || 'Blog add failed');
            }
            // Submit logic here
        },
    });


    // Drag-and-drop functions
    const handleDrop = (event, field) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            formik.setFieldValue(field, droppedFile);
            const renderedImageUrl = URL.createObjectURL(droppedFile);
            setRenderedImage({
                ...renderedImage,
                [field]: renderedImageUrl,
            });
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // Generalized file input change handler
    const handleImageUpload = (e, field) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            formik.setFieldValue(field, file);
            const renderedImageUrl = URL.createObjectURL(file);
            setRenderedImage({
                ...renderedImage,
                [field]: renderedImageUrl,
            });
        }
    };

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center text-sm text-light mb-2">
                    <Link to="/blog" className="hover:text-primary">Blog</Link>
                    <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                    <span>Add blog</span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-8 mb-4">

                {/* Basic Information */}
                <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
                    <h1 className="text-3xl font-bold text-dark dark:text-lightwhite mb-6">Add Blog</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-dark dark:text-info text-sm font-medium mb-3">Event Name</label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                value={formik.values.title}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    const newTitle = e.target.value;
                                    formik.setFieldValue('slug', createSlug(newTitle));
                                }}
                                placeholder="Enter event name"
                            />
                            {formik.touched.title && formik.errors.title ? (
                                <div className="text-error text-xs mt-1">{formik.errors.title}</div>
                            ) : null}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-dark dark:text-info text-sm font-medium mb-2">Description</label>
                            <MyEditor content={content}
                                setContent={setContent}
                                desHeight="150px" className="w-full bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite placeholder-light dark:placeholder-lightwhite rounded-md" />
                            {formik.touched.description && formik.errors.description ? (
                                <div className="text-error text-xs mt-1">{formik.errors.description}</div>
                            ) : null}
                        </div>
                        <div>
                            <label className="block text-dark dark:text-info text-sm font-medium mb-3">Thumbnail Image</label>
                            <div
                                onDrop={(event) => handleDrop(event, 'thumbnailImage')}
                                onDragOver={handleDragOver}
                                className="bg-white dark:bg-inputbg border-2 border-dashed border-lightborder dark:border-inputborder rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    id="thumbnailImage"
                                    name='thumbnailImage'
                                    onChange={(e) => handleImageUpload(e, 'thumbnailImage')}
                                    className="hidden"
                                    accept="image/*"

                                />
                                <label htmlFor="thumbnailImage" className="cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <i className="fa fa-cloud-upload-alt text-4xl text-primary mb-3"></i>
                                        <p className="text-light mb-2">Drag and drop your image here or</p>
                                        <span className="px-4 py-2 bg-primary text-white dark:text-black rounded !rounded-button whitespace-nowrap cursor-pointer">Browse Files</span>
                                        <p className="text-xs text-[#999999] mt-3">Recommended size: 1200 x 600 px</p>
                                    </div>
                                </label>
                            </div>
                            {formik.touched.thumbnailImage && formik.errors.thumbnailImage && (
                                <div className="text-error text-xs mt-1">{formik.errors.thumbnailImage}</div>
                            )}
                            {renderedImage?.thumbnailImage && <div className="relative rounded-lg overflow-hidden mt-2">
                                <img src={renderedImage?.thumbnailImage} alt="Preview" className="w-24 h-24 object-contain" />
                            </div>}
                        </div>
                        <div>
                            <label className="block text-dark dark:text-info text-sm font-medium mb-3">Featured Image</label>
                            <div
                                onDrop={(event) => handleDrop(event, 'featuredImage')}
                                onDragOver={handleDragOver}
                                className="bg-white dark:bg-inputbg border-2 border-dashed border-lightborder dark:border-inputborder rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    id="featuredImage"
                                    name='featuredImage'
                                    onChange={(e) => handleImageUpload(e, 'featuredImage')}
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
                            {formik.touched.featuredImage && formik.errors.featuredImage && (
                                <div className="text-error text-xs mt-1">{formik.errors.featuredImage}</div>
                            )}
                            {renderedImage?.featuredImage && <div className="relative rounded-lg overflow-hidden mt-2">
                                <img src={renderedImage?.featuredImage} alt="Preview" className="w-24 h-24 object-contain" />
                            </div>}
                        </div>
                        <div className="mb-6 md:col-span-2">
                            <h3 className="text-lg font-medium mb-4">SEO Metadata</h3>
                            <div className="mb-4">
                                <label htmlFor="metaTitle" className="block text-dark dark:text-info text-sm font-medium mb-3">Meta Title</label>
                                <Input type="text" name="metaTitle" id="metaTitle" placeholder="SEO title (recommended: 50-60 characters)" value={formik.values.metaTitle} onChange={formik.handleChange} />
                                {formik.touched.metaTitle && formik.errors.metaTitle ? <div className="text-error text-xs mt-1">{formik.errors.metaTitle}</div> : <div className="text-xs text-light mt-1 flex justify-between">
                                    <span>Recommended: 50-60 characters</span>
                                    <span id="metaTitleCount">{formik.values.metaTitle.length}/60</span>
                                </div>}
                            </div>

                            <div className="mb-4 md:col-span-2">
                                <label htmlFor="metaDescription" className="block text-dark dark:text-info text-sm font-medium mb-3">Meta Description</label>
                                <textarea id="metaDescription"
                                    className="w-full bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite placeholder-light dark:placeholder-lightwhite rounded-md py-3 pl-5 pr-5 transition-colors duration-200 ease-in-out focus:outline-none"
                                    name="metaDescription" value={formik.values.metaDescription} onChange={formik.handleChange} rows="3" placeholder="SEO description (recommended: 150-160 characters)"></textarea>
                                {formik.touched.metaDescription && formik.errors.metaDescription ? <div className="text-error text-xs mt-1">{formik.errors.metaDescription}</div> : <div className="text-xs text-light mt-1 flex justify-between">
                                    <span>Recommended: 150-160 characters</span>
                                    <span id="metaDescCount">{formik.values.metaDescription.length}/160</span>
                                </div>}
                            </div>

                            <div className="mb-4 md:col-span-2">
                                <label htmlFor="focusKeywords" className="block text-dark dark:text-info text-sm font-medium mb-3">Focus Keywords</label>
                                <Input type="text" id="focusKeywords" name="metaKeywords" value={formik.values.metaKeywords} onChange={formik.handleChange} placeholder="Enter keywords separated by commas" />
                                {formik.touched.metaKeywords && formik.errors.metaKeywords ? <div className="text-error text-xs mt-1">{formik.errors.metaKeywords}</div> :
                                    <div className="text-xs text-light mt-1">
                                        <span>Example: nightlife, event planning, venue management</span>
                                    </div>}
                            </div>

                            <div className='md:col-span-2'>
                                <label htmlFor="urlSlug" className="block text-dark dark:text-info text-sm font-medium mb-3">URL Slug</label>
                                <div className="flex items-center">
                                    <Input type="text" id="urlSlug" name="slug" value={formik.values.slug} placeholder="your-post-url" readOnly />
                                </div>
                                {formik.touched.slug && formik.errors.slug ? <div className="text-error text-xs mt-1">{formik.errors.slug}</div> : null}
                            </div>
                        </div>

                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <Button
                            type="submit"
                            onClick={() => setDraft(true)}
                            variant='outline'
                            disabled={loading}
                            className='cursor-pointer'
                        >
                            Save as Draft
                        </Button>
                        <Button
                            onClick={() => setDraft(false)}
                            disabled={loading}
                            type="submit"
                            variant='primary'
                            className={`cursor-pointer flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white' : ''}`}
                        >
                            {loading ? (<>
                                <i className="ri-loader-line mr-2 animate-spin"></i>
                                Creating...
                            </>) : 'Create Post'}
                        </Button>
                    </div>
                </div>

            </form>
        </>
    )
}

export default AddBlog