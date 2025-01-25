import React from "react";


const NextStep = ({ setBlurEffect,amountStuck }) => {
  const steps = [
    {
      number: 1,
      label: "PF Check-up",
      status: "completed",
    },
    {
      number: 2,
      label: "Consult with Expert",
      status: "secondStep",
      actions: [
        { label: "Schedule call" },
        { label: "Call now" },
      ],
    },
    // {
    //   number: 3,
    //   label: "Issue Resolution",
    // },
    {
      number: 3,
      label: "Resolve your PF Issues",
    },
    {
      number: 4,
      label: "Tension Free Withdrawal",
    },
  ];
  const stepsAmountStuck = [
    {
      number: 1,
      label: "PF Check-up",
      status: "completed",
    },
    {
      number: 2,
      label: "Initiate withdrawal request",
      status: "secondStep",
    },
    {
      number: 3,
      label: "Amount Credited in your account",
    }
  ];
  const displayedSteps = amountStuck > 0 ?  steps: stepsAmountStuck;
  
  return (
    <div className="card shadow-sm my-3 pt-3 px-2 ps-4">
      <div className="text-center">
        <p className="KycHeading mb-0">PF Expert Support</p>
      </div>
      <div className={`${setBlurEffect ? 'blur-content' : ''}`}>
        <div className="stepper">
          {displayedSteps.map((step, index) => (
            <div
              key={index}
              className="d-flex align-items-center mb-4"
              style={{ position: "relative" }}
            >
              <div
                className={`step-number d-flex justify-content-center align-items-center ${step.status === "completed" ? "bg-success text-white" : "bg-dark text-white"
                  }`}
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  fontWeight: "bold",
                  zIndex: 1,
                }}
              >
                {step.number}
              </div>

              {index < displayedSteps.length - 1 && (
                <div
                  className="step-connector"
                  style={{
                    position: "absolute",
                    left: "1.2rem",
                    top: "2.5rem",
                    width: "0.13rem",
                    height: "4rem",
                    backgroundColor: "gray",
                    zIndex: 0,
                  }}
                ></div>
              )}

              <div className="d-flex justify-content-between align-items-center">
                <p
                  className="mb-1 ms-lg-3 ms-2"
                  style={{
                    fontWeight: step.status === "completed" || step.status === "secondStep" ? "bold" : "normal",
                    fontSize: "1rem",
                  }}
                >
                  {step.label}{" "}
                  {step.status === "completed" && (
                    <span className="text-success" style={{ fontSize: "0.85rem" }}>
                      Completed
                    </span>
                  )}
                  {step.status === "secondStep" && (
                    <span className="fw-bold d-block d-lg-inline" style={{ fontSize: "0.85rem",color:'orange'}}>
                      Expect call within 48 hours
                    </span>
                  )}
                </p>

                {step.actions && (
                  <div
                    className="d-flex mt-2 flex-column flex-lg-row"
                    style={{
                      rowGap: "0.5rem",
                      columnGap: "0.5rem",
                    }}
                  >
                    {/* {step.actions.map((action, idx) => (
                    <button
                      style={{
                        backgroundColor: "#00124F",
                        fontSize: "0.80rem",
                        borderRadius: "2rem",
                        border:'none',
                        color: '#ffffff'
                      }}
                      key={idx}
                      className={`btn btn-${action.type} btn-sm d-flex align-items-center justify-content-center ms-3`}
                    >
                      {action.label === "Schedule call" && (
                        <FaCalendarAlt className="me-1" />
                      )}
                      {action.label === "Call now" && (
                        <FaPhoneAlt className="me-1" />
                      )}
                      {action.label}
                    </button>
                  ))} */}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NextStep;

