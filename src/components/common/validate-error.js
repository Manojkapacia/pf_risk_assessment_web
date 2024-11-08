import React from 'react';

const ValidationError = ({ message }) => {
    return message ? <div className="text-danger mt-1">{message}</div> : null;
};

export default ValidationError;
