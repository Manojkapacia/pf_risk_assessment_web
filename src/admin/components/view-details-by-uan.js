import React, { useState } from "react";
import Profile from './profile';
import ServiceHistory from './service-history';
import PFPassbook from './passbook';
import { Search, Eye, Download } from "react-bootstrap-icons";
import StaticData from '../helper/raw-data.json'

function ViewDetailsByUan() {
    const [value, setValue] = useState("");
    const [currentView, setCurrentView] = useState("parent");

    const handleChange = (e) => {
        const inputValue = e.target.value;

        // Allow only numbers and prevent leading zeros
        if (/^\d*$/.test(inputValue)) {
            setValue(inputValue);
        }
    };

    return (
        <div className="container">
            {currentView === "parent" ? (
                <div className="row">
                <div className="col-md-8 offset-md-2 mt-5">
                    <div className="input-group mt-3">

                        {/* Search Input */}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            aria-label="Search"
                            value={value} maxLength={12}
                            onChange={handleChange}
                        />
                        <span className="input-group-text">
                            <Search />
                        </span>
                    </div>
                </div>

                <div className="col-md-10 offset-md-1 mt-5">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="text-center">Profile</th>
                                <th className="text-center">Service History</th>
                                <th className="text-center">Trsnsfers</th>
                                <th className="text-center">Passbook</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="text-center">
                                    <Eye size={20} onClick={() => setCurrentView("profile")}
                                    className="me-md-3 me-2" />
                                    <Download size={20} />
                                </td>
                                <td className="text-center">
                                    <Eye size={20} className="me-md-3 me-2" onClick={() => setCurrentView("serviceHistory")} />
                                    <Download size={20} />
                                </td>
                                <td className="text-center">
                                    <Eye size={20} className="me-md-3 me-2"/>
                                    <Download size={20} />
                                </td>
                                <td className="text-center">
                                    <Eye size={20} className="me-md-3 me-2" onClick={() => setCurrentView("pfpassbook")} />
                                    <Download size={20} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            ):  currentView === "profile" ? (
                <Profile jsonData={StaticData} onBack={() => setCurrentView("parent")}/>
            ): currentView === "serviceHistory" ? (
                <ServiceHistory jsonData={StaticData} onBack={() => setCurrentView("parent")}/>
            ):  currentView === "pfpassbook" ? (
                <PFPassbook jsonData={StaticData} onBack={() => setCurrentView("parent")}/>
            ):null
            }
            
        </div>
    );
}

export default ViewDetailsByUan;