import React, { useEffect, useState } from "react";
import './../../css/summary/summary-card.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatCurrency } from "../../helper/data-transform";

function SummaryCard({summaryData, setBlurEffect}) {
    const navigate = useNavigate();
    const location = useLocation();

    const [totalBalance, setTotalBalance] = useState("N/A")

    const fullSummaryCardButton = ["/full-summary"];
    const fullSummaryCard = fullSummaryCardButton.includes(location.pathname);

    const fundDetails = () => {
        navigate('/fund-details', {state: {summaryData, setBlurEffect}})
    }

    const accountSummary = () => {
        navigate('/account-details', {state: {summaryData, setBlurEffect}});
    }

    const getfullSummary = () => {
        navigate("/full-summary");
    }

    function formatDuration(duration) {
        if(duration){
        const parts = duration?.split(" ");
        const years = parts[0] !== "0" ? `${parts[0]} Yrs` : "";
        const months = parts[2] !== "0" ? `${parts[2]} M` : "";
        return [years, months].filter(Boolean).join(" ");
        }
      }

    useEffect(() => {
        if (summaryData?.rawData) {
            const parseCurrency = (value) => Number(value.replace(/[₹,]/g, ""));
            const formatCurrency = (value) => `₹ ${value.toLocaleString("en-IN")}`;

            // set total balance 
            const totalBalance = summaryData?.rawData?.data?.home?.memberWiseBalances.reduce((accu, item) => {
                return accu + parseCurrency(item.balance || "0");
            }, 0)
            setTotalBalance(formatCurrency(totalBalance))
        }
    }, [])

    return (
        <div className="card text-white totalSummaryCard">
            <div className="text-center mt-3">
                <label className="cardLabel">{summaryData?.rawData?.data?.profile?.fullName}</label>
                <p className="cardNumber"> UAN: {summaryData?.rawData?.data?.profile?.UAN}</p>
            </div>

            <div className="text-center mb-2">
                <p className="currentBalence mb-0"> Current Balance </p>
                <p className="balanceValue"> {formatCurrency(summaryData?.reportData?.totalPfBalance)} </p>
            </div>

            <div className="d-flex justify-content-around mx-2">
                <div>
                    <p className="cardDetails mb-0"> Total Service </p>
                    <p className='cardSubdetails'>{formatDuration(summaryData?.rawData?.data?.serviceHistory?.overview?.['Total Experience'])}</p>
                </div>
                <div>
                    <p className="cardDetails mb-0">Current Employer</p>
                    <p className='cardSubdetails' title={summaryData?.rawData?.data?.home?.currentEstablishmentDetails?.establishmentName}>{summaryData?.rawData?.data?.home?.currentEstablishmentDetails?.establishmentName.length > 15 ? summaryData?.rawData?.data?.home?.currentEstablishmentDetails?.establishmentName.slice(0, 18) + "..." : summaryData?.rawData?.data?.home?.currentEstablishmentDetails?.establishmentName}</p>
                </div>
                <div>
                    <p className="cardDetails mb-0" ># of Employers</p>
                    <p className='cardSubdetails'>{summaryData?.rawData?.data?.serviceHistory?.history.length}</p>
                </div>
            </div>

            <div className="d-flex mt-2 border-top">
                {fullSummaryCard ? (
                    <>
                        <button
                            className="btn text-white cardButtonText w-50"
                            onClick={accountSummary}
                            style={{
                                borderRight: "1px solid white",
                            }} >
                            Account Summary
                        </button>
                        <button onClick={fundDetails}
                            className="btn cardButtonText text-white w-50" >
                            Provident Fund Details
                        </button>
                    </>
                ) : (
                    <button
                        className="btn cardButtonText text-white w-100" onClick={getfullSummary}>
                        Back
                    </button>
                )
                }
            </div>
        </div>
    );
}

export default SummaryCard;