import React from "react";
import { ArrowLeft } from 'react-bootstrap-icons';
import '../../css/admin/withdrawability.css'

function Withdrawability({ jsonData, onBack }) {
    let report = jsonData?.report

    return (
        <>
            <button className="btn p-0 d-flex align-items-center mt-4 mb-md-3" onClick={onBack}>
                <ArrowLeft size={20} className="me-1" /> Back
            </button>
            <div className="report-container">
                {report ? report.map((categoryItem, index) => (
                    <div key={index} className="category">
                        <h2 className="category-title">{categoryItem.category}</h2>
                        <div className="summary-container">
                            <span className="summary-item">Success: {categoryItem.totalSuccess}</span>
                            <span className="summary-item">Critical: {categoryItem.totalCritical}</span>
                            <span className="summary-item">Medium: {categoryItem.totalMedium}</span>
                        </div>
                        <div className="subcategories">
                            {categoryItem.subCategory.map((subItem, subIndex) => (
                                <div key={subIndex} className="subcategory">
                                    <h3 className="subcategory-title">{subItem.name.replace(/_/g, ' ')}</h3>
                                    <div className="details-container">
                                        <p className="detail">Success: {subItem.success}</p>
                                        <p className="detail">Critical: {subItem.critical}</p>
                                        <p className="detail">Medium: {subItem.medium}</p>
                                        {subItem.successMessage.length > 0 && (
                                            <div className="message-container">
                                                <h4 className="message-title">Success Messages:</h4>
                                                <ul className="message-list">
                                                    {subItem.successMessage.map((msg, msgIndex) => (
                                                        <li key={msgIndex} className="message-item">{msg}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {subItem.errorMessages.length > 0 && (
                                            <div className="message-container">
                                                <h4 className="message-title">Error Messages:</h4>
                                                <ul className="message-list">
                                                    {subItem.errorMessages.map((msg, msgIndex) => (
                                                        <li key={msgIndex} className="message-item">{msg}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : <p className="text-center">Report not available yet!</p>}
            </div>
        </>
    );
}

export default Withdrawability;