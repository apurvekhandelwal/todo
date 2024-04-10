import React, { useState, useEffect } from "react";

const Loader = () => {
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setShowLoader(false);
        }, 2000);
    }, []);

    return (
        <>
            {showLoader && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}
        </>
    );
};

export default Loader;