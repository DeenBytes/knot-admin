import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { apiJsonAuth } from '../../api'
import Input from '../../components/reusableComp/Input'
import Button from '../../components/reusableComp/Button'

const AddNewReview = () => {
    const [loading, setLoading] = useState(false);
    const validationSchema = Yup.object().shape({
        userName: Yup.string().required('User Name is required'),
        rating: Yup.number()
            .min(1, 'Minimum rating is 1')
            .max(5, 'Maximum rating is 5')
            .test(
                'is-decimal-or-integer',
                'Rating must be in 0.5 steps (e.g., 3.5, 4)',
                value => value % 0.5 === 0
            )
            .required('Rating is required'),

        description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    })

    //============= Formik setup ================\\
    const formik = useFormik({
        initialValues: {
            userName: '',
            rating: '',
            description: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    ...values,
                    rating: Number(values.rating), 
                };
                setLoading(true);
                const res = await apiJsonAuth.post('/api/Admin/adminAddReview', payload);
                if (res.data?.status === 1) {
                    setLoading(false);
                    formik.resetForm();
                    toast.success(res?.data?.message);
                }

            } catch (error) {
                setLoading(false);
                toast.error(error?.response?.data?.message);
                console.log("Error", error);
            }
        },
    })

   
    return (
        <>
            <div className="mb-8">
                <div className="flex items-center text-sm text-light mb-2">
                    <Link to="/website/reviews" className="hover:text-primary">Reviews</Link>
                    <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                    <span>Add Review</span>
                </div>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-8 mb-4">
                <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="userName" className="block text-dark dark:text-info text-sm font-medium mb-2">User Name</label>
                            <Input
                                type="text"
                                id="userName"
                                name="userName"
                                value={formik.values.userName}
                                onChange={formik.handleChange}
                                placeholder="Enter User Name"
                            />
                            {formik.touched.userName && formik.errors.userName && (
                                <div className="text-error text-xs mt-1">{formik.errors.userName}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="rating" className="block text-dark dark:text-info text-sm font-medium mb-2">Rating</label>
                            <Input
                                type="rating"
                                id="rating"
                                name="rating"
                                value={formik?.values?.rating}
                                onChange={formik.handleChange}
                                placeholder="Enter rating"
                            />
                            {formik.touched.rating && formik.errors.rating && (
                                <div className="text-error text-xs mt-1">{formik.errors.rating}</div>
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

                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <Button
                            type="button"
                            variant='outline'
                            onClick={() => formik.resetForm()}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={loading}
                            type="submit"
                            variant='primary'
                            className={`cursor-pointer flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white' : ''}`}
                        >
                            {loading ? (<>
                                <i className="ri-loader-line mr-2 animate-spin"></i>
                                Creating...
                            </>) : "Create"}
                        </Button>
                    </div>
                </div>
            </form>

        </>
    )
}

export default AddNewReview