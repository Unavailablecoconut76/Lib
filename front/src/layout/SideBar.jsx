import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { toast } from "react-toastify";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";
import { useNavigate } from 'react-router-dom';

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const [activeButton, setActiveButton] = useState("Dashboard");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {addNewAdminPopup,settingPopup}=useSelector(state=>state.popup);
  const { loading, error, message, user, isAuthenticated } = 
  useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  const buttonClassName = (buttonName) => `
    w-full py-3 font-medium rounded-md
    transition-all duration-200 ease-in-out
    flex items-center space-x-3 px-4
    ${activeButton === buttonName 
      ? 'bg-white/10 shadow-lg transform scale-105' 
      : 'hover:bg-white/5 hover:scale-102'}
  `;

  return (
    <>
      <aside
        className={`
          ${isSideBarOpen ? "left-0" : "-left-full"}
          z-10 transition-all duration-500 ease-in-out
          md:relative md:left-0 flex w-64
          bg-gradient-to-b from-black to-gray-900
          text-white flex-col h-full
          shadow-2xl
        `}
        style={{ position: "fixed" }}
      >
        {/* Logo section with animation */}
        <div className="px-6 py-4 my-8 transition-transform duration-300 hover:scale-105">
          <img src={logo_with_title} alt="logo" className="w-full" />
        </div>
         
        <nav className="flex-1 px-4 space-y-3">
          <button
            onClick={() => {
              setSelectedComponent("Dashboard");
              setActiveButton("Dashboard");
            }}
            className={buttonClassName("Dashboard")}
          >
            <img src={dashboardIcon} alt="dashboard" className="w-5 h-5 transition-transform group-hover:scale-110" /> 
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => {
              setSelectedComponent("Books");
              setActiveButton("Books");
            }}
            className={buttonClassName("Books")}
          >
            <img src={bookIcon} alt="books" className="w-5 h-5 transition-transform group-hover:scale-110" /> 
            <span>Books</span>
          </button>

          {/* oonly admin roles*/}
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                onClick={() => {
                  setSelectedComponent("Catalog");
                  setActiveButton("Catalog");
                }}
                className={buttonClassName("Catalog")}
              >
                <img src={catalogIcon} alt="catalog" className="w-5 h-5" /> 
                <span>Catalog</span>
              </button>

              <button
                onClick={() => {
                  setSelectedComponent("Users");
                  setActiveButton("Users");
                }}
                className={buttonClassName("Users")}
              >
                <img src={usersIcon} alt="users" className="w-5 h-5" /> 
                <span>Users</span>
              </button>

              <button
                className="w-full py-2 font-medium
                 bg-transparent rounded-md 
                 hover:cursor-pointer flex items-center 
                 space-x-2"
                 onClick={() => dispatch(toggleAddNewAdminPopup())}
                >
                <RiAdminFill className="w-6 h-6" /> 
                <span>Add New Admin</span>
              </button>
            </>
          )}
          
          {/* user chech roles */}
          {isAuthenticated && user?.role === "User" && (
            <button
              onClick={() => setSelectedComponent("My Borrowed Books")}
              className="w-full py-2 font-medium 
              bg-transparent rounded-md hover:cursor-pointer 
              flex items-center space-x-2"
            >
              <img src={catalogIcon} alt="my-borrowed-books" />{" "}
              <span>My Borrowed Books</span>
            </button>
          )}
          <button
            onClick={() => dispatch(toggleSettingPopup())}
            className=" w-full py-2 
            font-medium bg-transparent 
            rounded-md hover:cursor-pointer 
            flex items-center space-x-2"
          >
            <img src={settingIcon} alt="setting" />{" "}
            <span>Update Credentials</span>
          </button>
        </nav>
        
        {/* Logout section */}
        <div className="px-4 py-6 mt-auto">
          <button
            className="w-full py-3 font-medium text-center
              rounded-md transition-all duration-200
              hover:bg-red-500/20 hover:text-red-300
              flex items-center justify-center space-x-3"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="logout" className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
        
        {/* Close button with hover effect */}
        <button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="absolute top-4 right-4 md:hidden
            transition-transform duration-200 hover:scale-110
            hover:rotate-180"
        >
          <img src={closeIcon} alt="close" className="w-6 h-6" />
        </button>
      </aside>
      {addNewAdminPopup && <AddNewAdmin/>}
      {settingPopup && <SettingPopup/>}

    </>
  );
};

export default SideBar;
