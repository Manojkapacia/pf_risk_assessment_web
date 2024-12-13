import "../../App.css";
import "../../css/create-account/create-account.css";
import createAccount from "../../assets/images/createAccount.png"
import { useNavigate } from "react-router-dom";

function CreateAccount() {
    const navigate = useNavigate()

    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 col-md-6 mt-4 mt-lg-0">
                    <img src={createAccount} alt="Account Create" className='accountImage' />
                </div>

                <div className="col-lg-6 col-md-8">
                    <div className="row">
                        <div className="col-md-11 offset-md-1">
                            <div className="pfRiskheading text-center">Create Account to Proceed</div>
                            <div className="pfRiskSubHeading text-center">
                                Please login to view all critical issues and their solutions
                            </div>
                        </div>
                    </div>

                    <form>
                        <div className="row mt-1 mt-lg-5 pt-lg-3">
                            <div className="col-md-11 offset-md-1">
                                <div className="accountHeading">Phone Number:</div>
                                <input
                                    className="form-control mt-1"
                                    type="text"
                                    placeholder="Please enter your phone number"
                                    required />

                                <div className="accountHeading mt-1 mt-md-3">Name:</div>
                                <input
                                    className="form-control mt-1"
                                    type="text"
                                    placeholder="Please enter your full name"
                                    required />

                                <button type="submit" className="btn my-2 mt-lg-5 col-12 pfRiskButtons" onClick={() => navigate("/create-account-otp")}>
                                    Continue
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateAccount;