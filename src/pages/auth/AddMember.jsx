import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/reusableComp/Button'
import { useFormik } from 'formik'
import Input from '../../components/reusableComp/Input'
import * as Yup from 'yup'
import { apiJsonAuth } from '../../api'
import { toast } from 'react-toastify'

const AddMember = () => {
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^[6-9]\d{9}$/, 'Invalid phone number').required('Phone number is required'),
    password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Invalid password').required('Password is required'),
  })

  //============= Formik setup ================\\
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
    },
    validationSchema,
    onSubmit:async(values) => {
     try {
      setLoading(true);
      const res = await apiJsonAuth.post('/api/Admin/createSubAdmin', values);
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
          <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
          <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
          <span>Add Member</span>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-8 mb-4">
        <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-dark dark:text-info text-sm font-medium mb-2">Full Name</label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                placeholder="Enter full name"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div className="text-error text-xs mt-1">{formik.errors.fullName}</div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-dark dark:text-info text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formik?.values?.email}
                onChange={formik.handleChange}
                placeholder="Enter email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-error text-xs mt-1">{formik.errors.email}</div>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-dark dark:text-info text-sm font-medium mb-2">Phone</label>
              <Input
                type="text"
                id="phone"
                name="phone"
                value={formik?.values?.phone}
                onChange={formik.handleChange}
                placeholder="Enter phone number"
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-error text-xs mt-1">{formik.errors.phone}</div>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-dark dark:text-info text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formik?.values?.password}
                onChange={formik.handleChange}
                placeholder="Enter password"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-error text-xs mt-1">{formik.errors.password}</div>
              )}
            </div>
          </div>

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

export default AddMember