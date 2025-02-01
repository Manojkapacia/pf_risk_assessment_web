// import React from "react";
// import { ArrowLeft } from 'react-bootstrap-icons';

// const PFPassbook = ({ jsonData, onBack }) => {
//     let data = jsonData?.data;

//     return (
//         <>
//             <button className="btn p-0 d-flex align-items-center mt-4 mb-md-3" onClick={onBack}>
//                 <ArrowLeft size={20} className="me-1" /> Back
//             </button>
//             <div>
//                 <h3>Passbook Details</h3>
//                 {data.serviceHistory.history.map((historyItem, index) => {
//                     const memberId = historyItem?.details["Member Id"];
//                     const passbook = data?.passbooks[memberId];


//                     if (passbook) {
//                         return (
//                             <div key={index}>
//                                 <div className="accordion" id="passbookAccordion">
//                                     <button
//                                         className="accordion-button"
//                                         type="button"
//                                         data-bs-toggle="collapse"
//                                         data-bs-target={`#collapse-${index}`}
//                                         aria-expanded="true"
//                                         aria-controls={`collapse-${index}`}
//                                     >
//                                         {historyItem.company} - {memberId}
//                                     </button>

//                                     <div
//                                         id={`collapse-${index}`}
//                                         className="accordion-collapse collapse"
//                                         aria-labelledby={`heading-${index}`}
//                                         data-bs-parent="#passbookAccordion" style={{ backgroundColor: '#ffffff' }}
//                                     >
//                                         <div className="accordion-body">
//                                             {passbook.isTrust === 'true' ? (<h4>This passbook belongs to a trust</h4>)
//                                                 : (
//                                                     Object.entries(passbook)
//                                                     ?.sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
//                                                     ?.map(([year, yearData], yearIndex) => (
//                                                         <div key={yearIndex}>
//                                                             <h5
//                                                                 style={{
//                                                                     cursor: "pointer",
//                                                                     color: "blue",
//                                                                     textDecoration: "underline",
//                                                                 }}
//                                                                 data-bs-toggle="collapse"
//                                                                 data-bs-target={`#details-${memberId}-${year}`}
//                                                             >
//                                                                 Year: {year}
//                                                             </h5>
//                                                             {yearData!== null ? 
//                                                             <div
//                                                                 id={`details-${memberId}-${year}`}
//                                                                 className="collapse"
//                                                                 style={{ marginLeft: "1rem" }}>
//                                                                 <div className="mt-3">
//                                                                     <div className="mb-4">
//                                                                         <h4>Opening Balance</h4>
//                                                                         <table className="table table-bordered">
//                                                                             <thead>
//                                                                                 <tr>
//                                                                                     <th>Particulars</th>
//                                                                                     <th>Employee Share</th>
//                                                                                     <th>Employer Share</th>
//                                                                                     <th>Pension Share</th>
//                                                                                 </tr>
//                                                                             </thead>
//                                                                             <tbody>
//                                                                                 <tr>
//                                                                                     <td>{yearData?.openingBalance?.particulars}</td>
//                                                                                     <td>{yearData?.openingBalance?.employeeShare}</td>
//                                                                                     <td>{yearData?.openingBalance?.employerShare}</td>
//                                                                                     <td>{yearData?.openingBalance?.pensionShare}</td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                     <div className="mb-4">
//                                                                         <h4>Transactions</h4>
//                                                                         <div className="table-responsive">
//                                                                             <table className="table table-hover table-bordered text-center">
//                                                                                 <thead>
//                                                                                     <tr>
//                                                                                         <th>Wage Month</th>
//                                                                                         <th>Transaction Date</th>
//                                                                                         <th>Transaction Type</th>
//                                                                                         <th>Particulars</th>
//                                                                                         <th>EPF Wages</th>
//                                                                                         <th>EPS Wages</th>
//                                                                                         <th>Employee Share</th>
//                                                                                         <th>Employer Share</th>
//                                                                                         <th>Pension Share</th>
//                                                                                     </tr>
//                                                                                 </thead>
//                                                                                 <tbody>
//                                                                                     {yearData?.transactions?.map((txn, index) => (
//                                                                                         <tr key={index}>
//                                                                                             <td>{txn?.wageMonth}</td>
//                                                                                             <td>{txn?.transactionDate}</td>
//                                                                                             <td>{txn?.transactionType}</td>
//                                                                                             <td>{txn?.particulars}</td>
//                                                                                             <td>{txn?.epfWages}</td>
//                                                                                             <td>{txn?.epsWages}</td>
//                                                                                             <td>{txn?.employeeShare}</td>
//                                                                                             <td>{txn?.employerShare}</td>
//                                                                                             <td>{txn?.pensionShare}</td>
//                                                                                         </tr>
//                                                                                     ))}
//                                                                                 </tbody>
//                                                                             </table>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="mb-4">
//                                                                         <h4>Totals</h4>
//                                                                         <table className="table table-bordered">
//                                                                             <thead>
//                                                                                 <tr>
//                                                                                     <th>Particulars</th>
//                                                                                     <th>Employee Share</th>
//                                                                                     <th>Employer Share</th>
//                                                                                     <th>Pension Share</th>
//                                                                                 </tr>
//                                                                             </thead>
//                                                                             <tbody>
//                                                                                 {Object.entries(yearData?.totals).map(([key, total], index) => (
//                                                                                     <tr key={index}>
//                                                                                         <td>{key}</td>
//                                                                                         <td>{total?.employeeShare}</td>
//                                                                                         <td>{total?.employerShare}</td>
//                                                                                         <td>{total?.pensionShare}</td>
//                                                                                     </tr>
//                                                                                 ))}
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                     <div className="mb-4">
//                                                                         <h4>Closing Balance</h4>
//                                                                         <table className="table table-bordered">
//                                                                             <thead>
//                                                                                 <tr>
//                                                                                     <th>Particulars</th>
//                                                                                     <th>Employee Share</th>
//                                                                                     <th>Employer Share</th>
//                                                                                     <th>Pension Share</th>
//                                                                                 </tr>
//                                                                             </thead>
//                                                                             <tbody>
//                                                                                 <tr>
//                                                                                     <td>{yearData?.closingBalance?.particulars}</td>
//                                                                                     <td>{yearData?.closingBalance?.employeeShare}</td>
//                                                                                     <td>{yearData?.closingBalance?.employerShare}</td>
//                                                                                     <td>{yearData?.closingBalance?.pensionShare}</td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                     <div className="mb-4">
//                                                                         <h4>Interest Details</h4>
//                                                                         <table className="table table-bordered">
//                                                                             <thead>
//                                                                                 <tr>
//                                                                                     <th>Particulars</th>
//                                                                                     <th>Employee Share</th>
//                                                                                     <th>Employer Share</th>
//                                                                                     <th>Pension Share</th>
//                                                                                 </tr>
//                                                                             </thead>
//                                                                             <tbody>
//                                                                                 <tr>
//                                                                                     <td>{yearData?.interestDetails?.particulars}</td>
//                                                                                     <td>{yearData?.interestDetails?.employeeShare}</td>
//                                                                                     <td>{yearData?.interestDetails?.employerShare}</td>
//                                                                                     <td>{yearData?.interestDetails?.pensionShare}</td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>:
//                                                             <div
//                                                             id={`details-${memberId}-${year}`}
//                                                             className="collapse"
//                                                             style={{ marginLeft: "1rem" }}>
//                                                                 <h4>Sorry, We have no record found</h4>
//                                                             </div>
//                                                              }

