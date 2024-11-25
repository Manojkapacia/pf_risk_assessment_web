import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';

const WelcomeBack = () => {
    return(
        <div className="container">
            <div className="row mx-2 d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 col-md-8 offset-lg-1 mt-2 mt-lg-0">
                    <img src={pfRiskImage} alt="Risk Assessment" className='pfRiskLoginImage' />
                </div>
                <div className="col-lg-7 mt-4 mb-3">
                    <div className='row'>
                        <div className='col-md-8 offset-md-1'>
                            <span className='welcomeLabel'>Welcome Back!</span><br></br>
                            <span className='labelText'>Choose an option to continue</span>
                        </div>
                        <div className='col-md-6 offset-md-3 mt-4'>
                            <button className='w-100 border-0 mb-2 py-1 welcomeButton'>Resume from where you left</button>
                            <button className='w-100 border-0 py-1 welcomeButton'>Take a fresh assessment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeBack;