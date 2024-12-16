import React, { useState } from "react";
import '../../App.css';
import Profile from './profile';
// import * as XLSX from 'xlsx';
import ServiceHistory from './service-history';
import PFPassbook from './passbook';
import { Search, Eye, Download, ArrowLeft } from "react-bootstrap-icons";
import { get } from "../../components/common/api";
import Loader from "../../components/common/loader";
import { useNavigate } from "react-router-dom";
import Claims  from "./claims";
import Withdrawability from "./withdrawability ";

function ViewDetailsByUan() {
    

    const [value, setValue] = useState("");
    const [currentView, setCurrentView] = useState("parent");
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [uanData, setUanData] = useState(null)
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    
    const handleChange = (e) => {
        const inputValue = e.target.value;

        // Allow only numbers and prevent leading zeros
        if (/^\d*$/.test(inputValue)) {
            setValue(inputValue);

            // Clear the previous timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            // Set a new timeout to call the API after 1 second of no typing
            const timeout = setTimeout(async () => {
                setLoading(true);
                try {
                    const response = await get(`data/fetchByUan/${inputValue}`)
                    if (response.status === 401) {
                        setLoading(false);
                        localStorage.clear()
                        navigate('/operation/login');
                    } else {
                        setUanData(response)
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setUanData(null)
                } finally {
                    setLoading(false); // Stop showing the loading screen
                }
            }, 1000);

            setTypingTimeout(timeout);
        }
    };

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
            <div className="row">
                <div className="col d-flex justify-content-end">
                    {/* <button className="btn me-2" onClick={() => navigate("/")}>
                        <ArrowLeft size={17} className="me-1" /> Back to Assessment</button>
                    <button className="btn me-3" onClick={backToAdminLogin}
                        style={{ cursor: 'pointer' }}>Logout</button> */}
                </div>
            </div>
            <div className="container">

                {currentView === "parent" ? (
                    <div className="row">
                        <div className="col-md-8 offset-md-2 mt-5">
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
                        </div>

                        <div className="col-md-10 offset-md-1 mt-5">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className="text-center">Profile</th>
                                        <th className="text-center">Service History</th>
                                        <th className="text-center">Transfers</th>
                                        <th className="text-center">Passbook</th>
                                        <th className="text-center">Claims</th>
                                        <th className="text-center">Withdrawability </th>
                                    </tr>
                                </thead>
                                {uanData && 
                                <tbody>
                                    <tr>
                                        <td className="text-center">
                                            <Eye size={20} onClick={() => setCurrentView("profile")}
                                                className="me-md-3 me-2" />
                                            {/* <Download size={20} /> */}
                                        </td>
                                        <td className="text-center">
                                            <Eye size={20} className="me-md-3 me-2" onClick={() => setCurrentView("serviceHistory")} />
                                            {/* <Download size={20} /> */}
                                        </td>
                                        <td className="text-center">
                                            <Eye size={20} className="me-md-3 me-2" />
                                            {/* <Download size={20} /> */}
                                        </td>
                                        <td className="text-center">
                                            <Eye size={20} className="me-md-3 me-2" onClick={() => setCurrentView("pfpassbook")} />
                                            {/* <Download size={20} /> */}
                                        </td>
                                        <td className="text-center">
                                            <Eye size={20} className="me-md-3 me-2" onClick={() => setCurrentView("claims")}/>
                                        </td>
                                        <td className="text-center">
                                            <Eye size={20} className="me-md-3 me-2" onClick={() => setCurrentView("withdraw")}/>
                                        </td>
                                    </tr>
                                </tbody>
                                }
                             {!uanData && <tbody><tr><td colSpan={5} className="text-center">No Data Found!!</td></tr></tbody>}
                            </table>
                        </div>
                    </div>
                ) : currentView === "profile" ? (
                    <Profile jsonData={uanData} onBack={() => setCurrentView("parent")} />
                ) : currentView === "serviceHistory" ? (
                    <ServiceHistory jsonData={uanData} onBack={() => setCurrentView("parent")} />
                ) : currentView === "pfpassbook" ? (
                    <PFPassbook jsonData={uanData} onBack={() => setCurrentView("parent")} />
                ) :currentView === "claims" ? (
                    <Claims jsonData={uanData} onBack={() => setCurrentView("parent")} />
                ) :currentView === "withdraw" ? (
                    <Withdrawability jsonData={uanData} onBack={() => setCurrentView("parent")} />
                ): null
                }

            </div>
        </>
    );
}

export default ViewDetailsByUan;