//                                                         </div>
//                                                     ))
//                                                 )}

//                                         </div>
//                                     </div>

//                                 </div>

//                             </div>
//                         );
//                     }
//                     return null; // If no match is found, render nothing
//                 })}
//             </div>
//         </>

//     );

// };

// export default PFPassbook;
import React, { useState } from "react";
import { ArrowLeft } from "react-bootstrap-icons";

const PFPassbook = ({ jsonData, onBack }) => {
    const data = jsonData?.data;
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
        setSelectedYear(null); 
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <>
            <button className="btn p-0 d-flex align-items-center mt-4 mb-md-3" onClick={onBack}>
                <ArrowLeft size={20} className="me-1" /> Back
            </button>
            <div>
                <h3>Passbook Details</h3>
                <div className="d-flex mb-4" style={{ gap: "1rem" }}>
                    <select
                        className="form-select w-75"
                        onChange={handleCompanyChange}
                        value={selectedCompany || ""}
                    >
                        <option value="">Select Company</option>

                        {data?.serviceHistory.history.map((historyItem, index) => {
                            const memberId = historyItem.details["Member Id"];
                            const company = historyItem.company;
                            const joiningDate = historyItem.details["Joining Date"];
                            const endDate = historyItem.details["Exit Date"] || "Present"; // If no end date, show "Present"

                            return (
                                <option key={index} value={memberId}>
                                    {company} - {memberId} ({joiningDate} to {endDate})
                                </option>
                            );
                        })}
                    </select>
                    <select
                        className="form-select w-25"
                        onChange={handleYearChange}
                        value={selectedYear || ""}
                        disabled={!selectedCompany}
                    >
                        <option value="">Select Year</option>
                        {selectedCompany && Object.keys(data.passbooks[selectedCompany] || {})
                            .sort((a, b) => b - a)
                            .map((year, index) => (
                                <option key={index} value={year}>{year}</option>
                            ))}
                    </select>
                </div>
                {selectedCompany && selectedYear && (
                    <div>
                        <h5>Year: {selectedYear}</h5>
                        <div className="accordion" id="passbookAccordion">
                            <div className="accordion-body">
                                {data.passbooks[selectedCompany][selectedYear] ? (
                                    <div>
                                        <h4>Opening Balance</h4>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Particulars</th>
                                                    <th>Employee Share</th>
                                                    <th>Employer Share</th>
                                                    <th>Pension Share</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{data.passbooks[selectedCompany][selectedYear]?.openingBalance?.particulars}</td>
                                                    <td>{data.passbooks[selectedCompany][selectedYear]?.openingBalance?.employeeShare}</td>
                                                    <td>{data.passbooks[selectedCompany][selectedYear]?.openingBalance?.employerShare}</td>
                                                    <td>{data.passbooks[selectedCompany][selectedYear]?.openingBalance?.pensionShare}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <h4>Transactions</h4>
                                        <table className="table table-hover table-bordered text-center">
                                            <thead>
                                                <tr>
                                                    <th>Wage Month</th>
                                                    <th>Transaction Date</th>
                                                    <th>Transaction Type</th>
                                                    <th>Particulars</th>
                                                    <th>EPF Wages</th>
                                                    <th>EPS Wages</th>
                                                    <th>Employee Share</th>
                                                    <th>Employer Share</th>
                                                    <th>Pension Share</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.passbooks[selectedCompany][selectedYear]?.transactions?.map((txn, index) => (
                                                    <tr key={index}>
                                                        <td>{txn?.wageMonth}</td>
                                                        <td>{txn?.transactionDate}</td>
                                                        <td>{txn?.transactionType}</td>
                                                        <td>{txn?.particulars}</td>
                                                        <td>{txn?.epfWages}</td>
                                                        <td>{txn?.epsWages}</td>
                                                        <td>{txn?.employeeShare}</td>
                                                        <td>{txn?.employerShare}</td>
                                                        <td>{txn?.pensionShare}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <h4>Sorry, We have no record found</h4>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PFPassbook;
