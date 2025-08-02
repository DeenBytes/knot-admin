import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Input from '../components/reusableComp/Input';
import Button from '../components/reusableComp/Button';
import OTPInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, sendEmailOtp } from '../redux/async/authAsync';
import { toast } from 'react-toastify';
import { apiJson } from '../api';

const ForgetPass = () => {
    const { loading } = useSelector(state => state.auth)
    const [step, setStep] = useState(1);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [wrongOtp, setWrongOtp] = useState(false)
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [toggele, setToggele] = useState({
        password: false,
        conformPassword: false
    })

    const handleTogglePass = (item) => {
        setToggele({
            ...toggele,
            [item]: !toggele[item]
        })
    }

    useEffect(() => {
        if (step === 2 && timeLeft === 0) {
            setTimeLeft(120);
        }
    }, [step]);

    useEffect(() => {
        if (step !== 2 || timeLeft === 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, step]);

    // Helper function to format time in mm:ss
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `0${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // =============== user details validation ============
    const userValidation = Yup.object({
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email address'),
    });
    const step3Validation = Yup.object({
        newPassword: Yup.string()
            .required('Password is required')
            .matches(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])(?=.{6,})/,
                'Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
            ),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('newPassword'), null], 'Passwords does not match.'),
    });
    const validationSchema = step === 1 ? userValidation : step === 3 ? step3Validation : null;
    //=========== Function for send the email otp =========== \\
    const emailOtpSend = async (data) => {
        const result = await dispatch(sendEmailOtp(data));
        if (sendEmailOtp.fulfilled.match(result)) {
            if (result.payload.status === 1) {
                toast.success(result.payload.message || 'Email sent successfully');
                setStep(2);
            } else {
                toast.error(result.payload.message || 'Something went wrong');
            }
        } else {

            toast.error(result.payload || 'Email send failed');
        }
    }

    // =========== Function for otp verifacition ============ \\
    const otpVerify = async (e) => {
        e.preventDefault();
        let data = {
            email: formik?.values?.email,
            otp: otp,
        }

        try {
            const res = await apiJson.post("/api/Admin/adminOtpVerify", data);
            if (res?.status === 200) {
                setWrongOtp(false);
                setStep(3);
                formik.setTouched({
                    newPassword: false,
                    conformPassword: false
                });
                toast.success(res?.data?.message);
            }
            setOtpLoading(false);
        } catch (error) {
            setWrongOtp(true);
            setOtpLoading(false);
            toast.error(error?.response?.data?.message ? error?.response?.data?.message : "Invalid code");
        }
    };
    //========= Function to reset the password ========== \\

    const resetPassword = async (values) => {
        const data = {
            email: formik?.values?.email,
            newPassword: values?.newPassword,
            confirmPassword: values?.confirmPassword
        }
        const result = await dispatch(changePassword(data));
        if (changePassword.fulfilled.match(result)) {
            if (result.payload.status === 1) {
                toast.success(result.payload.message || 'Password changed successfully');
                setStep(4);
                setAnimate(true);
            } else {
                toast.error(result.payload.message || 'Something went wrong');
                setAnimate(false);
            }
        } else {
            setAnimate(false);
            toast.error(result.payload || 'Failed to change password.');
        }
    }

    // ========== function for submit the formik form data =========

    const onSubmit = async (values) => {
        if (step === 1) {
            emailOtpSend({ email: values?.email });
        } else if (step === 3) {
            resetPassword(values)
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            newPassword: '',
            confirmPassword: '',
            step: step, // Add step to values
        },
        validationSchema,
        onSubmit,
    });

    const RenderstepForget = (step) => {
        // step 1 : Email Enter Feild
        // step 2 : Otp Verification
        // step 3 : New Password
        // step 4 : Password Change successfull

        switch (step) {
            case 1:
                return (
                    <>
                        <div className="">
                            <h1 className='mb-4 text-4xl font-semibold text-dark dark:text-lightwhite '>Forget password</h1>
                            <p className='mb-4 font-normal text-light'>Enter your email for the verification process, we will send 4 digit code to your email. </p>
                            <form onSubmit={formik?.handleSubmit}>
                                <div className="mt-1 md:mt-3 mb-2 md:mb-4">
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
                                <div className='mt-6'>

                                    <Button
                                        variant='primary'
                                        disabled={loading}
                                        type="submit"
                                        className={`w-full cursor-pointer flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white ' : ''}`}
                                    >
                                        {loading ? (
                                            <>
                                                <i className="ri-loader-line mr-2 animate-spin"></i>
                                                Sending..
                                            </>
                                        ) : (
                                            'Continue'
                                        )}
                                    </Button>

                                </div>
                            </form >
                        </div >
                    </>
                )

            case 2:
                return (
                    <>
                        <div className="">
                            <i className="ri-arrow-left-line text-dark dark:text-info cursor-pointer mb-3" onClick={() => setStep(1)}></i>
                            <h1 className='text-4xl mb-2 font-semibold text-dark dark:text-lightwhite'>Verification</h1>
                            <p className='mb-2 md:mb-4 font-normal text-light'>Enter your 4 digits code that you received on your email</p>
                            <label className="font-medium fs-6 mb-2 block mt-4 text-dark dark:text-info  md:mb-4">Enter 4 digit code</label>
                            <form onSubmit={otpVerify}>
                                <div className="mt-1 lg:mt-3">

                                    <OTPInput
                                        value={otp}
                                        onChange={(value) => {
                                            setOtp(value);
                                            setWrongOtp(false);
                                        }}
                                        numInputs={4}
                                        renderSeparator={<span className='otpSepaBx spanColor'></span>}
                                        renderInput={(props) => (
                                            <input
                                                {...props}
                                                type="number"
                                                className={`bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite placeholder-light dark:placeholder-lightwhite  rounded-md py-3 pl-5 pr-5 transition-colors duration-200 ease-in-out focus:outline-none  otp-input ${wrongOtp ? "wrong-otp" : ""}`}
                                            />
                                        )}
                                    />

                                    <div className="flex justify-center mt-5" >
                                        <span className="text-sm text-error">Time Left : {formatTime(timeLeft)}</span>
                                    </div>

                                    <div className='mt-8'>
                                        <Button
                                            variant='primary'
                                            disabled={otpLoading}
                                            type="submit"
                                            className={`w-full cursor-pointer flex items-center justify-center ${otpLoading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white ' : ''}`}
                                        >
                                            {otpLoading ? (
                                                <>
                                                    <i className="ri-loader-line mr-2 animate-spin"></i>
                                                    Sending
                                                </>
                                            ) : (
                                                'Continue'
                                            )}
                                        </Button>
                                    </div>
                                    <div htmlFor="resend" className='text-center mt-3 text-light text-md font-medium'>If you didn’t receive a code! <span className='cursor-pointer underline text-primary ' onClick={() => {

                                        emailOtpSend({ email: formik?.values?.email });    // Call the emailOtpSend function
                                        setTimeLeft(120);
                                    }}>Resend</span></div>

                                </div>
                            </form>
                        </div>
                    </>
                )
            case 3:
                return (
                    <>
                        <div className='pt-6'>
                            <h1 className='mb-4 text-4xl font-semibold text-dark dark:text-lightwhite pt-2'>New password</h1>
                            <p className='mb-1 md:mb-4 font-normal  text-light'>Set the new password for your account so you can login and access all features.</p>
                            <form onSubmit={formik.handleSubmit} >
                                <div className="mt-3 lg:mt-3">

                                    <div>
                                        <label htmlFor="newPassword" className="block text-dark dark:text-info text-sm font-medium mb-2">
                                            New Password
                                        </label>

                                        <Input
                                            id="newPassword"
                                            name='newPassword'
                                            placeholder="Enter Password"
                                            type={toggele.password ? "text" : "password"}
                                            onChange={formik?.handleChange} />
                                        {
                                            toggele.password ? (
                                                <div className='relative text-end inline-block bottom-9 left-[88%] text-light'>
                                                    <i className="ri-eye-fill cursor-pointer" onClick={() => handleTogglePass("password")}></i>

                                                </div>) : (
                                                <div className='relative text-end inline-block bottom-9 left-[88%] text-light'>
                                                    <i className="ri-eye-off-fill cursor-pointer" onClick={() => handleTogglePass("password")}></i>
                                                </div>)
                                        }


                                        {formik.errors?.newPassword && formik.touched?.newPassword ? (
                                            <div className="text-error mt-0 md:mt-1 text-xs inline-block">{formik.errors?.newPassword}</div>
                                        ) : (null)}

                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-dark dark:text-info text-sm font-medium mb-2">Confirm Password</label>

                                        <Input
                                            name='confirmPassword'
                                            placeholder="Confirm Password"
                                            id="confirmPassword"
                                            type={toggele.conformPassword ? "text" : "password"}
                                            onChange={formik.handleChange} />
                                        {
                                            toggele.conformPassword ? (
                                                <div className='relative text-end inline-block bottom-9 left-[88%] text-light'>
                                                    <i className="ri-eye-fill cursor-pointer" onClick={() => handleTogglePass("conformPassword")}></i>
                                                </div>) : (

                                                <div className='relative text-end inline-block bottom-9 left-[88%] text-light'>
                                                    <i className="ri-eye-off-fill cursor-pointer" onClick={() => handleTogglePass("conformPassword")}></i>

                                                </div>)
                                        }

                                        {formik.errors?.confirmPassword && formik.touched?.confirmPassword ? (
                                            <div className="text-error mt-0 md:mt-1 text-xs inline-block">{formik.errors?.confirmPassword}</div>
                                        ) : (null)}
                                    </div>

                                    <div className='mt-2'>

                                        <Button
                                            variant='primary'
                                            type="submit"
                                            className={`w-full cursor-pointer flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed text-dark border border-dark dark:border-white dark:text-white ' : ''}`}
                                        >
                                            {loading ? (
                                                <>
                                                    <i className="ri-loader-line mr-2 animate-spin"></i>
                                                    Updating...
                                                </>
                                            ) : (
                                                'Continue'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </>
                )
            case 4:
                return (
                    <>
                        <div className='flex justify-center items-center flex-col'>

                            <span className={`relative flex items-center justify-center ${animate ? 'animate' : ''}`}>
                                <i className="ri-checkbox-circle-fill icon text-4xl text-success"></i>
                            </span>
                            <h1 className='text-3xl font-medium mt-4 text-dark dark:text-lightwhite'>Successfully</h1>
                            <h6 className='font-normal  text-center  mt-3 text-light dark:text-info' >Your Password has been reset successfully</h6>
                            <Button variant="primary" className='mt-4 w-full cursor-pointer' onClick={() => navigate("/")}
                            >Continue</Button>

                        </div>
                    </>
                )
            default:
                return null;
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen p-2">
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
            <div className="relative flex items-center justify-center max-w-md bg-foreground dark:bg-secondary backdrop-blur-md rounded-lg shadow-[0_0_50px_rgba(197,165,114,0.1)] p-8 border border-lightborder dark:border-[#C5A572]/20 overflow-auto hide-scrollbar">
                {RenderstepForget(step)}
            </div>
        </div>
    )
}

export default ForgetPass