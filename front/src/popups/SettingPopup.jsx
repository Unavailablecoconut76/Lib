import React, { useState } from 'react'
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../store/slices/authSlice';
import settingIcon from "../assets/setting.png"
import { toggleSettingPopup } from '../store/slices/popUpSlice';

const SettingPopup = () => {
  const [currentPassword,setCurrentPassword]=useState("")
  const[newPassword,setNewPassword]=useState("");
  const [confirmNewPassword,setConfirmNewPassword]=useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch=useDispatch();
  const {loading}=useSelector((state)=>state.auth);
  const handleUpdatePassword=(e)=>{
    e.preventDefault();
    // Change FormData to regular object
    const data = {
      currentPassword: currentPassword,  // fixed the field name
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword  
    };
    dispatch(updatePassword(data));
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
            <div className="w-full bg-white rounded-lg shadow-lg md:w-auto lg:w-1/2 2xl:w-1/3">
            <div className="p-6">
              <header className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-black">
                <div className="flex items-center gap-3">
                  <img src={settingIcon} alt="settingicon" className="bg-gray-300 p-5 rounded-lg"/>
                  <h3 className="text-xl font-bold">Change credentials</h3>
                </div>
                <img src={closeIcon} alt="closeicon" onClick={()=>dispatch(toggleSettingPopup())}/>
              </header>

              <form onSubmit={handleUpdatePassword}>

                <div className="mb-4 sm:flex gap-4 items-center">
                  <label className="block text-gray-900 font-medium w-full">Enter Current Password</label>
                  <div className="w-full relative">
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      value={currentPassword} 
                      onChange={(e)=>setCurrentPassword(e.target.value)} 
                      placeholder="Current Password" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
    
                {/* For new password */}
                <div className="mb-4 sm:flex gap-4 items-center">
                  <label className="block text-gray-900 font-medium w-full">Enter New Password</label>
                  <div className="w-full relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      value={newPassword} 
                      onChange={(e)=>setNewPassword(e.target.value)} 
                      placeholder="New Password" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
    
                {/* For confirm password */}
                <div className="mb-4 sm:flex gap-4 items-center">
                  <label className="block text-gray-900 font-medium w-full">Confirm New Password</label>
                  <div className="w-full relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmNewPassword} 
                      onChange={(e)=>setConfirmNewPassword(e.target.value)} 
                      placeholder="Confirm New Password" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                    {/* buttons */}
                  {/* <div className="flex justify-end space-x-4">
                    <button type="button" onClick={()=>dispatch(toggleAddNewAdminPopup())} className="px-4 py-2 bg-gray-200 rounded-md hover:gray-300">Close</button>
                    <button type="submit"disabled={loading} className="px-4 py-2 bg-black text-white rounded-md hover:gray-800">Add</button>
                  </div>
                   */}
                  <div className='flex gap-4 mt-10'>
                  <button type="button" onClick={()=>dispatch(toggleSettingPopup())} className="px-4 py-2 bg-gray-200 rounded-md hover:gray-300">Cancel</button>
                  <button type="submit"disabled={loading} className="px-4 py-2 bg-black text-white rounded-md hover:gray-800">Confirm</button>
                  </div>
              </form>
            </div>
            </div>
        </div>
  )
}

export default SettingPopup
