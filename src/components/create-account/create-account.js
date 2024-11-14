import "../../App.css";
import "../../css/create-account/create-account.css";
import createAccount from "../../assets/images/createAccount.png"

function CreateAccount() {
    return (
        <div className="container-fluid">
            <div className="row mx-2 d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 col-md-8 offset-lg-1 mt-4 mt-lg-0">
                    <img src={createAccount} alt="Account Create" className='accountImage' />
                </div>

                <div className="col-lg-7">
                    <div className="pfRiskheading text-center">Create Account to Proceed</div>
                    <div className="pfRiskSubHeading text-center">
                        Please login to view all critical issues and their solutions
                    </div>
                    <form>
                        <div className="row mt-1 mt-lg-5 pt-lg-3">
                            <div className="col-md-8 offset-md-2">
                                <div className="labelHeading">Phone Number:</div>
                                <input
                                    className="form-control mt-1"
                                    type="text"
                                    placeholder="Please enter your phone number"
                                    required />

                                <div className="labelHeading mt-1 mt-md-3">Name:</div>
                                <input
                                    className="form-control mt-1"
                                    type="text"
                                    placeholder="Please enter your full name"
                                    required />

                                <button type="submit" className="btn my-2 mt-lg-5 col-12 pfRiskButtons">
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