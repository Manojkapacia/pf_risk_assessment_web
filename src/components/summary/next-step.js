import React, { useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

const NextStep = ({ setBlurEffect }) => {
  const [openStep, setOpenStep] = useState(null);

  const steps = [
    {
      label: "Reading and downloading the report",
      description: (
        <div>
          <p>Your report has three sections that deeply dive into your provident fund:</p>
          <ol>
            <li>
              <span><u>Claim Rejection Probability:</u></span> This is the home page that details the probability of your PF claim (withdrawal) getting rejected, should you choose to withdraw your money. This section also details the main reasons why your withdrawal request will be rejected by the EPFO, the Govt. body that governs all PF operations.
            </li>
            <li>
              <span><u>Summary:</u></span> This section provides you a summary of the current status of your provident fund.
            </li>
            <li>
              <span><u>Fund Details:</u></span> This section details how your provident fund is performing. It shows the distribution of your fund and how your corpus has grown over the years.
            </li>
          </ol>
          <p><strong>Note:</strong> You also have the option to download the report in a PDF format and read through it at your convenience.</p>
        </div>
      ),
    },
    {
      label: "Understand the report- Free consultation",
      description:(
        <div>
          <p>We know going though the report can be overwhelming, but don’t worry, we will assign an PF expert to attend to your case. You will recieve a call from our PF expert within 48 hours and they will help you unsedtand the report in details</p>
          
        </div>
      ),
    },
    {
      label: "Getting issues resolved",
      description: (
        <div>
          <p>Whenever a user takes this assessment, we hope they do not get any issues identified in their PF, but if you do, do not worry. Our consultant will thoroughly explain to you the steps to get those issues rectified, along with the service fee, should you choose to get the issues rectified through FinRight.</p>
          <p>DIY or FinRight, however you choose to get your issues rectified, we strongly urge you to get them rectified as soon as possible as this is your hard-earned money which is blocked, and as time passes, the complexity of getting issues resolved and your blocked amount both will increase.</p>
        </div>
      ),
    },
    {
      label: "Tension Free Withdrawal",
      description:(
        <div>
          <p>Want to withdraw your money? dont worry, FinRight has got you covered. after solving 5000+ cases, our consultants have prepared a list of standard documentation and claim filing procedure that ensure you get access to your money in the most optimised and efficient way.</p>
          
        </div>
      ),
    },
  ];

  const toggleStep = (index) => {
    setOpenStep(openStep === index ? null : index);
  };

  return (
  <div className="card shadow-sm my-3 pt-3 px-2 ps-4" style={{backgroundColor: "#ffffff"}}>
  <div className="text-center">
    <p className="KycHeading ">How to use this report</p>
  </div>
    <div className={` ${setBlurEffect ? 'blur-content' : ''}`}  style={{
    marginLeft: "-9px",
    marginRight: "6px",
    marginBottom: "3px"
  }}>
     
      <div>
        {steps.map((step, index) => (
          <div key={index} className="mb-2">
            <div
              className="d-flex justify-content-between align-items-center p-3 border rounded shadow"
              style={{ cursor: "pointer", backgroundColor: "#ffffff", boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)" }}
              onClick={() => toggleStep(index)}
            >
              <span className="font-weight-large" style={{ textDecoration: openStep === index ? 'underline' : 'none' }}>{step.label}</span>
              {openStep === index ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {openStep === index && (
              <div className="p-3 border rounded mt-1" style={{ backgroundColor: "#ffffff", boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)" }}>
                {step.description}
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default NextStep;