import React, { useEffect, useState } from "react";
import { BookA, NotebookPen, Trash2 } from "lucide-react"; // Add Trash2 import
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup, togglereadBookPopup, togglerecordBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify"; 
import { fetchAllBooks, resetBookSlice, deleteBook } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup"
import ReadBookPopup from"../popups/ReadBookPopup"
import RecordBookPopup from "../popups/RecordBookPopup";

const BookManagement = ({ hideHeader }) => {
  const dispatch=useDispatch();
  const {loading,error,message,books}=useSelector(state=>state.book);
  const {isAuthenticated,user}=useSelector(state=>state.auth);
  const {addBookPopup,
    readBookPopup,
    recordBookPopup,}=useSelector(state=>state.popup);
    const {loading:borrowSliceLoading,error:borrowSliceError,message:borrowSliceMessage}=useSelector(state=>state.borrow)
    const [readBook,setReadBook]=useState({});
    const openReadPopup=(id)=>{
      const book=books.find(book=>book._id===id);
      setReadBook(book);
      dispatch(togglereadBookPopup());
    };

    const [borrowBookId,setBorrowBookId]=useState("");
    const openRecordBookPopup=(bookId)=>{
      setBorrowBookId(bookId);
      dispatch(togglerecordBookPopup());
    };

    useEffect(()=>{
      if(message ||borrowSliceMessage){
        toast.success(message||borrowSliceMessage);
        dispatch(fetchAllBooks());
        dispatch(fetchAllBorrowedBooks());
        dispatch(resetBookSlice());
        dispatch(resetBorrowSlice());
      }
      if(error||borrowSliceError){
        toast.error(error||borrowSliceError);
        dispatch(resetBookSlice());
        dispatch(resetBorrowSlice());
      }
    },[dispatch,message,error,loading,borrowSliceError,borrowSliceLoading,borrowSliceMessage]);

    const [searchedKeyword,setSearchedKeyword]=useState("");
    const handleSearch=(e)=>{
      setSearchedKeyword(e.target.value.toLowerCase());
    }
    const searchedBooks=books.filter((book)=>
      book.title.toLowerCase().includes(searchedKeyword)
    );

    // Add delete handler function
    const handleDeleteBook = (bookId) => {
      if (window.confirm('Are you sure you want to delete this book?')) {
        dispatch(deleteBook(bookId));
      }
    };

  return <>
    <main className="relative flex-1 p-6 pt-28">
      {!hideHeader && <Header/>} {/* Only render Header if hideHeader is false */}
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
      <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
        {user && user.role==="Admin"?"BookManagement":"Books"}
      </h2>
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        {
          isAuthenticated && user?.role==="Admin" && (
            <button onClick={()=>dispatch(toggleAddBookPopup())} className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800">
              <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">+</span>
              Add Book
            </button>
          )
        }
        <input type="text" placeholder="search..." className="w-full sm:52 border p-2 border-gray-300 rounded-md" value={searchedKeyword} onChange={handleSearch}/>
      </div>
      </header>
      {/* table */}
      {
        books &&  books.length>0?(
            <div className="mt-6 overflow-x-auto bg-white rounded-lg shadow-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                      Serial no
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                      Author
                    </th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                        Quantity
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                      Availability
                    </th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchedBooks.map((book, index) => (
                    <tr key={book._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="line-clamp-2 hover:line-clamp-none hover:cursor-pointer">
                          {book.title}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <div className="whitespace-pre-line line-clamp-2 hover:line-clamp-none">
                          {formatAuthors(book.author)}
                        </div>
                      </td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {book.quantity || book.Quantity || 0}
                        </td>
                      )}
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          book.availibility 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {book.availibility ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex justify-center space-x-3">
                            <button 
                              onClick={() => openReadPopup(book._id)}
                              className="text-gray-600 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                              <BookA size={18} />
                            </button>
                            <button 
                              onClick={() => openRecordBookPopup(book._id)}
                              className="text-gray-600 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                              <NotebookPen size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteBook(book._id)}
                              className="text-gray-600 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        ):(
          <h3 className="text-3xl mt-5 font-medium">No books found in library</h3>
        )
      }
    </main>
    {addBookPopup && <AddBookPopup/>}
    {readBookPopup && <ReadBookPopup book={readBook}/>}
    {recordBookPopup && <RecordBookPopup bookId={borrowBookId}/>}
  
  </>;
};

const formatAuthors = (authors) => {
  if (!authors) return '';
  if (!authors.includes('•')) return authors;
  
  return authors
    .split('•')
    .map(author => author.trim())
    .filter(author => author.length > 0)
    .join('\n');
};

export default BookManagement;
