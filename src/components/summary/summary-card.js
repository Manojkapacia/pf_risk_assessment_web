import React from "react";
import './../../css/summary/summary-card.css';
import { useNavigate, useLocation } from 'react-router-dom';
function SummaryCard() {
    const navigate = useNavigate();
    const location = useLocation();
    const fullSummaryCardButton = ["/full-summary"];
    const fullSummaryCard = fullSummaryCardButton.includes(location.pathname);
    const fundDetails = () => {
        navigate('/fund-details')
    }
    const accountSummary = () => {
        navigate('/account-details');
    }
    const getfullSummary = () => {
        navigate("/full-summary");
    }
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