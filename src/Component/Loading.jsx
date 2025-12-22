import React from "react";
import FullLogo from "../Image/hfactor-logo-dark.png";

const Loading = () => {
    return (
        <>
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">

                {/* CIRCLE */}
                <div className="relative h-44 w-44 flex items-center justify-center">

                    {/* Rotating Circle (Full Round Border) */}
                    <div className="animate-spin rounded-full h-40 w-40 border-b-2 border-indigo-800"></div>


                    {/* Center Text */}
                    <div className="text-black font-semibold text-lg absolute">
                        <img src={FullLogo} alt="" width={110} />
                    </div>

                </div>
            </div>
        </>
    );
};

export default Loading;