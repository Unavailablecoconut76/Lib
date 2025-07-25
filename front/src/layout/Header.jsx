import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";

const Header = () => {
  const dispatch = useDispatch();
  const {user}=useSelector((state)=>state.auth);

  const [currentTime,setCurrentTime]=useState("");
  const [currentDate,setCurrentDate]=useState("");

  useEffect(()=>{
    const updatedateTime=()=>{
      const noww= new Date();
        const hours =noww.getHours()%12||12;
        const minutes = noww.getMinutes().toString().padStart(2,"0");
        const ampm = noww.getHours() >=12?"PM":"AM";
        setCurrentTime(`${hours}:${minutes} ${ampm}`);

        const options={month:"short",dat :"numeric",year:"numeric"};
        setCurrentDate(noww.toLocaleDateString("en-India",options))
    };

    updatedateTime();

    const intervalId= setInterval(updatedateTime,1000);
    return ()=>clearInterval(intervalId);
  },[]);
  return <>
  <header className="absolute top-0 bg-white w-full py-4 px-6 left-0 shadow-md flex justify-between items-center">
    {/*left side */}
    <div className="flex items-center gap-2">
      <img src={userIcon} alt="usericon" />
      <div className="flex flex-col">
        <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
          {user && user.name}
        </span>
        <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
          {user && user.role}
        </span>
      </div>
    </div>
    {/* right side */}
    <div className="hidden md:flex item-center gap-2">
      <div className="flex flex-col text-sm lg:text-base items-end font-semibold">
        <span>{currentTime}</span>
        <span>{currentDate}</span>
      </div>
      <span className="bg-black g-14 w-[2px]"></span>
      <img src={settingIcon} alt="settingicon" className="w-8 h-8" onClick={()=>dispatch(toggleSettingPopup())} />
    </div>
    </header></>;
};

export default Header;
