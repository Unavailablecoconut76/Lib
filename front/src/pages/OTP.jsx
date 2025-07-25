import React, { useEffect, useState } from "react";
import logo_with_title_black from "../assets/logo-with-title-black.png";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message, user, isAuthenticated } = useSelector((state) => state.auth);

  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  };

  useEffect(() => {
    if (message) toast.success(message);
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative overflow-hidden">
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="border-2 border-black rounded-3xl font-bold w-40 py-2 px-4
            fixed top-8 left-8 z-50
            hover:bg-black hover:text-white transition duration-300 text-end"
        >
          Back
        </button>
        <div className="max-w-sm w-full mt-20 md:mt-0 overflow-hidden">
          <div className="flex justify-center mb-12 overflow-hidden">
            <div className="rounded-full flex items-center justify-center overflow-hidden">
              <img src={logo_with_title_black} alt="logo" className="h-24 w-auto object-contain" draggable={false} />
            </div>
          </div>
          <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden">Check your mailbox</h1>
          <p className="text-gray-800 text-center mb-12 overflow-hidden">Please enter OTP</p>
          <form onSubmit={handleOtpVerification}>
            <div className="mb-4">
              <input
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 rounded-lg
                hover:bg-white hover:text-black transition"
            >
              VERIFY
            </button>
          </form>
        </div>
      </div>
      {/* Right Section */}
      <div className="hidden md:flex w-full md:w-1/2 bg-black text-white flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px] overflow-hidden">
        <div className="text-center h-[400px] flex flex-col justify-center overflow-hidden">
          <div className="flex justify-center mb-12 overflow-hidden">
            <img src={logo_with_title_black} alt="logo" className="mb-12 h-44 w-auto object-contain" draggable={false} />
          </div>
          <p className="text-gray-300 mb-12 overflow-hidden">Sign up if new</p>
          <Link
            to="/register"
            className="border-2 mt-5 border-white px-8 w-full font-semibold bg-black text-white py-2 rounded-lg
              hover:bg-white hover:text-black transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTP;
