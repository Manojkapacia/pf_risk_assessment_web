import React, { useEffect, useState } from "react";
import './../../css/summary/summary-card.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { getClosingBalance, getLastContribution } from "../../helper/data-transform";

function SummaryCard({summaryData}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [balanceDetails, setBalanceDetails] = useState(null)
    const [recentContribution, setRecentContribution] = useState(null)
    const [totalBalance, setTotalBalance] = useState("N/A")

    const fullSummaryCardButton = ["/full-summary"];
    const fullSummaryCard = fullSummaryCardButton.includes(location.pathname);

    const fundDetails = () => {
        navigate('/fund-details', {state: {summaryData}})
    }

    const accountSummary = () => {
        navigate('/account-details', {state: {summaryData}});
    }

    const getfullSummary = () => {
        navigate("/full-summary");
    }

    useEffect(() => {
        if (summaryData?.rawData) {
            const parseCurrency = (value) => Number(value.replace(/[₹,]/g, ""));
            const formatCurrency = (value) => `₹ ${value.toLocaleString("en-IN")}`;

            const balances = getClosingBalance(summaryData.rawData?.passbooks)
            setBalanceDetails(balances)

            const lastContribution = getLastContribution(summaryData?.rawData)
            setRecentContribution(lastContribution)

            // set total balance 
            const totalBalance = summaryData.rawData?.home?.memberWiseBalances.reduce((accu, item) => {
                return accu + parseCurrency(item.balance || "0");
            }, 0)
            setTotalBalance(formatCurrency(totalBalance))
        }
    }, [])

    return (
        <div className="card text-white totalSummaryCard">
            <div className="text-center mt-3">
                <label className="cardLabel">Ashirwad Tomar</label>
                <p className="cardNumber"> UAN: 111111110056</p>
            </div>

            <div className="text-center mb-2">
                <p className="currentBalence mb-0"> Current Balance </p>
                <p className="balanceValue"> ₹22,50,000 </p>
            </div>

            <div className="d-flex justify-content-around mx-2">
                <div>
                    <p className="cardDetails mb-0"> Total Service </p>
                    <p className='cardSubdetails'>7 yrs 3 mos</p>
                </div>
                <div>
                    <p className="cardDetails mb-0">Current Employer</p>
                    <p className='cardSubdetails'> Morningstar India Pvt. Ltd. </p>
                </div>
                <div>
                    <p className="cardDetails mb-0" ># of Employers</p>
                    <p className='cardSubdetails'>3</p>
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