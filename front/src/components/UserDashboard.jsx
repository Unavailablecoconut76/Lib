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
import { motion } from "framer-motion"; // Add this import

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

  // Add animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return <>
    <main className="relative flex-1 p-4 pt-24 bg-gray-50">
      <Header/>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-3 gap-4"
      >
        {/* Stats Cards */}
        <motion.div 
          variants={itemVariants}
          className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 p-3 rounded-full transform transition-transform hover:rotate-12">
                <img src={bookIcon} alt="borrowed" className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Currently Borrowed</h3>
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold mt-1 text-black"
                >
                  {totalBorrowedBooks}
                </motion.p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 p-3 rounded-full transform transition-transform hover:rotate-12">
                <img src={bookIcon} alt="returned" className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Total Returned</h3>
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold mt-1 text-black"
                >
                  {totalReturnedBooks}
                </motion.p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 p-3 rounded-full transform transition-transform hover:rotate-12">
                <img src={bookIcon} alt="overdue" className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Overdue Books</h3>
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold mt-1 text-red-500"
                >
                  {overdueBooks}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          variants={itemVariants}
          className="xl:col-span-2 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Borrowing History</h3>
          <div className="h-[250px]">
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
        </motion.div>

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
        <motion.div 
          variants={itemVariants}
          className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-5 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 p-3 rounded-full transform transition-all duration-300 group-hover:rotate-12">
                <img src={bookIcon} alt="book" className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-semibold">Browse Books</h4>
                <p className="text-sm text-gray-600">Find new books to borrow</p>
              </div>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-5 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 p-3 rounded-full transform transition-all duration-300 group-hover:rotate-12">
                <img src={returnIcon} alt="return" className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-semibold">Return Books</h4>
                <p className="text-sm text-gray-600">Process book returns</p>
              </div>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-5 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 p-3 rounded-full transform transition-all duration-300 group-hover:rotate-12">
                <img src={browseIcon} alt="browse" className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-semibold">View History</h4>
                <p className="text-sm text-gray-600">Check borrowing history</p>
              </div>
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </main>
  </>;
};

export default UserDashboard;
