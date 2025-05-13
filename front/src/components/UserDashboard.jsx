import React, { useEffect, useState } from "react";
import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import { Pie, Bar, Line } from "react-chartjs-2";
import {useSelector,useDispatch} from "react-redux";
import Header from "../layout/Header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const UserDashboard = () => {
  const {settingPopup}=useSelector((state)=>(state.popup));
  const {userBorrowedBooks}=useSelector((state)=>(state.borrow));
  const { user } = useSelector((state) => state.auth);

  const[totalBorrowedBooks,settotalBorrowedBooks]=useState(0);
  const[totalReturnedBooks,settotalReturnedBooks]=useState(0);
  const [monthlyBorrowStats, setMonthlyBorrowStats] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState(0);

  useEffect(()=>{
    let numberofTotalBorrowedBooks=userBorrowedBooks.filter((book)=> book.returned===false);
    let numberofTotalReturnedBooks=userBorrowedBooks.filter((book)=> book.returned===true);
    settotalBorrowedBooks(numberofTotalBorrowedBooks.length);
    settotalReturnedBooks(numberofTotalReturnedBooks.length);

    const currentDate = new Date();
    const monthlyStats = userBorrowedBooks.reduce((acc, book) => {
      const borrowMonth = new Date(book.borrowDate).getMonth();
      acc[borrowMonth] = (acc[borrowMonth] || 0) + 1;
      return acc;
    }, {});

    setMonthlyBorrowStats(monthlyStats);

    const overdue = userBorrowedBooks.filter(book => {
      return !book.returned && new Date(book.dueDate) < currentDate;
    }).length;
    setOverdueBooks(overdue);
  },[userBorrowedBooks])//will execute when change in dependency;userBorrowedBooks

  const handlePrint = () => {
    const printContent = `
      LIBRARY MANAGEMENT SYSTEM - USER REPORT
      --------------------------------------
      User: ${user?.name}
      Email: ${user?.email}
      Date: ${new Date().toLocaleDateString()}
      Time: ${new Date().toLocaleTimeString()}
      
      BORROWING STATISTICS
      -------------------
      Currently Borrowed: ${totalBorrowedBooks}
      Total Returned: ${totalReturnedBooks}
      Overdue Books: ${overdueBooks}
      
      Monthly Borrowing Summary
      ------------------------
      ${Object.entries(monthlyBorrowStats)
        .map(([month, count]) => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${monthNames[month]}: ${count} books`;
        })
        .join('\n')}
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>User Report - ${user?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 20px; margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .stats { margin-left: 20px; }
            .timestamp { color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <pre>${printContent}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const pieData={
    labels:["Total Borrowed Books","Total returned Books"],
    datasets:[
      {
        data:[totalBorrowedBooks,totalReturnedBooks],
        backgroundColor:["#3D3E3E","#151619"],
        hoverOffset:4
      },
    ],
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: 'Books Borrowed per Month',
      data: Object.values(monthlyBorrowStats),
      backgroundColor: '#3D3E3E',
      borderColor: '#151619',
      borderWidth: 1
    }]
  };

  return <>
    <main className="relative flex-1 p-4 pt-24"> {/* Reduced padding */}
      <Header/>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4"> {/* Reduced gap */}
        {/* Stats Cards */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3"> {/* Reduced gap */}
          <div className="bg-white p-4 rounded-lg shadow-sm"> {/* Reduced padding */}
            <h3 className="text-lg font-semibold">Currently Borrowed</h3>
            <p className="text-2xl font-bold mt-1">{totalBorrowedBooks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm"> {/* Reduced padding */}
            <h3 className="text-lg font-semibold">Total Returned</h3>
            <p className="text-2xl font-bold mt-1">{totalReturnedBooks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm"> {/* Reduced padding */}
            <h3 className="text-lg font-semibold">Overdue Books</h3>
            <p className="text-2xl font-bold mt-1 text-red-500">{overdueBooks}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="xl:col-span-2 bg-white p-4 rounded-lg shadow-sm"> {/* Reduced padding */}
          <h3 className="text-lg font-semibold mb-2">Borrowing History</h3>
          <div className="h-[250px]"> {/* Reduced height */}
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      font: { size: 11 } // Smaller font
                    }
                  },
                  x: {
                    ticks: {
                      font: { size: 11 } // Smaller font
                    }
                  }
                },
                plugins: {
                  legend: { 
                    position: 'top',
                    labels: {
                      boxWidth: 15,
                      padding: 8,
                      font: { size: 11 }
                    }
                  },
                  title: {
                    display: false // Removed title to save space
                  }
                },
                layout: {
                  padding: 5 // Reduced padding
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm"> {/* Reduced padding */}
          <h3 className="text-lg font-semibold mb-2">Books Status</h3>
          <div className="h-[250px] flex items-center justify-center"> {/* Added flex and height */}
            <Pie 
              data={pieData} 
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { 
                    position: 'bottom',
                    labels: {
                      font: { size: 11 },
                      padding: 8
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3"> {/* Reduced gap */}
          <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"> {/* Reduced padding */}
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 p-3 rounded-full">
                <img src={bookIcon} alt="book" className="w-6 h-6"/>
              </span>
              <div>
                <h4 className="font-semibold">Browse Books</h4>
                <p className="text-sm text-gray-600">Find new books to borrow</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"> {/* Reduced padding */}
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 p-3 rounded-full">
                <img src={returnIcon} alt="return" className="w-6 h-6"/>
              </span>
              <div>
                <h4 className="font-semibold">Return Books</h4>
                <p className="text-sm text-gray-600">Process book returns</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"> {/* Reduced padding */}
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 p-3 rounded-full">
                <img src={browseIcon} alt="browse" className="w-6 h-6"/>
              </span>
              <div>
                <h4 className="font-semibold">View History</h4>
                <p className="text-sm text-gray-600">Check borrowing history</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handlePrint}
        className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 flex items-center gap-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
          />
        </svg>
        Print Report
      </button>
    </main>
  </>;
};

export default UserDashboard;
