import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../layout/Header"
import { handleToggleBlacklist } from "../store/slices/authSlice.js";

const BorrowedBooksDropdown = ({ books }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentlyBorrowed = books.filter(book => !book.returned).length;
  const allBorrowed = books.length;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 justify-center">
        <span>{currentlyBorrowed}</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 hover:text-blue-800"
        >
          View All ({allBorrowed})
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                 onClick={() => setIsOpen(false)} 
                 aria-hidden="true"></div>

            {/* Dropdown content */}
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Borrowed Books
                    </h3>
                    <div className="mt-2">
                      {/* Currently Borrowed Section */}
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-gray-700">
                          Currently Borrowed ({currentlyBorrowed})
                        </h4>
                        <div className="space-y-2">
                          {books.filter(book => !book.returned).map(book => (
                            <div key={book.bookId} className="p-2 bg-gray-50 rounded">
                              <p className="text-gray-900">{book.bookTitle}</p>
                              <p className="text-sm text-gray-500">
                                Borrowed: {new Date(book.borrowDate).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Returned Section */}
                      <div>
                        <h4 className="font-medium mb-2 text-gray-700">
                          Returned ({allBorrowed - currentlyBorrowed})
                        </h4>
                        <div className="space-y-2">
                          {books.filter(book => book.returned).map(book => (
                            <div key={book.bookId} className="p-2 bg-gray-50 rounded">
                              <p className="text-gray-600">{book.bookTitle}</p>
                              <p className="text-sm text-gray-400">
                                Returned: {new Date(book.returnDate).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Users = ({ hideHeader }) => {
  const {users} = useSelector(state => state.user)
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [localUsers, setLocalUsers] = useState([]);

  // Update local users when users from Redux change
  useEffect(() => {
    if (users) {
      setLocalUsers(users);
    }
  }, [users]);

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
  const handleToggleBlacklistLocal = async (userId) => {
    try {
      const result = await dispatch(handleToggleBlacklist(userId));
      
      if (result.success) {
        // Update local state to reflect the change immediately
        setLocalUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId 
              ? { ...user, blacklisted: !user.blacklisted }
              : user
          )
        );
      }
    } catch (error) {
      console.error('Error toggling blacklist:', error);
      toast.error('Failed to toggle blacklist status');
    }
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
                  <th className="px-4 py-2 text-center">No. of currently borrowed books</th>
                  <th className="px-4 py-2 text-left">Registered On</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                getFilteredUsers().map((user,index)=>(
                  <tr key={user._id} className={`${(index+1)%2===0 ? "bg-gray-50":""} ${user.blacklisted ? "bg-red-100" : ""}`}>
                    <td className="px-4 py-2">{index+1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2 text-center relative">
                      {/* Dropdown logic */}
                      <BorrowedBooksDropdown books={user.borrowedBooks} />
                    </td>
                    <td className="px-4 py-2 ">{formatDate(user.createdAt)}</td>
                    <td>
                      <button
                        className={`px-2 py-1 rounded ${user.blacklisted ? "bg-black-900 text-white" : "bg-red-900 text-white"}`}
                        onClick={() => handleToggleBlacklistLocal(user._id)}
                      >
                        {user.blacklisted ? "Un-blacklist" : "Blacklist"}
                      </button>
                    </td>
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
