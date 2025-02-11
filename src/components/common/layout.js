import React from "react";
import Logo from "./logo";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
     
    const location = useLocation();
    const isLoginPage = location.pathname === "/"; 

    return (
        <div style={layoutStyle}>
            <Logo />
            <div style={{ 
                ...contentStyle, 
                marginTop: isLoginPage ? "0" : "4.5rem"
            }}>{children}</div>
        </div>
    );
};

const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
};

const contentStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    // padding: "20px",
    // marginTop: "4.5rem"
};

export default Layout;