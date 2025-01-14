import React from "react";
import { FaPhoneAlt, FaCalendarAlt } from "react-icons/fa";

const NextStep = () => {
  const steps = [
    {
      number: 1,
      label: "PF Check-up",
      status: "completed",
    },
    {
      number: 2,
      label: "Consult with Expert",
      actions: [
        { label: "Schedule call", type: "primary" },
        { label: "Call now", type: "dark" },
      ],
    },
    {
      number: 3,
      label: "Issue Resolution",
    },
    {
      number: 4,
      label: "Get Risk Report",
    },
    {
      number: 5,
      label: "Tension Free Withdrawal",
    },
  ];

  return (
    <div className="card shadow-sm my-3 py-3 px-2 d-flex align-items-center">
      <h5 className="text-center">Next Steps</h5>
      <div className="stepper">
        {steps.map((step, index) => (
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

            {index < steps.length - 1 && (
              <div
                className="step-connector"
                style={{
                  position: "absolute",
                  left: "1.2rem",
                  top: "2.5rem",
                  width: "0.13rem",
                  height: "3.5rem",
                  backgroundColor: "gray",
                  zIndex: 0,
                }}
              ></div>
            )}

            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-1 ms-lg-3"
                style={{ fontWeight: step.status === "completed" ? "bold" : "normal",fontSize:'1rem' }}>
                {step.label}{" "}
                {step.status === "completed" && (
                  <span className="text-success" style={{ fontSize: "0.85rem" }}>
                    Completed
                  </span>
                )}
              </p>

              {step.actions && (
                <div className="d-flex  mt-2">
                  {step.actions.map((action, idx) => (
                    <button style={{ backgroundColor: '#00124F', fontSize: '0.80rem', borderRadius: '2rem' }}
                      key={idx}
                      className={`btn btn-${action.type} me-1 ms-lg-3  btn-sm d-flex align-items-center`}
                    >
                      {action.label === "Schedule call" && <FaCalendarAlt className="me-1" />}
                      {action.label === "Call now" && <FaPhoneAlt className="me-1" />}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextStep;
