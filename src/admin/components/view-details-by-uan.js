import React, { useEffect, useState, useMemo } from "react";
import '../../App.css';
import Profile from './profile';
// import * as XLSX from 'xlsx';
import ServiceHistory from './service-history';
import PFPassbook from './passbook';
import { Eye, ArrowLeft } from "react-bootstrap-icons";
import { get } from "../../components/common/api";
import Loader from "../../components/common/loader";
import { useNavigate } from "react-router-dom";
import Claims from "./claims";
import MESSAGES from "./../../components/constants/messages";
import Withdrawability from "./withdrawability";
import { getUanNumber, login, post } from "../../components/common/api"
import Transfer from "./transfers";
import { useForm } from "react-hook-form";
import debounce from "lodash.debounce";
import { ExtractMobile } from "../../components/common/extract-mobile";
import { encryptData } from "../../components/common/encryption-decryption";


function ViewDetailsByUan() {
    const otpLength = 6;
    const [value, setValue] = useState("");
    const [currentView, setCurrentView] = useState("parent");
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [uanData, setUanData] = useState(null)
    const [profileData, setUserProfileData] = useState(null)
    const [loading, setLoading] = useState(false);
    const [uanList, setUanList] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [searchUAN, setSearchUAN] = useState('');
    const [otpValues, setOtpValues] = useState(Array(otpLength).fill(""));
    const [timer, setTimer] = useState(45);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;
    const [showUanDetails, setShowUanDetails] = useState(false);
    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loaderText, setLoaderText] = useState("Fetching Data, Please wait...");
    const [showMessage, setShowMessage] = useState('');
    const isBtnAssessmentEnabled = otpValues.every((field) => field !== "");
    const [hideOtpExpireTimer, sethideOtpExpireTimer] = useState(false);
    const [showBlur, setShowBlur] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: { uan: "", password: "" },
        shouldUnregister: true,
    });

    const navigate = useNavigate();
    const handleBackButtonClick = () => {
        setShowUanDetails(false);
    };

    React.useEffect(() => {
        let interval;
        if (isSecondModalOpen && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval); // Cleanup on component unmount or re-render
    }, [isSecondModalOpen, timer]);

    const handleOtpChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value.slice(-1);
        setOtpValues(newOtpValues);
        if (value && index < otpLength - 1) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    const handleChange = (uanNuber) => {
        if (/^\d*$/.test(uanNuber)) {
            setValue(uanNuber);
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            setShowUanDetails(true);
            const timeout = setTimeout(async () => {
                setLoading(true);
                try {
                    const response = await get(`/admin/data/${uanNuber}`)

                    if (response.status === 401) {
                        setLoading(false);
                        localStorage.clear()
                        setShowUanDetails(false);
                        navigate('/operation/login');
                    }
                    else {
                        setUanData(response.rawData);
                        setUserProfileData(response.profileData)
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setUanData(null)
                } finally {
                    setLoading(false); // Stop showing the loading screen
                }
            }, 0);
            setTypingTimeout(timeout);
        }
    };

    useEffect(() => {
        const fetchUanList = async () => {
            const search = ''
            try {
                const result = await getUanNumber(currentPage, itemsPerPage, search);
                if (result.status === 401) {
                    localStorage.clear()
                    navigate('/operation/login');
                } else {
                    setUanList(result.data.data);
                    setSearchList(result?.data?.data);
                    setTotalItems(result?.data?.totalCount)
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setUanList([null])
            } finally {
            }
        };
        fetchUanList();

    }, [currentPage]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const getVisiblePages = () => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage === 1) {
            return [1, 2, 3];
        } else if (currentPage === totalPages) {
            return [totalPages - 2, totalPages - 1, totalPages];
        } else {
            return [currentPage - 1, currentPage, currentPage + 1];
        }
    };

    const visiblePages = getVisiblePages();

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchSearchResults = async (input) => {
        const result = await getUanNumber(currentPage, itemsPerPage, input);
        if (input === "") {
            setUanList(result?.data?.data);
        } else {
            try {
                // const response = await get(`/admin/data/${input}`);
                // const response_error = response?.rawData?.data;  
                // if (response_error?.error && response_error.error.trim() !== "") { 
                //     if (response_error.error === "Please change the password") {
                //         setUanList([{ uan: input, error: response_error.error }]); 
                //         return; // Stop further execution
                //     }
                // }

                // Fetch UAN number data


                if (result.status === 401) {
                    localStorage.clear();
                    navigate('/operation/login');
                }
                else {
                    setUanList(result?.data?.data);
                    setSearchList(result?.data?.data);
                    setTotalItems(result?.data?.totalCount);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setUanList([{ uan: input, error: "Data found, but unable to retrieve details due to a server issue." }]);
            }
        }
    };

    const debouncedFetch = useMemo(() => debounce(fetchSearchResults, 1000), []);

    const handleSearch = async (e) => {
        const input = e.target.value.trim();
        setSearchUAN(input);
        debouncedFetch(input);
    };

    // Cleanup debounce when component unmounts
    React.useEffect(() => {
        return () => {
            debouncedFetch.cancel();
        };
    }, [debouncedFetch]);

    const handleOpenFirstModal = () => {
        setIsFirstModalOpen(true);
        setShowBlur(true);
        setTimeout(() => {
            reset({ uan: "", password: "" });
            setShowMessage("");
        }, 0);
    };
    useEffect(() => {
        if (!isFirstModalOpen) {
            reset({ uan: "", password: "" });
            setShowMessage("");
        }
    }, [isFirstModalOpen, reset]);

    const handleCloseFirstModal = () => {
        setIsFirstModalOpen(false);
        setShowBlur(false)
    };

    const handleCloseSecondModal = () => {
        setIsSecondModalOpen(false);
        sethideOtpExpireTimer(false);
        setShowBlur(false)
    };

    const handleRendOtpClick = async () => {
        if (formData) {
            await onSubmit(formData);
            sethideOtpExpireTimer(true);
            setTimer(45);
        }
    };
    const otpSubmit = async (e) => {
        setLoaderText("Please wait...verifying OTP");
        setShowMessage("");
        if (otpValues.every((digit) => digit)) {
            try {
                const endpoint = "auth/submit-otp"
                setLoading(true);
                const result = await post(endpoint, { otp: otpValues.join('') });
                if (result.status === 400) {
                    setLoading(false);
                    setShowMessage(result.message);
                    setOtpValues(Array(6).fill(""));
                    sethideOtpExpireTimer(false);
                    setTimeout(() => {
                        setIsSecondModalOpen(false);
                        setShowBlur(false);
                    }, 5000);
                } else {
                    setLoading(false);
                    setShowMessage(MESSAGES.success.otpVerified);
                    setOtpValues(Array(6).fill(""));
                    sethideOtpExpireTimer(false);
                    setTimeout(() => {
                        setIsSecondModalOpen(false);
                        setShowBlur(false);
                    }, 5000);
                }

            } catch (error) {
                setLoading(false);
                setShowMessage(error.message || MESSAGES.error.generic);
                setOtpValues(Array(6).fill(""));
                sethideOtpExpireTimer(false);
                setTimeout(() => {
                    setIsSecondModalOpen(false);
                    setShowBlur(false);
                }, 5000);
            }
        } else {
            setShowMessage(MESSAGES.error.invalidOtp);
            setOtpValues(Array(6).fill(""));
            sethideOtpExpireTimer(false);
            setTimeout(() => {
                setIsSecondModalOpen(false);
                setShowBlur(false);
            }, 5000);
        }

    }
    const onSubmit = async (data) => {
        setLoaderText("Please wait...checking credentials");
        setShowMessage("");
        
        try {
            setLoading(true);
            const result = await login(data.uan, data.password.trim());
            if (result.status === 400) {
                setLoading(false);
                setShowMessage(result.message);
                sethideOtpExpireTimer(false);
                setTimeout(() => {
                    setIsFirstModalOpen(false);
                    setIsSecondModalOpen(false);
                    setShowBlur(false);
                }, 5000);
            } else {
                if (result.message === "User Successfully Verified") {
                    setLoading(false);
                    setShowMessage('User Successfully Verified');
                    setTimeout(() => {
                        setIsFirstModalOpen(false);
                        setIsSecondModalOpen(false);
                        setShowBlur(false);
                    }, 5000);
                } else {
                    const regMobileNumber = ExtractMobile(result.message);
                    setLoading(false);
                    setIsFirstModalOpen(false);
                    setIsSecondModalOpen(true);
                    setShowBlur(true);
                    setTimer(45);
                    setOtpValues(Array(6).fill(""));
                    sethideOtpExpireTimer(true);
                }
                setFormData(data);
            }
        } catch (error) {
            if (error.status === 401) {
                setLoading(false);
                setShowMessage(MESSAGES.error.invalidEpfoCredentials);
                setTimeout(() => {
                    setIsFirstModalOpen(false);
                    setIsSecondModalOpen(false);
                    setShowBlur(false);
                }, 5000);
                sethideOtpExpireTimer(false);
            } if (error.status >= 500) {
                navigate("/epfo-down");
                setIsFirstModalOpen(false);
                setIsSecondModalOpen(false);
                setShowBlur(false);
            } else {
                setLoading(false);
                setTimeout(() => {
                    setIsFirstModalOpen(false);
                    setIsSecondModalOpen(false);
                    setShowBlur(false)
                }, 5000);
                setShowMessage(error.message);
                sethideOtpExpireTimer(false)
            }
        }

    }


    return (
        <>
            {/* {loading && (
                <Loader
                    type="dots"
                    size="large"
                    color="#28a745"
                    message="Fetching data, please wait..."
                    overlay={true}
                />
            )} */}
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-container">
                        <div className='loader'></div>
                        <p className="loader-text mt-5">{loaderText}</p>
                    </div>
                </div>
                // <div className='loader'></div>
            )}
            <div className="container">
                {showUanDetails ? (
                    currentView === "parent" ? (
                        <div className="row">
                            <div className="col-md-10 offset-md-1 mt-5">
                                <button className="btn p-0 d-flex align-items-center my-3" onClick={handleBackButtonClick}>
                                    <ArrowLeft size={20} className="me-1" /> Back
                                </button>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Profile</th>
                                            <th className="text-center">Service History</th>
                                            <th className="text-center">Transfers</th>
                                            <th className="text-center">Passbook</th>
                                            <th className="text-center">Claims</th>
                                            <th className="text-center">Withdrawability Report</th>
                                        </tr>
                                    </thead>
                                    {uanData &&
                                        <tbody>
                                            {uanData.error ? <p className="text-danger text-center">Please change the password"</p>
                                                : <tr>
                                                    <td className="text-center">
                                                        <Eye size={20} onClick={() => setCurrentView("profile")}
                                                            className="me-md-3 me-2 cursor-pointer" />
                                                    </td>
                                                    <td className="text-center">
                                                        <Eye size={20} className="me-md-3 me-2 cursor-pointer" onClick={() => setCurrentView("serviceHistory")} />
                                                    </td>
                                                    <td className="text-center">
                                                        <Eye size={20} className="me-md-3 me-2 cursor-pointer" onClick={() => setCurrentView("transfer")} />
                                                    </td>
                                                    <td className="text-center">
                                                        <Eye size={20} className="me-md-3 me-2 cursor-pointer" onClick={() => setCurrentView("pfpassbook")} />
                                                    </td>
                                                    <td className="text-center">
                                                        <Eye size={20} className="me-md-3 me-2 cursor-pointer" onClick={() => setCurrentView("claims")} />
                                                    </td>
                                                    <td className="text-center">
                                                        <Eye size={20} className="me-md-3 me-2 cursor-pointer" onClick={() => setCurrentView("withdraw")} />
                                                    </td>
                                                </tr>}

                                        </tbody>
                                    }
                                    {!uanData && <tbody><tr><td colSpan={6} className="text-center">No Data Found!!</td></tr></tbody>}
                                </table>
                            </div>
                        </div>
                    ) : currentView === "profile" ? (
                        <Profile jsonData={uanData} profileData={profileData} onBack={() => setCurrentView("parent")} />
                    ) : currentView === "serviceHistory" ? (
                        <ServiceHistory jsonData={uanData} onBack={() => setCurrentView("parent")} />
                    ) : currentView === "pfpassbook" ? (
                        <PFPassbook jsonData={uanData} onBack={() => setCurrentView("parent")} />
                    ) : currentView === "claims" ? (
                        <Claims jsonData={uanData} onBack={() => setCurrentView("parent")} />
                    ) : currentView === "withdraw" ? (
                        <Withdrawability jsonData={uanData} onBack={() => setCurrentView("parent")} />
                    ) : currentView === "transfer" ? (
                        <Transfer uan={value} onBack={() => setCurrentView("parent")} />
                    ) : null

                ) : (
                    <div className="row">
                        <div className="col-md-8 offset-md-2 mt-5">
                            <div className="input-group my-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    aria-label="Search"
                                    maxLength={12}
                                    value={searchUAN}
                                    onChange={handleSearch}
                                />
                                <button type="button" className="btn btn-primary" onClick={handleOpenFirstModal}>
                                    Add User
                                </button>
                            </div>
                            {uanList?.length > 0 ? (
                                uanList?.map((item, index) => (
                                    <div className="card mb-2" key={index}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <p><strong>UAN Number :</strong> {item?.uan}</p>
                                                </div>
                                                {item?.error ? (
                                                    <div className="col-md-12">
                                                        <p className="text-danger"><strong>Error:</strong> {item?.error}</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="col-md-5">
                                                            <p><strong>Name:</strong> {item?.fullName}</p>
                                                        </div>
                                                        <div className="col-md-2 d-flex align-item-center">
                                                            <Eye size={20} onClick={() => handleChange(item?.uan)}
                                                                className="me-md-3 me-2 cursor-pointer" />
                                                        </div>
                                                        <div className="col-md-5">
                                                            <p><strong>Total Balance :</strong> {item?.totalBalance}</p>
                                                        </div>
                                                        <div className="col-md-5">
                                                            <p><strong>Date :</strong> {new Date(item?.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) :
                                <table className="table table-hover">
                                    <tbody><tr><td className="text-center">No Data Found!!</td></tr></tbody>
                                </table>
                            }
                            {uanList?.length > 9 ? <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-end">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {visiblePages.map((page) => (
                                        <li
                                            key={page}
                                            className={`page-item ${currentPage === page ? "active" : ""}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ))}

                                    <li
                                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}>
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav> : ""}

                        </div>
                    </div>
                )}
            </div>

            {showBlur && <div className={`custom-modal-overlay ${isFirstModalOpen ? "active" : ""}`} />}

            {isFirstModalOpen && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">New User</h5>
                                <button type="button" className="btn-close" onClick={handleCloseFirstModal} ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row justify-content-center align-items-center">
                                    <div className="col-md-12">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInput" className="form-label">
                                                    UAN Number
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    autoComplete="off"
                                                    placeholder="Enter your 12 digit UAN number"
                                                    name="uan"
                                                    maxLength={12}
                                                    required
                                                    {...register("uan", {
                                                        required: "UAN number is required",
                                                        pattern: {
                                                            value: /^\d{12}$/,
                                                            message: "Number must be exactly 12 digits",
                                                        }
                                                    })}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                    }}
                                                />
                                                {errors.uan && <span className="text-danger">{errors.uan.message}</span>}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInput" className="form-label">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="exampleInput"
                                                    name="password"
                                                    autoComplete="off"
                                                    placeholder="Enter password"
                                                    {...register("password", {
                                                        required: "Password is required.",
                                                        minLength: {
                                                            value: 8,
                                                            message: "Password must be at least 8 characters long.",
                                                        },
                                                        validate: {
                                                            upperCase: (value) =>
                                                                /[A-Z]/.test(value) || "Password must contain at least one uppercase letter.",
                                                            lowerCase: (value) =>
                                                                /[a-z]/.test(value) || "Password must contain at least one lowercase letter.",
                                                            specialCharacter: (value) =>
                                                                /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                                                                "Password must contain at least one special character.",
                                                        },
                                                    })}
                                                />
                                                {errors.password && <span className="text-danger">{errors.password.message}</span>}
                                            </div>
                                            <div className='text-center mt-5'>
                                                <button className="pfRiskButtons py-2 px-5" disabled={!isValid} type="submit">Continue</button>
                                            </div>
                                        </form>

                                        <p className="text-center text-danger mt-3">
                                            {showMessage === 'User Successfully Verified' ? <span>This User Already Exist</span> : showMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {/* {isFirstModalOpen && (
                <div
                    className="modal fade show" style={{ display: "block" }}
                    tabIndex="-1" role="dialog"

                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">New User</h5>
                                <button type="button" className="btn-close" onClick={handleCloseFirstModal} ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row justify-content-center align-items-center">
                                    <div className="col-md-12">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInput" className="form-label">
                                                    UAN Number
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    autoComplete="off"
                                                    placeholder="Enter your 12 digit UAN number"
                                                    name="uan"
                                                    maxLength={12}
                                                    required
                                                    {...register("uan", {
                                                        required: "UAN number is required",
                                                        pattern: {
                                                            value: /^\d{12}$/,
                                                            message: "Number must be exactly 12 digits",
                                                        }
                                                    })}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                    }}
                                                />
                                                {errors.uan && <span className="text-danger">{errors.uan.message}</span>}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInput" className="form-label">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="exampleInput"
                                                    name="password"
                                                    autoComplete="off"
                                                    placeholder="Enter password"
                                                    {...register("password", {
                                                        required: "Password is required.",
                                                        minLength: {
                                                            value: 8,
                                                            message: "Password must be at least 8 characters long.",
                                                        },
                                                        validate: {
                                                            upperCase: (value) =>
                                                                /[A-Z]/.test(value) || "Password must contain at least one uppercase letter.",
                                                            lowerCase: (value) =>
                                                                /[a-z]/.test(value) || "Password must contain at least one lowercase letter.",
                                                            specialCharacter: (value) =>
                                                                /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                                                                "Password must contain at least one special character.",
                                                        },
                                                    })}
                                                />
                                                {errors.password && <span className="text-danger">{errors.password.message}</span>}
                                            </div>
                                            <div className='text-center mt-5'>
                                                <button className="pfRiskButtons py-2 px-5" disabled={!isValid} type="submit">Continue</button>
                                            </div>
                                        </form>

                                        <p className="text-center text-danger mt-3">
                                            {showMessage === 'User Successfully Verified' ? <span>This User Already Exist</span> : showMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Second Modal */}
            {showBlur && <div className={`custom-modal-overlay ${isSecondModalOpen ? "active" : ""}`} />}
            {isSecondModalOpen && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">OTP Verification</h5>
                                <button type="button" className="btn-close" onClick={handleCloseSecondModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="otpLabel mt-2 mt-lg-5 pt-lg-5">
                                    Enter OTP sent to your EPF registered number
                                </div>
                                <form onSubmit={handleSubmit(otpSubmit)}>
                                    <div className="d-flex">
                                        {Array.from({ length: otpLength }).map((_, index) => (
                                            <input
                                                key={index}
                                                id={`otp-input-${index}`}
                                                type="text"
                                                maxLength="1"
                                                autoComplete='off'
                                                name='otp'
                                                className="otpInput form-control text-center mx-1 mt-2"
                                                value={otpValues[index]}
                                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                                onKeyDown={(e) => handleBackspace(e, index)}
                                                aria-label={`OTP input ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <p
                                            className="text-danger mb-0"
                                            style={{ visibility: hideOtpExpireTimer ? "visible" : "hidden" }}>
                                            {timer > 0 ? `OTP expires in ${timer} seconds.` : "OTP expired"}
                                        </p>
                                        <a
                                            className="text-decoration-none labelSubHeading float-end mt-2"
                                            style={{ cursor: "pointer" }} onClick={handleRendOtpClick}>
                                            Resend OTP
                                        </a>
                                    </div>

                                    <div className='text-center mt-5'>
                                        <button className="pfRiskButtons py-2 px-5"
                                        // disabled={!isBtnAssessmentEnabled || timer < 1}
                                        >
                                            Verify Number
                                        </button>
                                    </div>
                                </form>
                                <p className="text-center mt-3">
                                    {showMessage === 'User Successfully Verified' ? 'This User Already Exist' : showMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ViewDetailsByUan;