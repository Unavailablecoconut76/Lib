import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import {useSelector} from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {Navigate} from "react-router-dom";
import SideBar from "../layout/SideBar";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import UserDashboard from "../components/UserDashboard";
import Users from "../components/Users";
import Utility from "../components/Utility";


const Home = () => {
  const [isSideBarOpen,setIsSideBarOpen]=useState(false);
  const [selectedComponent,setSelectedComponent]=useState("");
  const {user,isAuthenticated}=useSelector((state)=>state.auth);
  const [hasShownBlacklistWarning, setHasShownBlacklistWarning] = useState(false);
  // if(!isAuthenticated)
  //   return <Navigate to ={"/login"}/>

  useEffect(() => {
    if (user && user.blacklisted && !hasShownBlacklistWarning) {
      toast.error("You are blacklisted. Please contact an admin to unblacklist you.", {
        autoClose: 5000,
        closeOnClick: true,
      });
      setHasShownBlacklistWarning(true);
    }
    
    // Reset the flag when user is no longer blacklisted
    if (user && !user.blacklisted && hasShownBlacklistWarning) {
      setHasShownBlacklistWarning(false);
    }
  }, [user, hasShownBlacklistWarning]);

  return (<>
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
      <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center  bg-black rounded-md h-9 w-9 text-white">
        <GiHamburgerMenu className="text-2xl" onClick={()=>setIsSideBarOpen(!isSideBarOpen)}/>
      </div>
      <SideBar 
      isSideBarOpen={isSideBarOpen} 
      setIsSideBarOpen={setIsSideBarOpen} 
      setSelectedComponent={setSelectedComponent}
      />

      {(
        ()=>{
          switch(selectedComponent){
            case "Dashboard":
              return user?.role==="User"?(<UserDashboard/>):(<AdminDashboard/>)//returns undefined for user==null or defined
            case "Books":
              return <BookManagement/>
            case "Catalog":
              if(user.role==="Admin")
                return <Catalog/>
              break;
            case "Users":
              if(user.role==="Admin")
                return <Users/>
              break;
            case "My Borrowed Books":
              return <MyBorrowedBooks/>
            case "Utility":
              if(user.role === "Admin")
                return <Utility/>;
                break;
            default:
              return user?.role==="User"?(
                <UserDashboard/>
              ):(
                <AdminDashboard/>
              );
          }
        })()//immediately invoked func expression((IIFE syntax))
      }
      </div></>
    );
};

export default Home;
