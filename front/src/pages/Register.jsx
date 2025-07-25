import React, { useEffect, useState } from "react";
import logo_with_title_black from "../assets/logo-with-title-black.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from "react-router-dom"
import { register, resetAuthSlice } from "../store/slices/authSlice";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Register = () => {
  const [name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword] =useState("");

  const dispatch=useDispatch();

  const{loading,error,message,user,isAuthenticated}=useSelector((state)=>state.auth);
  
  const navigateTo =useNavigate();

  const handleRegister=(e)=>{
    e.preventDefault();
    const data= new FormData();
    data.append("name",name);
    data.append("email",email);
    data.append("password",password);
    dispatch(register(data));
  };

  useEffect(()=>{
    if(message)
      navigateTo(`/otp-verification/${email}`);
    if(error){
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  },[dispatch,isAuthenticated,error,loading]);

  if(isAuthenticated)
      return <Navigate to ={"/"}/>;


  return( <>
    <div className="flex flex-col justify-center md:flex-row h-screen">
      {/* left side - update border radius to match login */}
      <div className="absolute top-0 w-full text-center py-6 z-50 ">
        <h1 className="text-6xl md:text-7xl font-black tracking-wider leading-tight">
          <span className="text-white">LIBRARY</span>
          <span className="text-white"> MA</span>
          <span className="text-white md:text-black">NAGEMENT</span>
        </h1>
        <p><span className="text-white">Compu</span><span className="text-white md:text-black">terDept</span>
         </p>
      </div>
      <div className="hidden w-full md:w-1/2 
        bg-black text-white md:flex flex-col 
        items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center h-[400px]">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo"
              className="mb-12 h-44 w-auto"/>
          </div>
          <p className="text-gray-300 mb-12">Sign in if already having account</p>
          <Link 
            to="/login"
            className="border-2 mt-5 border-white px-8 w-full font-semibold 
              bg-black text-white py-2 rounded-lg 
              hover:bg-white hover:text-black transition"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* right side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 relative">
        <div className="max-w-sm w-full">
          <div className="flex justify-center mb-8">
            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">
              <h3 className="text-3xl font-medium overflow-hidden">Sign up</h3>
              <img src={logo_with_title_black} alt="logo" className="h-20 w-auto" />
            </div>
          </div>
          <p className="text-gray-800 text-center mb-8">Enter info for Signing up</p>
          
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-800 tracking-wide">
                Full Name
              </label>
              <input 
                type="text" 
                id="name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your name"  
                required
                minLength={3}
                className="w-full px-4 py-3 
                  border-2 border-gray-200 rounded-lg
                  focus:outline-none focus:border-black 
                  shadow-sm hover:border-gray-300
                  placeholder:text-gray-400 text-gray-700
                  transition-all duration-300 ease-in-out
                  bg-gray-50 bg-opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 tracking-wide">
                Email Address
              </label>
              <input 
                type="email" 
                id="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@example.com"
                required  
                className="w-full px-4 py-3 
                  border-2 border-gray-200 rounded-lg
                  focus:outline-none focus:border-black 
                  shadow-sm hover:border-gray-300
                  placeholder:text-gray-400 text-gray-700
                  transition-all duration-300 ease-in-out
                  bg-gray-50 bg-opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 tracking-wide">
                Password
              </label>
              <input 
                type="password" 
                id="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 
                  border-2 border-gray-200 rounded-lg
                  focus:outline-none focus:border-black
                  shadow-sm hover:border-gray-300
                  placeholder:text-gray-400 text-gray-700
                  transition-all duration-300 ease-in-out
                  bg-gray-50 bg-opacity-50"
              />
            </div>

            <div className="block md:hidden font-medium text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-black hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full px-5 py-3
                bg-black text-white font-semibold 
                rounded-lg shadow-md
                hover:bg-white hover:text-black 
                border-2 border-black
                transition-all duration-300 ease-in-out
                transform hover:scale-[1.01]
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Creating Account...</span>
                </span>
              ) : (
                'SIGN UP'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  </>);
};

export default Register;
