import React, { useEffect, useState } from "react";
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
import ToastMessage from "./../../components/common/toast-message";
import MESSAGES from "./../../components/constants/messages"
import Withdrawability from "./withdrawability";
import { getUanNumber, login } from "../../components/common/api"
import Transfer from "./transfers";
import { useForm } from "react-hook-form";

function ViewDetailsByUan() {
    const otpLength=6;
    const [value, setValue] = useState("");
    const [currentView, setCurrentView] = useState("parent");
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [uanData, setUanData] = useState(null)
    const [loading, setLoading] = useState(false);
    const [uanList, setUanList] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [searchUAN, setSearchUAN] = useState('');
    const [otpValues, setOtpValues] = useState(Array(otpLength).fill(""));
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const [showUanDetails, setShowUanDetails] = useState(false);
    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
    });

    const navigate = useNavigate();
    const handleBackButtonClick = () => {
        setShowUanDetails(false);
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
                        localStorage.removeItem('user_uan')
                        localStorage.removeItem('admin_logged_in');
                        setShowUanDetails(false);
                        navigate('/operation/login');
                    } else {
                        setUanData(response);
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
            try {
                const result = await getUanNumber(currentPage, itemsPerPage);
                if (result.status === 401) {
                    localStorage.removeItem('user_uan')
                    localStorage.removeItem('admin_logged_in')
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

    const handleSearch = (e) => {
        const input = e.target.value;
        setSearchUAN(input);

        if (input.trim() === "") {
            setUanList(uanList);
        } else {
            const result = searchList.filter((item) =>
                item.uan.includes(input.trim())
            );
            setUanList(result);
        }
    };
    const handleOpenFirstModal = () => {
        console.log("open first modal");

        setIsFirstModalOpen(true);
    };

    const handleCloseFirstModal = () => {
        setIsFirstModalOpen(false);
    };

    const handleCloseSecondModal = () => {
        setIsSecondModalOpen(false);
    };
    const onSubmit = async (data) => {
        console.log("form Data", data);
        try {
            setLoading(true);
            const result = await login(data.uan, data.password.trim());
            setIsFirstModalOpen(false);
            setIsSecondModalOpen(true);
            setLoading(false);
            return
            if (result.status === 400) {
                setMessage({ type: "error", content: result.message });
                setTimeout(() => setMessage({ type: "", content: "" }), 2500);
            } else {
                setMessage({ type: "success", content: result.message });
                setTimeout(() => {
                    setMessage({ type: "", content: "" });
                    if (result.message === "User Successfully Verified") {
                        localStorage.setItem("user_uan", data.uan);
                        navigate("/welcome-back", { state: { UAN: data.uan, Pws: data.password } })
                    } else {
                        navigate("/otpAssessment", { state: { UAN: data.uan, Pws: data.password } });
                    }
                }, 2000);
            }
        } catch (error) {
            if (error.status === 401) {
                setLoading(false);
                setMessage({ type: "error", content: MESSAGES.error.invalidEpfoCredentials });
                setTimeout(() => setMessage({ type: "", content: "" }), 3000);
            } if (error.status >= 500) {
                navigate("/epfo-down")
            } else {
                setLoading(false);
                setMessage({ type: "error", content: error.message });
                setTimeout(() => setMessage({ type: "", content: "" }), 3000);
            }
        }

    }

    return (
        <>
            {loading && (
                <Loader
                    type="dots"
                    size="large"
                    color="#28a745"
                    message="Fetching data, please wait..."
                    overlay={true}
                />
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
                                            <tr>
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
                                            </tr>
                                        </tbody>
                                    }
                                    {!uanData && <tbody><tr><td colSpan={6} className="text-center">No Data Found!!</td></tr></tbody>}
                                </table>
                            </div>
                        </div>
                    ) : currentView === "profile" ? (
                        <Profile jsonData={uanData} onBack={() => setCurrentView("parent")} />
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
                                <button type="button" class="btn btn-primary" onClick={handleOpenFirstModal}>
                                    Add User
                                </button>
                            </div>
                            {uanList?.length > 0 ? (
                                uanList?.map((item) => (
                                    <div className="card mb-2">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <p><strong>Name:</strong> {item.fullName}</p>
                                                </div>
                                                <div className="col-md-5">
                                                    <p><strong>UAN Number :</strong>{item.uan}</p>
                                                </div>
                                                <div className="col-md-2 d-flex align-item-center">
                                                    <Eye size={20} onClick={() => handleChange(item?.uan)}
                                                        className="me-md-3 me-2 cursor-pointer" />
                                                </div>
                                                <div className="col-md-5">
                                                    <p><strong>Total Balance :</strong>{item.totalBalance}</p>
                                                </div>
                                                <div className="col-md-5">
                                                    <p><strong>Date :</strong>{new Date(item.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : ""}
                            <nav aria-label="Page navigation example">
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
                            </nav>
                        </div>
                    </div>
                )}
            </div>

            {isFirstModalOpen && (
                <div className="modal fade show" style={{ display: "block" }}
                    tabIndex="-1" role="dialog">
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
                                            <div>
                                                <button className="btn btn-primary" disabled={!isValid} type="submit">Continue</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Model  Content*/}
            {/* <div className="modal fade" id="exampleModal" tabindex="-1"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New User</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                        <div>
                                            <button className="btn btn-primary" disabled={!isValid} type="submit">Continue</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Second Modal */}
            {isSecondModalOpen && (
                <div className="modal fade show" style={{ display: "block" }}
                    tabIndex="-1" role="dialog">
                    {/* <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">New User</h5>
                                <button type="button" className="btn-close" onClick={handleCloseFirstModal} ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row justify-content-center align-items-center">
                                    <div className="col-md-12">
                                            <div className="mb-3">
                                                <label htmlFor="exampleInput" className="form-label">
                                                    Enter your OTP
                                                </label>
                                                <form onSubmit={handleSubmit}>
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
                                                        {timer > 1 ? <p className='text-danger mb-0'>OTP expires in {timer} seconds.</p>
                                                            : <p className='text-danger mb-0'>OTP expired</p>}
                                                        <a
                                                            className="text-decoration-none labelSubHeading float-end mt-2"
                                                            style={{ cursor: "pointer" }} onClick={handleRendOtpClick}>
                                                            Resend OTP
                                                        </a>
                                                    </div>

                                                    <div className='text-center mt-5'>
                                                        <button className="pfRiskButtons py-2 px-5">
                                                            Verify Number
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            )}
        </>
    );
}

export default ViewDetailsByUan;