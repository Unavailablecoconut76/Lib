import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header"

const Users = ({ hideHeader }) => {
  const {users} = useSelector(state => state.user)
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getFilteredUsers = () => {
    return users.filter(user => 
      user.role === "User" && 
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    
    const formattedDate = `${String(date.getDate()).padStart(2,"0")}-${String(
        date.getMonth()+1
    ).padStart(2,"0")}-${date.getFullYear()}`;
    
    const formattedTime = `${String(date.getHours()).padStart(2,"0")}:${String(
        date.getMinutes()
    ).padStart(2,"0")}:${String(date.getSeconds()).padStart(2,"0")}`;
    
    const result = `${formattedDate} ${formattedTime}`; // Added space between date and time
    return result;
  };

  return <>
    <main className="relative flex-1 p-6 pt-28">
      {!hideHeader && <Header/>}
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
          Registered Users
        </h2>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
      </header>
      {
        users && getFilteredUsers().length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-center">No.of books borrowed</th>
                    <th className="px-4 py-2 text-left">Registered On</th>
                </tr>
              </thead>
              <tbody>
                {
                getFilteredUsers().map((user,index)=>(
                  <tr key={user._id} className={(index+1)%2===0 ? "bg-gray-50":""}>
                    <td className="px-4 py-2">{index+1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2 text-center">{user.borrowedBooks.length}</td>
                    <td className="px-4 py-2 ">{formatDate(user.createdAt)}</td>
                  </tr>
                ))
                }
              </tbody>
            </table>
          </div>
        ) : <h3 className="text-3xl mt-1 font-medium">No users found</h3>
      }
    </main>
  </>;
};

export default Users;
