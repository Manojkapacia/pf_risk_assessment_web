import React from "react";
import SummaryCard from "./summary-card";
import ClaimRejection from "./claim-rejection";
import './../../css/summary/account-details.css'
import { useLocation } from "react-router-dom";
function AccountDetails() {
    const location = useLocation()
    const { summaryData } = location.state || {};
    const ServiceHistoryData = summaryData?.rawData?.data?.serviceHistory;
    const profileData = summaryData?.rawData?.data?.profile;
    
    console.log("sUMMARY fILE", summaryData);
    const getMemberWiseBalance = (memberId) => {
        const memberDetails = summaryData?.rawData?.data?.home?.memberWiseBalances.find((item) => item.memberId === memberId)
        if (!memberDetails) return 'N/A'
        return memberDetails?.balance
    }
    const lastContribution= ()=>{
        const employeeShare = summaryData?.reportData?.lastContribution?.employeeShare;
        const employerShare =summaryData?.reportData?.lastContribution?.employerShare;
        const pensionShare =summaryData?.reportData?.lastContribution?.pensionShare;
        const parseNumber = (str) => parseFloat(str.replace(/,/g, ""));
        const total = parseNumber(employeeShare || '0') + parseNumber(employerShare || '0') +
         parseNumber(pensionShare || '0');
         return total
    }
    const totalService = ServiceHistoryData?.overview?.['Total Experience'].split(" ").slice(0, 4).join(" ");

    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className='col-lg-5 col-md-6 my-4'>
                    <SummaryCard></SummaryCard>
                    <div className="card shadow-sm py-3 px-lg-3 mt-3">
                        <p className="text-center employmentHistory">Employment History</p>
                        <table className="table mb-0">
                            <thead>
                                <tr>
                                    <th className="employmentTabelHeading">Employer</th>
                                    <th className="employmentTabelHeading">Tenure</th>
                                    <th className="employmentTabelHeading">Experience</th>
                                    <th className="employmentTabelHeading">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ServiceHistoryData?.history?.map((data, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="employmentData">{data?.company}</div>
                                            <div className="employmentData">
                                                Member ID: {data?.details?.['Member Id']}
                                            </div>
                                        </td>
                                        <td className="employmentData">{data?.period}</td>
                                        <td className="employmentData">{data?.details?.['Total Service']}</td>
                                        <td className="employmentData">{getMemberWiseBalance(data?.details?.['Member Id'])}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-center employmentHistory mt-2">
                            Total Service: {totalService}
                        </div>
                    </div>

                    <div
                        className="card shadow-sm  mt-3 px-3 px-lg-5 py-3">

                        <div className="text-center">
                            <h5 className="employmentHistory">Overview</h5>
                        </div>

                        <table className="table">
                            <tbody>
                                <tr>
                                    <td className="overViewTabelData">Total Service</td>
                                    <td className="overViewTabelSubData">
                                        {totalService}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="overViewTabelData">No. Of Employers</td>
                                    <td className="overViewTabelSubData">
                                        {ServiceHistoryData?.history?.length}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="overViewTabelData">Current Employer</td>
                                    <td className="overViewTabelSubData">
                                        {ServiceHistoryData?.history[0]?.company.length > 25 ? ServiceHistoryData?.history[0]?.company.slice(0, 25) + "..." : ServiceHistoryData?.history[0]?.company}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="overViewTabelData">Current Value</td>
                                    <td className="overViewTabelSubData">
                                        ₹ {summaryData?.reportData?.totalPfBalance}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="overViewTabelData">Last Contribution</td>
                                    <td className="overViewTabelSubData">
                                        ₹ {lastContribution()}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="overViewTabelData">FY’24 Interest</td>
                                    <td className="overViewTabelSubData">
                                        ₹ 22,50,000
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div
                        className="card shadow-sm  mt-3 py-3 px-3 px-lg-5">
                        <div className="row">
                            <h5 className="text-center employmentHistory">Personal Details</h5>
                            <div className="col-6">
                                <div className="d-flex flex-column">
                                    {profileData?.basicDetails?.relation === "F" ? (<p className="mb-0 personalDetText"> Father's Name :</p>)
                                        : (<p className="mb-0 personalDetText"> Husband's Name :</p>)}
                                    <p className="personalDetSubtext">{profileData?.basicDetails?.fatherHusbandName}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="mb-0 personalDetText">Gender:</p>
                                    <p className="personalDetSubtext">{profileData?.basicDetails?.gender === "M" ? "Male" : "Female"}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="mb-0 personalDetText">Physical Handicap:</p>
                                    <p className="personalDetSubtext">{profileData?.basicDetails?.physicallyHandicapped === "N" ? "None" : "Yes"}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="mb-0 personalDetText">Bank A/C number:</p>
                                    <p className="personalDetSubtext">{profileData?.kycDetails?.bankAccountNumber}</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex flex-column">
                                    <p className="mb-0 personalDetText">Date of Birth:</p>
                                    <p className="personalDetSubtext">{profileData?.basicDetails?.dateOfBirth}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="mb-0 personalDetText">Aadhaar Number:</p>
                                    <p className="personalDetSubtext">{profileData?.kycDetails?.aadhaar}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="mb-0 personalDetText">PAN Number:</p>
                                    <p className="personalDetSubtext">{profileData?.kycDetails?.pan}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="mb-0 personalDetText">IFSC Number:</p>
                                    <p className="personalDetSubtext">{profileData?.kycDetails?.bankIFSC}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ClaimRejection reportData={summaryData}></ClaimRejection>
                </div>
            </div>
        </div>
    )
}
export default AccountDetails;