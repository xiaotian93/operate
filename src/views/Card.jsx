import React from 'react';

const Card = ({ title, children }) => {
    const wrapperStyle = {
        margin: "0px auto 17px auto",
        width: "96%",
        backgroundColor: "#FFFFFF"
    }
    const tilteStyle = {
        fontSize: "16px",
        color: "#393A3E",
        fontWeight: "800",
        padding: "13px 22px",
        lineHeight: "28px",
        borderBottom: "1px solid #E9E9E9",
    };
    const contentStyle = { padding: "15px 22px", backgroundColor: "#FFFFFF" }
    return <div style={wrapperStyle}>
        <div style={tilteStyle}>{title}</div>
        <div style={contentStyle}>{children}</div>
    </div>
}

export default Card;