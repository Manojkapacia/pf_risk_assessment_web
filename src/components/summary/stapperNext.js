import React from "react";
import './../../css/summary/stepperNext.css';

const Stepper = ({ currentStep }) => {
  const steps = ["OTP Verification", "Personal Details", "Confirmation"];

  return (
    <div className="stepper-container">
      <div className="step-label">
        <strong>Next:</strong> {steps[currentStep]}
      </div>
      <div className="stepper">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`step-line ${index <= currentStep ? "active" : ""}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;