import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { togglereturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup"
import Header from "../layout/Header";
import * as XLSX from 'xlsx';

const Catalog = () => {
  const dispatch=useDispatch();
  const {returnBookPopup}=useSelector(state=>state.popup);
  const{loading,error,message,userBorrowedBooks,allBorrowedBooks}=useSelector(state=>state.borrow);
  const [filter,setFilter]=useState("borrowed");

  const formatDateandime = (timeStamp) => {
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

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2,"0")}-${String(
      date.getMonth()+1
  ).padStart(2,"0")}-${date.getFullYear()}`;
  };

  const currentdate= new Date();
  const borrowedBooks=allBorrowedBooks?.filter(book=>{
    const dueDate =new Date(book.dueDate);
    return dueDate>currentdate;
  });

  const overdueBooks=allBorrowedBooks?.filter(book=>{
    const dueDate =new Date(book.dueDate);
    return dueDate<=currentdate;
  });

  const booksToDisplay=filter ==="borrowed"? borrowedBooks:overdueBooks;

  const [email,setEmail]=useState("");
  const[borrowedBookId,setBorrowedbookId]=useState("");

  const openReturnbookPopup=(bookId,email)=>{
    setBorrowedbookId(bookId);
    setEmail(email);
    dispatch(togglereturnBookPopup());
  }
  useEffect(()=>{
    if(message){
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error){
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  },[dispatch,error,message,loading])

  const exportData = (format) => {
    const data = booksToDisplay.map(book => ({
      Username: book.user.name,
      Email: book.user.email,
      'Book Title': book.book.title,
      'Due Date': new Date(book.dueDate).toLocaleDateString(),
      'Borrow Date': new Date(book.createdAt).toLocaleDateString(),
      Status: book.returnDate ? 'Returned' : 'Borrowed'
    }));

    if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Catalog');
      XLSX.writeFile(wb, 'catalog.xlsx');
    } else {
      const csv = data.map(row => 
        Object.values(row).join(',')
      ).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'catalog.csv';
      a.click();
    }
  };

  return <>
    <main className="relative flex-1 p-6 pt-28">
    <Header/>
    {/* subheader */}

    
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex w-full md:w-auto gap-3">
        <button
          className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg 
            sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 
            ${filter === "borrowed" ? "bg-black text-white border-black" : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"}`}
          onClick={() => setFilter("borrowed")}
        >
          Borrowed Books
        </button>

        <button
          className={`relative rounded sm:rounded-tr-tl-none sm:rounded-bl-none sm:rounded-tr-lg 
            sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 
            ${filter === "overdue" ? "bg-black text-white border-black" : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"}`}
          onClick={() => setFilter("overdue")}
        >
          Overdue Borrowers
        </button>
      </div>

      {/* Right-aligned export buttons */}
      <div className="flex space-x-2 mt-2 md:mt-0">
        <button
          onClick={() => exportData('xlsx')}
          className="flex items-center px-4 py-2 bg-black text-white rounded shadow-sm hover:shadow-md transition-shadow"
        >
          <FaFileExcel className="mr-2" />
          Export XLSX
        </button>

        <button
          onClick={() => exportData('csv')}
          className="flex items-center px-4 py-2 bg-black text-white rounded shadow-sm hover:shadow-md transition-shadow"
        >
          <FaFileCsv className="mr-2" />
          Export CSV
        </button>
      </div>
    </header>

    {
      booksToDisplay && booksToDisplay.length>0?(
        <div className="mt-6 overflow bg-white rounded-md shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4py-2 text-left">ID</th>
                <th className="px-4py-2 text-left">username</th>
                <th className="px-4py-2 text-left">email</th>
                <th className="px-4py-2 text-left">due date</th>
                <th className="px-4py-2 text-left">date and time</th>
                <th className="px-4py-2 text-left">Return</th>
              </tr>
            </thead>
            <tbody>
              {
                booksToDisplay.map((book,index)=>(
                  <tr key={index} className={(index+1)%2===0?"bg-gray-50":""}>
                    <td className="px-4 py-2">{index+1}</td>
                    <td className="px-4 py-2">{book?.user.name}</td>
                    <td className="px-4 py-2">{book?.user.email}</td>
                    <td className="px-4 py-2">{formatDate(book.dueDate)}</td>
                    <td className="px-4 py-2">{formatDateandime(book.createdAt)}</td>
                    <td className="px-4 py-2">{book.returnDate?(
                      <FaSquareCheck className="w-6 h-6"/>):(<PiKeyReturnBold onClick={()=>openReturnbookPopup(book.book,book?.user.email)} className="w-6 h-6"/>
                    )}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      ):(
        <h3 className="text-3xl mt-5 font-medium">NO {filter==="borrowed"?"borrowed":"overdue"} books founnd!</h3>
      )
    }
    </main>
    {returnBookPopup && (<ReturnBookPopup bookId={borrowedBookId} email={email}/>)}
  </>;
};

export default Catalog;
