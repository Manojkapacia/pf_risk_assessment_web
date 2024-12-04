import React, { useState } from "react";
import '../../App.css';
import Profile from './profile';
import * as XLSX from 'xlsx';
import ServiceHistory from './service-history';
import PFPassbook from './passbook';
import { Search, Eye, Download, ArrowLeft } from "react-bootstrap-icons";
import { get } from "../../components/common/api";
import Loader from "../../components/common/loader";
import { useNavigate } from "react-router-dom";

function ViewDetailsByUan() {

    const jsonData = 
        {
            "employeeId": "EMP12345",
            "employeeName": "John Doe",
            "pfAccountNumber": "PF123456789",
            "withdrawabilityDetails": [
              {
                "type": "Retirement Withdrawal",
                "eligibility": true,
                "availableAmount": 150000.00,
                "criteria": {
                  "age": 60,
                  "yearsOfService": 25
                },
                "notes": "Eligible for full withdrawal as per retirement age."
              },
              {
                "type": "Partial Withdrawal - Medical Emergency",
                "eligibility": true,
                "availableAmount": 50000.00,
                "criteria": {
                  "emergencyType": "Medical",
                  "proofRequired": true
                },
                "notes": "Proof of medical emergency required."
              },
              {
                "type": "Partial Withdrawal - Housing Loan",
                "eligibility": false,
                "availableAmount": 0.00,
                "criteria": {
                  "minimumBalance": 200000.00,
                  "proofRequired": true
                },
                "notes": "Not eligible due to insufficient balance."
              },
              {
                "type": "Education Withdrawal",
                "eligibility": true,
                "availableAmount": 30000.00,
                "criteria": {
                  "relation": "Self/Children",
                  "proofRequired": true
                },
                "notes": "Can withdraw for higher education expenses."
              },
              {
                "type": "Marriage Withdrawal",
                "eligibility": true,
                "availableAmount": 40000.00,
                "criteria": {
                  "relation": "Self/Siblings/Children",
                  "proofRequired": true
                },
                "notes": "Marriage certificate or proof required."
              }
            ],
            "totalAvailableForWithdrawal": 170000.00,
            "generatedOn": "2024-12-03"
          }
    

    const [value, setValue] = useState("");
    const [currentView, setCurrentView] = useState("parent");
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [uanData, setUanData] = useState(null)
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleDownload = () => {
        // **Sheet 1: Metadata**
        const metadata = [
          { Field: "Employee ID", Value: jsonData.employeeId },
          { Field: "Employee Name", Value: jsonData.employeeName },
          { Field: "PF Account Number", Value: jsonData.pfAccountNumber },
          { Field: "Total Available for Withdrawal", Value: jsonData.totalAvailableForWithdrawal },
          { Field: "Report Generated On", Value: jsonData.generatedOn },
        ];
    
        // **Sheet 2: Withdrawability Details**
        const details = jsonData.withdrawabilityDetails.map((item, index) => ({
          "Sr No": index + 1,
          "Withdrawal Type": item.type,
          Eligibility: item.eligibility ? "Eligible" : "Not Eligible",
          "Available Amount": item.availableAmount,
          Criteria: JSON.stringify(item.criteria, null, 2), // Convert criteria to a readable string
          Notes: item.notes,
        }));
    
        // Create sheets for both sets of data
        const metadataSheet = XLSX.utils.json_to_sheet(metadata);
        const detailsSheet = XLSX.utils.json_to_sheet(details);
    
        // Create workbook and append both sheets
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, metadataSheet, "Metadata");
        XLSX.utils.book_append_sheet(workbook, detailsSheet, "Withdrawability Details");
    
        // Trigger Excel download
        XLSX.writeFile(workbook, "PF_Withdrawability_Report.xlsx");
      };

    // const handleDownload = () => {
    //     // **Prepare Combined Data**
    //     const combinedData = [
    //       // Employee details section
    //       ["Employee ID", jsonData.employeeId],
    //       ["Employee Name", jsonData.employeeName],
    //       ["PF Account Number", jsonData.pfAccountNumber],
    //       ["Total Available for Withdrawal", jsonData.totalAvailableForWithdrawal],
    //       ["Report Generated On", jsonData.generatedOn],
    //       [], // Blank row for spacing
    //       // Column headers for withdrawabilityDetails
    //       ["Sr No", "Withdrawal Type", "Eligibility", "Available Amount", "Criteria", "Notes"],
    //       // Withdrawability details section
    //       ...jsonData.withdrawabilityDetails.map((item, index) => [
    //         index + 1,
    //         item.type,
    //         item.eligibility ? "Eligible" : "Not Eligible",
    //         item.availableAmount,
    //         JSON.stringify(item.criteria, null, 2),
    //         item.notes,
    //       ]),
    //     ];
    
    //     // Create worksheet from combined data
    //     const worksheet = XLSX.utils.aoa_to_sheet(combinedData);
    
    //     // Create workbook and append the worksheet
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "PF Withdrawability Report");
    
    //     // Trigger Excel download
    //     XLSX.writeFile(workbook, "PF_Withdrawability_Report.xlsx");
    //   };

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

    const backToAdminLogin = () => {
        localStorage.removeItem("admin_logged_in");
        navigate('/operation/login');
    };

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
                    <button className="btn me-2" onClick={() => navigate("/")}>
                        <ArrowLeft size={17} className="me-1" /> Back to Assessment</button>
                    <button className="btn me-3" onClick={backToAdminLogin}
                        style={{ cursor: 'pointer' }}>Logout</button>
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
                                        <th className="text-center">Trsnsfers</th>
                                        <th className="text-center">Passbook</th>
                                        <th className="text-center">Withdrawability Report</th>
                                    </tr>
                                </thead>
                                {/* {uanData &&  */}
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
                                            <Eye size={20} className="me-md-3 me-2" />
                                            <Download size={20} onClick={handleDownload} />
                                        </td>
                                    </tr>
                                </tbody>
                                {/* } */}
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
                ) : null
                }

            </div>
        </>
    );
}

export default ViewDetailsByUan;