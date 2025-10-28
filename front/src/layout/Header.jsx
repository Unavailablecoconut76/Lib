import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { motion, AnimatePresence } from "framer-motion";

const appURL=import.meta.env.VITE_APP_URL;

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // const endpoint = user.role =="Admin" ? "/pending" : "/my-requests";
        const response = await fetch(
          `${appURL}/api/v1/book-requests${user.role === "Admin" ? "/pending" : "/my-requests"}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data.requests || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    if (user) {
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle admin actions
  const handleRequestAction = async (requestId, action) => {
    try {
      await fetch(`${appURL}/api/v1/book-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });
      // Refresh notifications
      const updatedNotifications = notifications.filter(
        (n) => n._id !== requestId
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error handling request:", error);
    }
  };

  // Clock logic
  useEffect(() => {
    const updatedateTime = () => {
      const noww = new Date();
      const hours = (noww.getHours() % 12) || 12;
      const minutes = noww.getMinutes().toString().padStart(2, "0");
      const ampm = noww.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(noww.toLocaleDateString("en-India", options));
    };

    updatedateTime();
    const intervalId = setInterval(updatedateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="absolute top-0 bg-white w-full py-4 px-6 left-0 shadow-md flex justify-between items-center">
      {/* Left side */}
      <div className="flex items-center gap-2">
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <img
            src={userIcon}
            alt="usericon"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
            {user && user.name}
          </span>
          <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
            {user && user.role}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex flex-col text-sm lg:text-base items-end font-semibold">
          <span>{currentTime}</span>
          <span>{currentDate}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 hover:text-gray-900 relative"
          >
            <FaBell size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50"
              >
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    {user.role === "Admin" ? "Book Requests" : "My Requests"}
                  </h3>
                  {notifications.length === 0 ? (
                    <p className="text-gray-500">No notifications</p>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className="p-3 border rounded-lg"
                        >
                          {user.role === "Admin" ? (
                            // Admin view
                            <>
                              <p className="font-medium">{notification.user.name}</p>
                              <p className="text-sm text-gray-600">
                                {notification.book.title}
                              </p>
                              <div className="mt-2 flex gap-2">
                                <button
                                  onClick={() =>
                                    handleRequestAction(notification._id, "approved")
                                  }
                                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleRequestAction(notification._id, "rejected")
                                  }
                                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                  Reject
                                </button>
                              </div>
                            </>
                          ) : (
                            // User view
                            <>
                              <p className="font-medium">{notification.book.title}</p>
                              <p className="text-sm text-gray-600">
                                Status:{" "}
                                {notification.status
                                  .charAt(0)
                                  .toUpperCase() +
                                  notification.status.slice(1)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Valid till:{" "}
                                {new Date(notification.validTill).toLocaleDateString()}
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span className="bg-black h-14 w-[2px]"></span>
        <img
          src={settingIcon}
          alt="settingicon"
          className="w-8 h-8"
          onClick={() => dispatch(toggleSettingPopup())}
        />
      </div>
    </header>
  );
};

export default Header;
