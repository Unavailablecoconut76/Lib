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
  <div className="flex flex-col justify-center
   md:flex-row h-screen">
    {/* leftside */}
    <div className="hidden w-full md:w-1/2 
    bg-black text-white md:flex flex-col 
    items-center justify-center p-8 rounded-tr-[80-px] rounded-br-[80px]">
      <div className="text-center h-[376px]">
        <div className="flex justify-center mb-12">
          <img src={logo_with_title} alt="logo"
          className="mb-12 h-44 w-auto"/>
        </div>
        <p className="text-gray-300 mb-12">Sign in if already having account</p>
        <Link to={"/login"} className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition">sign in</Link>
      </div>
    </div>


    {/* rightside */}
    <div className="w-full md:w-1/2 flex items-center justify-center g-white p-8">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-12">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">
          <h3 className="font-medium text-4xl overflow-hidden">Sign up</h3>
          <img src={logo_with_title_black} alt="logo" className="h-auto w-24 object-cover"/>
          </div>
        </div>
          <p className="text-gray-800 text-center mb-12">pls provide info to sign up</p>
          
        <form onSubmit={handleRegister}>
        <div>
            <input type="text" 
            value={name} 
            onChange={(e)=>setName(e.target.value)} 
            placeholder="full name"  
            className="w-full px-4 py-3 
            border border-black rounded-md 
            focus:outline-none"/>
        </div>
          <div>
            <input type="text" 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)} 
            placeholder="email"  
            className="w-full px-4 py-3 
            border border-black rounded-md 
            focus:outline-none"/>
          </div>
          <div>
            <input type="text" 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} 
            placeholder="Password"  
            className="w-full px-4 py-3 
            border border-black rounded-md 
            focus:outline-none"/>
          </div>
          <div className="block md:hidden font-semibold mt-5">
            <p>Already have an acc?
            <Link to="/login" className="text-sm text-gray-500 hover:underline">Sign in</Link>
            </p>
          </div>
          <button type="submit" className="border-2 mt-5 border-black 
          w-full font-semibold bg-black 
          text-white py-2 rounded-lg 
          hover:bg-white hover:bg-white 
          hover:text-black transition">SIGN UP</button>

        </form>
      </div>
    </div>
  </div></>
  );
};

export default Register;
