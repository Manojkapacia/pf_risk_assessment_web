import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get } from '../common/api';
import datanotfound from "../../assets/images/data not found.png";

function DataNotFound() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

  
    const apiEndpoint = location.state?.fetchFunction || location.state?.apiEndpoint;

    console.log("DataNotFound Loaded:", location.state);

    const handleRetry = async () => {
        if (!apiEndpoint) {
            console.log(" No API Endpoint Found!");
            return;
        }
        setLoading(true);
        
        try {
            const response = await get(apiEndpoint);
            console.log(" Full API Response:", response);
    
             if (response?.status === 401) {
                console.error(" Retry Failed:", response);
            }
            else{
                const previousPath = location.state?.previousPath || "/";  
                navigate(previousPath);
            }
        } catch (error) {
            console.error(" API Error:", error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="container">
            <div className="row">
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    flexDirection: "column",
                }}>
                    <img src={datanotfound} alt="Image Not Found" height="300rem" width="450rem" />
                    <h4>
                        Oops! Something went wrong. <br />
                        Please try again.
                    </h4>
                    <button
    className="btn correctButton w-25 py-2 "
    onClick={handleRetry}
    disabled={loading}
>
    {loading ? "Retrying..." : "Retry"}
</button>

                </div>
            </div>
        </div>
    );
}

export default DataNotFound;
