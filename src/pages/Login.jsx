// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import Button from '../components/reusableComp/Button';
import Input from '../components/reusableComp/Input';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/async/authAsync';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Login = () => {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.auth)
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
        rememberMe: Yup.boolean()
    });
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (value, { resetForm }) => {
            const result = await dispatch(loginUser(value));

            if (loginUser.fulfilled.match(result)) {
                if (result.payload?.status === 1) {
                    toast.success(result.payload.message || 'Login successful');
                    localStorage.setItem('user', JSON.stringify(user));
                    if (result.payload.result.role === 'Admin') {
                        navigate('/dashboard')
                    }
                    resetForm();
                } else {
                    toast.error(result.payload.message || 'Something went wrong');
                }
            } else {
                toast.error(result.payload || 'Login failed');
            }
        }
    })
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">

            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('./loginbg.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            </div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A572]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C5A572]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            {/* Login card */}
            <div className="w-full max-w-md relative z-10 transform transition-all duration-700 ">
                {/* Logo and header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="text-[#C5A572] mb-4 animate-fadeIn">
                        <div className="flex items-center">
                            <div className="w-auto h-12 ">
                                <img src="/Knot_Logo.png" alt="Knot Logo" className="w-full h-full object-contain" />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-lightwhite text-xl font-light">Welcome to Knot Delhi Admin</h2>
                </div>
                {/* Login form */}
                <div className="bg-foreground dark:bg-secondary backdrop-blur-md rounded-lg shadow-[0_0_50px_rgba(197,165,114,0.1)] p-8 border border-lightborder dark:border-[#C5A572]/20">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-dark dark:text-info text-sm font-medium mb-2">
                                Email
                            </label>

                            <Input
                                id="email"
                                type="text"
                                icon={"ri-user-3-line"}
                                placeholder="Enter your email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-error text-xs mt-1">{formik.errors.email}</div>
                            )}

                        </div>
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="block text-dark dark:text-info text-sm font-medium">
                                    Password
                                </label>
                                <Link to="/forget-password" className="text-light dark:text-info text-sm hover:text-dark dark:hover:text-lightwhite hover:underline transition-all duration-300">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    icon={"ri-lock-line"}
                                    placeholder="••••••••••"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-light hover:text-dark dark:hover:text-white"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={` ${showPassword ? 'ri-eye-line' : 'ri-eye-off-line'}`}></i>
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <div className="text-error text-xs mt-1">{formik.errors.password}</div>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className={`w-full cursor-pointer flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white ' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <i className="ri-loader-line mr-2 animate-spin"></i>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </form>
                </div>
                <div className="mt-6 text-center text-light text-sm">
                    © {new Date().getFullYear()} Knot Delhi. All rights reserved.
                </div>
            </div>
        </div>
    );
};
export default Login