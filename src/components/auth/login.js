import '../../css/auth/login.css';
import '../../App.css';
import pfRiskImage from '../../images/pfRiskAssessment.png';
import { Link } from 'react-router-dom';
function LoginComponent() {
    return (
        <div className="container">
            <div className="row mt-5 pt-5">
                <div className="col-md-4">
                    <div className="pfRiskheading">PF Risk Assessment</div>
                    <div className='pfRiskSubHeading'>
                        Check if your PF is at risk of getting stuck
                    </div>
                    <form>
                        <div className='row mt-4'>
                            <div className='col-md-12'>
                                <div className="row">
                                    <div className="col text-start labelHeading">
                                        UAN number:
                                    </div>
                                    <div className="col text-end labelSubHeading">
                                        Activate UAN
                                    </div>
                                </div>
                                <input className='form-control mt-2' type="text"
                                    placeholder="Enter your 12 digit UAN number" required />
                                <div className="text-end labelSubHeading mt-2">
                                    I don't know my UAN
                                </div>
                            </div>
                        </div>

                        <div className='row mt-3'>
                            <div className='col-md-12'>
                                <div className='labelHeading'>Password:</div>
                                <input className='form-control mt-2' type="password"
                                    placeholder="Enter your EPFO password" required />

                                <div className="text-end labelSubHeading mt-2">
                                    Forgot Password?
                                </div>
                            </div>
                        </div>

                        {/* <div className='row mt-5'>
                            <div className='col-md-12'>
                                <div className='text-center loremText'>Lorem ipsum dolor sit amet consectetur.
                                    Elementum viverra</div>
                            </div>
                        </div> */}
                        <div className='row mt-5'>
                            <div className='col-md-12'>
                                <button className='col-12 btn pfRiskButtons'>
                                    <nav>
                                        <Link className='text-decoration-none nav-link' to="/otpAssessment">Continue</Link>
                                    </nav>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-md-6 offset-md-2">
                    <img src={pfRiskImage} alt="Risk Assessment" height="400rem" width='100%' />
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;