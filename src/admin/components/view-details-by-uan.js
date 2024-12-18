import React, { useEffect, useState } from "react";
import '../../App.css';
import Profile from './profile';
// import * as XLSX from 'xlsx';
import ServiceHistory from './service-history';
import PFPassbook from './passbook';
import { Search, Eye, Download, ArrowLeft } from "react-bootstrap-icons";
import { get } from "../../components/common/api";
import Loader from "../../components/common/loader";
import { useNavigate } from "react-router-dom";
import Claims from "./claims";
import Withdrawability from "./withdrawability";
import { getUanNumber } from "../../components/common/api"

function ViewDetailsByUan() {


    const [value, setValue] = useState("");
    const [currentView, setCurrentView] = useState("parent");
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [uanData, setUanData] = useState(null)
    const [loading, setLoading] = useState(false);
    const [uanList, setUanList] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [loading1, setLoading1] = useState(true);
     // State for search input
  const [searchUAN, setSearchUAN] = useState('');
  // State for filtered result
  const [filteredData, setFilteredData] = useState(uanData?.data);

    const [showUanDetails, setShowUanDetails] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);

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
                    const response = await get(`data/fetchByUan/${uanNuber}`)
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
                const result = await getUanNumber(1, 100);
                if (result.status === 401) {
                    setLoading1(false);
                    localStorage.removeItem('user_uan')
                    localStorage.removeItem('admin_logged_in')
                    navigate('/operation/login');
                } else {
                    setUanList(result.data.data);
                    setSearchList(result?.data?.data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setUanList([null])
            } finally {
                setLoading1(false);
            }
        };
        fetchUanList();

    }, []);

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

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({ ...prev, [name]: value }));
    //     setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    // };
    // const backToAdminLogin = () => {
    //     localStorage.removeItem("admin_logged_in");
    //     navigate('/operation/login');
    // };

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
                {/* <div className="row">
                    <div className="col-md-8 offset-md-2 mt-5">
                        <div className="input-group mt-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                aria-label="Search"
                                maxLength={12}
                            />
                            <button className="btn btn-primary btn-control ms-2 border "
                                onClick={toggleModal}>New Client</button>
                        </div>
                    </div>
                </div> */}
                {showUanDetails ? (
                    currentView === "parent" ? (
                        <div className="row">
                            {/* <div className="col-md-8 offset-md-2 mt-5">
                            <div className="input-group mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    aria-label="Search"
                                    value={value}
                                    maxLength={12}
                                    onChange={handleChange}
                                />
                                <span className="input-group-text">
                                    <Search />
                                </span>
                            </div>
                        </div> */}

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
                                                    {/* <Download size={20} /> */}
                                                </td>
                                                <td className="text-center">
                                                    <Eye size={20} className="me-md-3 me-2 cursor-pointer" onClick={() => setCurrentView("serviceHistory")} />
                                                    {/* <Download size={20} /> */}
                                                </td>
                                                <td className="text-center">
                                                    <Eye size={20} className="me-md-3 me-2 cursor-pointer" />
                                                    {/* <Download size={20} /> */}
                                                </td>
                                                <td className="text-center">
                                                    <Eye size={20} className="me-md-3 me-2 cursor-pointer" onClick={() => setCurrentView("pfpassbook")} />
                                                    {/* <Download size={20} /> */}
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
                                {/* <button className="btn btn-primary btn-control ms-2 border "
                                    onClick={toggleModal}>New Client</button> */}
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

                        </div>
                    </div>
                )}
            </div>

            {/* Model  Content*/}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" aria-hidden={!showModal}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New User</h5>
                            <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row justify-content-center align-items-center">
                                {/* <div class="col-4">
                                    <label for="exampleInput" class="form-label">UAN Number: </label>
                                </div>
                                <div class="col-8">
                                    <input
                                        className="form-control uanNumber mt-2"
                                        type="text"
                                        placeholder="Enter your 12 digit UAN number"
                                        name="uan"
                                        // value={formData.uan}
                                        // onChange={handleInputChange}
                                        maxLength={12}
                                    // required
                                    />
                                </div> */}
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInput" className="form-label">
                                            UAN Number
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Enter your 12 digit UAN number"
                                            name="uan"
                                            // value={formData.uan}
                                            // onChange={handleInputChange}
                                            maxLength={12}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInput" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="exampleInput"
                                            placeholder="Enter text"
                                        />
                                    </div>
                                    <button className="btn btn-primary">Submit</button>
                                </form>
                            </div>

                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={toggleModal}>
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={toggleModal}>
                                Save changes
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewDetailsByUan;