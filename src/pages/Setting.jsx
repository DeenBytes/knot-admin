import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Input from '../components/reusableComp/Input';
import Button from '../components/reusableComp/Button';
import { setColorCode, toggleDarkMode } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { resetPassword, updateUser } from '../redux/async/authAsync';
import { toast } from 'react-toastify';
import { apiJsonAuth } from '../api';
import Popup from '../hooks/alert';

const colors = [
    { id: 1, code: '#C5A572' },
    { id: 2, code: '#277fff' },
    { id: 3, code: '#22c55e' },
    { id: 4, code: '#a855f7' },
    { id: 5, code: '#ef4444' },
];

const Setting = () => {
    const { darkMode, colorCode, user, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = React.useState(false);
    const [members, setMembers] = React.useState([]);
    const [collapse, setCollapse] = React.useState({
        account: false,
        security: false,
        about: false,
        appearance: false,
        userManagement: false,
    });
    const toggleCollapse = (section) => {
        setCollapse((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };
    //========== Function to change theme color ==========
    const changeThemeColor = () => {
        localStorage.setItem("colorCode", colorCode);
        localStorage.setItem("theme", darkMode);
    };
    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required('Full name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        mobileNumber: Yup.string().matches(/^[6-9]\d{9}$/, 'Invalid mobile number').required('Mobile number is required'),
    })
    // ========== Function to handle account details ==========
    const formik = useFormik({
        initialValues: {
            fullName: user?.fullName || '',
            email: user?.email || '',
            mobileNumber: user?.mobileNumber || '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const result = await dispatch(updateUser(values));

            if (updateUser.fulfilled.match(result)) {
                if (result.payload?.status === 1) {
                    toast.success(result.payload.message || 'Profile updated successfully');
                    localStorage.setItem('user', JSON.stringify(result.payload.result));

                } else {
                    toast.error(result.payload.message || 'Something went wrong');
                }
            } else {
                toast.error(result.payload || 'Profile update failed');
            }
        },
    })

    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object().shape({
            currentPassword: Yup.string().required('Current password is required'),
            newPassword: Yup.string().matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must be at least 8 characters long and contain at least one letter and one number').required('New password is required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match').required('Confirm password is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            const result = await dispatch(resetPassword(values));

            if (resetPassword.fulfilled.match(result)) {
                console.log(result);
                if (result.payload?.status === 1) {
                    resetForm();
                    toast.success(result.payload.message || 'Password updated successfully');
                } else {
                    toast.error(result.payload.message || 'Something went wrong');
                }
            } else {
                toast.error(result.payload || 'Password update failed');
            }
        },
    })

    //=============== Function to get the member list =================\\
    const getMemberList = async () => {
        try {
            const result = await apiJsonAuth.get('/api/Admin/adminGetSubAdminList');
            if (result?.data.status === 1) {
                setMembers(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getMemberList();
    }, [])

    //=============== Function to delete the member list =================\\
    const handleDelete = async (id) => {
        try {
            const result = await Popup("warning", "Are you sure?", "You won't be able to revert this!");
            if (result.isConfirmed) {
                const response = await apiJsonAuth.delete(`/api/Admin/adminDeleteSubAdmin/${id}`);
                if (response.data.status === 1) {
                    toast.success(response.data.message);
                    getMemberList();
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
            <div className="mb-8">
                <div className="flex items-center text-sm text-light mb-2">
                    <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                    <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                    <span>Setting</span>
                </div>
            </div>
            {/* <!-- Account Settings --> */}
            <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 mb-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium text-light dark:text-lightwhite">Account Settings</h2>
                    <button className="bg-transparent text-light hover:text-extralightgray dark:hover:text-white cursor-pointer" onClick={() => toggleCollapse('account')}>
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className={collapse.account ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
                        </div>
                    </button>
                </div>
                {collapse.account && (
                    <>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mt-4">
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
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        placeholder="Enter full name"
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="text-error text-xs mt-1">{formik.errors.email}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="mobileNumber" className="block text-dark dark:text-info text-sm font-medium mb-2">Phone</label>
                                    <Input
                                        type="text"
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        value={formik.values.mobileNumber}
                                        onChange={(e) => {
                                            const numericValue = e.target.value.replace(/\D/g, ''); // remove non-digits
                                            formik.setFieldValue("mobileNumber", numericValue);
                                        }}
                                        placeholder="Enter phone number"

                                    />
                                    {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                                        <div className="text-error text-xs mt-1">{formik.errors.mobileNumber}</div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <Button variant='primary' disabled={loading} type='submit' className={`cursor-pointer flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white ' : ''}`}>{loading ? <>
                                    <i className="ri-loader-line mr-2 animate-spin"></i>
                                    Saving...
                                </> : 'Save Changes'}</Button>
                            </div>
                        </form>
                    </>)}
            </div>
            {/* <!-- Security Settings --> */}
            <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 mb-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium text-light dark:text-lightwhite">Password</h2>
                    <button className="bg-transparent text-light hover:text-extralightgray dark:hover:text-white cursor-pointer" onClick={() => toggleCollapse('security')}>
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className={collapse.security ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
                        </div>
                    </button>
                </div>
                {collapse.security && (
                    <>
                        <form onSubmit={passwordFormik.handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-dark dark:text-info text-sm font-medium mb-2">Current Password</label>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordFormik.values.currentPassword}
                                        onChange={passwordFormik.handleChange}
                                        placeholder="••••••••"
                                    />
                                    {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword && (
                                        <div className="text-error text-xs mt-1">{passwordFormik.errors.currentPassword}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="newPassword" className="block text-dark dark:text-info text-sm font-medium mb-2">New Password</label>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordFormik.values.newPassword}
                                        onChange={passwordFormik.handleChange}
                                        placeholder="••••••••"
                                    />
                                    {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                                        <div className="text-error text-xs mt-1">{passwordFormik.errors.newPassword}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-dark dark:text-info text-sm font-medium mb-2">Confirm New Password</label>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordFormik.values.confirmPassword}
                                        onChange={passwordFormik.handleChange}
                                        placeholder="••••••••"
                                    />
                                    {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                                        <div className="text-error text-xs mt-1">{passwordFormik.errors.confirmPassword}</div>
                                    )}
                                </div>

                            </div>
                            <div className="flex items-center mt-4">
                                <div
                                    className="flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <div className={`w-5 h-5 flex items-center justify-center mr-2 border ${showPassword ? 'bg-primary border-primary' : 'border-inputborder bg-transparent dark:bg-background'} rounded transition-colors duration-200`}>
                                        {showPassword && <i className="ri-check-line text-xs text-white"></i>}
                                    </div>
                                    <span className="text-dark dark:text-info text-sm">Show Password</span>
                                </div>
                            </div>
                            <div className="mt-6" >
                                <Button variant='primary' type='submit' disabled={loading} className={`cursor-pointer flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white ' : ''}`}>{loading ? <>
                                    <i className="ri-loader-line mr-2 animate-spin"></i>
                                    Updating...
                                </> : 'Update Password'}</Button>
                            </div>
                        </form>
                    </>)}
            </div>
            {/* <!-- Appearance Settings --> */}
            <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 mb-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium text-light dark:text-lightwhite">Appearance</h2>
                    <button className="bg-transparent text-light hover:text-extralightgray dark:hover:text-white cursor-pointer" onClick={() => toggleCollapse('appearance')}>
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className={collapse.appearance ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
                        </div>
                    </button>
                </div>
                {collapse.appearance && (
                    <>
                        <div className="space-y-4 mt-4">
                            <div>
                                <h3 className="font-medium mb-3">Theme</h3>
                                <div className="flex space-x-4">
                                    <Button variant={null} className={`bg-background text-white cursor-pointer transition-all duration-300 ${darkMode ? 'border-2 border-primary' : ''}`} onClick={() => dispatch(toggleDarkMode())}>
                                        Dark
                                    </Button>

                                    <Button variant={null} className={`bg-gray-200 text-gray-800 cursor-pointer transition-all duration-300 rounded-button whitespace-nowrap ${!darkMode ? 'border-2 border-primary' : ''}`} onClick={() => dispatch(toggleDarkMode())}>
                                        Light
                                    </Button>

                                </div>
                            </div>
                            <div className="pt-4">
                                <h3 className="font-medium mb-3">Accent Color</h3>
                                <div className="flex space-x-4">
                                    {colors.map(color => (
                                        <button
                                            key={color.id}
                                            className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${color.code === colorCode ? 'border-2 border-secondary dark:border-white' : 'border border-light'
                                                }`}
                                            style={{ backgroundColor: color.code }}
                                            onClick={() => {
                                                dispatch(setColorCode(color.code));
                                            }}
                                        ></button>
                                    ))}

                                </div>
                            </div>
                            <div className="mt-6">
                                <Button variant="primary" className="cursor-pointer" onClick={changeThemeColor}>Save Appearance</Button>
                            </div>
                        </div>
                    </>
                )}

            </div>

            {/* <!-- User Management Settings --> */}
            <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-6 lg:col-span-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium text-light dark:text-lightwhite">User Management</h2>
                    <button className="bg-transparent text-light hover:text-extralightgray dark:hover:text-white cursor-pointer" onClick={() => toggleCollapse('userManagement')}>
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className={collapse.userManagement ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
                        </div>
                    </button>
                </div>
                {collapse.userManagement && (
                    <>
                        <div className="mb-8 flex justify-end items-center mt-4">
                           
                            {members.length < 3 && <Link to="/team/add-Member">
                                <Button variant='primary' className='cursor-pointer'>
                                    <i className="ri-add-line"></i>
                                    <span>Add User</span>
                                </Button>
                            </Link>}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-light text-sm">
                                        <th className="pb-3 font-medium">Name</th>
                                        <th className="pb-3 font-medium">Email</th>
                                        <th className="pb-3 font-medium">Role</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-info dark:divide-inputborder">
                                    {members.map((member, index) => (
                                        <tr key={index} className="text-sm">
                                            <td className="py-3">{member?.fullName}</td>
                                            <td className="py-3">{member.email}</td>
                                            <td className="py-3">{member.role}</td>
                                            <td className="py-3">
                                                <span className={`bg-green-900 text-success text-xs px-2 py-1 rounded ${member.status === 'Active' ? 'bg-green-900 text-success' : 'bg-yellow-900 text-yellow-300'}`}>{member.status}</span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex space-x-2">
                                                    <Link to={`/team/edit-member/${member.id}`} className="text-blue-400 hover:text-blue-300 cursor-pointer">

                                                        <div className="w-5 h-5 flex items-center justify-center">
                                                            <i className="ri-edit-line"></i>
                                                        </div>
                                                    </Link>
                                                    <button className="text-error hover:text-red-300 cursor-pointer" onClick={() => handleDelete(member.id)}>
                                                        <div className="w-5 h-5 flex items-center justify-center">
                                                            <i className="ri-delete-bin-line"></i>
                                                        </div>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </>
                )}

            </div>

        </>
    )
}

export default Setting