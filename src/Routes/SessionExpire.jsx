import React from "react";
import { useNavigate } from "react-router-dom";
import TimeOut from "../Image/Timeout.gif";
import "./SessionExpire.css";
import { useDispatch } from "react-redux";
import { persistor } from "../Store/Store";
import { resetGlobalStore } from "../Store/Slices/GlobalSlice";
import { resetGlobalSaveStore } from "../Store/Slices/GlobalSaveSlice";
// import Footer from "../Layout/Footer";

const SessionExpire = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginRedirect = async () => {

    dispatch({ type: "RESET_AUTH" });
    dispatch(resetGlobalStore());
    dispatch(resetGlobalSaveStore());
    localStorage.clear();
    sessionStorage.clear();
   if (persistor) {
         await persistor.flush();   // ensures pending state is written
         await persistor.purge();   // clears persisted data
       }
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white min-h-screen relative">
      {/* Timeout Image */}
      <img
        src={TimeOut}
        alt="Session Timeout"
        className="w-[100%]  md:max-w-md lg:max-w-lg h-auto"
      />

      {/* Text Content */}
      <div className="text-center -mt-10 z-10">
        <h2 className="text-red-600 text-xl md:text-2xl lg:text-3xl font-bold mb-2">
          Session Expired
        </h2>
        <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-4">
          Your session has expired. Please log in again to continue.
        </p>
        <button className="btn green mt-3" onClick={handleLoginRedirect}>
          Go to Login
        </button>
      </div>

      {/* Footer */}
      {/* <div className="absolute bottom-0 w-full">
        <Footer />
      </div> */}
    </div>
  );
};

export default SessionExpire;