"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaBars, FaUser, FaGlobe, FaChevronDown, 
  FaSignOutAlt, FaCog, FaUserCircle 
} from "react-icons/fa";

import { Amplify } from 'aws-amplify';
import config from '@/amplify_outputs.json';

Amplify.configure(config);
interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [loginId, setLoginId] = useState("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  // Toggle Dropdowns (Only one can be open at a time)
  const toggleDropdown = (menu: string) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleLogout = () => {
    router.push('/signout');
  };

  useEffect(() => {
    if (typeof window !== "undefined") { // Next.js safe
      const session = localStorage.getItem('userSession');
      if (session) {
        const userSession = JSON.parse(session);
        console.log(userSession)
        setLoggedIn(userSession.isLoggedIn);
        setLoginId(userSession.signInDetails.loginId);
      }
    }
  }, []);

  return (
    <header className="bg-gray-900 text-white fixed w-full top-0 left-0 z-50 shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Sidebar Toggle */}
        <button onClick={toggleSidebar} className="text-xl focus:outline-none mr-4">
          <FaBars />
        </button>

        {/* Title */}
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>

        {/* Right-side Menu */}
        <div className="flex items-center space-x-6 ml-auto">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("language")}
              className="flex items-center space-x-1 focus:outline-none"
            >
              <FaGlobe className="text-xl mr-2" /> English
              <FaChevronDown />
            </button>
            {activeDropdown === "language" && (
              <div className="absolute right-0 mt-2 bg-gray-800 text-white shadow-lg rounded p-2 w-48">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {["English", "Español", "Français", "Deutsch", "Italiano", "Português", "हिंदी", "中文", "日本語"].map(
                    (lang) => (
                      <button key={lang} className="hover:bg-gray-700 p-1 rounded">
                        {lang}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
          <button
            onClick={() => toggleDropdown("profile")}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <FaUser className="text-xl" />
            <span>{loggedIn ? loginId : "Guest"}</span>
            <FaChevronDown />
          </button>

            {activeDropdown === "profile" && (
              <div className="absolute right-0 mt-2 bg-gray-800 text-white shadow-lg rounded w-40">
                <ul className="text-sm">
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2">
                      <FaUserCircle />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2">
                      <FaCog />
                      <span>Settings</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
