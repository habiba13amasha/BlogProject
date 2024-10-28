import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon ,FaSun} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi"; // أيقونات القائمة المنسد
import {useSelector,useDispatch} from "react-redux"
import {Avatar, Dropdown} from "flowbite-react"
import {toggleTheme} from "../redux/theme/themeSlice"
import { signOutSuccess } from "../redux/user/userSlice";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const path = useLocation().pathname;
  const {currentUser}=useSelector(state=>state.user)
  const {theme}=useSelector(state=>state.theme)
  const dispatch=useDispatch()

  const handleSignOut=async() => {
    try {
      const res=await fetch("/api/user/signout",{
        method: "POST",
      })
      const data=await res.json()
      if(!res.ok){
        console.log(data.message)
      }else{
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-700 shadow-md border-b-2">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-semibold text-gray-800 dark:text-white">
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-blue-50">
            Habiba
          </span>
          Blog
        </Link>

        {/* Main navigation: Search and Links */}
        <div className="flex items-center space-x-6">
          {/* Search bar for larger screens */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search..."
              />
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Links for large screens */}
          <div className="hidden lg:flex space-x-4">
            <Link to="/" className={`px-4 py-2 ${path === "/" ? "text-indigo-500" : "text-gray-700 dark:text-gray-200"}`}>
              Home
            </Link>
            <Link to="/about" className={`px-4 py-2 ${path === "/about" ? "text-indigo-500" : "text-gray-700 dark:text-gray-200"}`}>
              About
            </Link>
            <Link to="/projects" className={`px-4 py-2 ${path === "/projects" ? "text-indigo-500" : "text-gray-700 dark:text-gray-200"}`}>
              Projects
            </Link>
          </div>
        </div>

        {/* Action buttons (Moon Icon, Small Search, and Sign-In button) */}
        <div className="flex items-center space-x-4">
          {/* Moon Icon */}
          <button className="hidden lg:flex w-10 h-10 items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
           {theme==="dark" ?
            <FaMoon className="text-gray-600 dark:text-gray-200" onClick={()=>dispatch(toggleTheme())}/>
            :
            <FaSun className="text-gray-600 dark:text-gray-200" onClick={()=>dispatch(toggleTheme())}/>
            }
          </button>

          {/* Small Search Icon for small screens */}
          <button className="lg:hidden focus:outline-none w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
            <AiOutlineSearch className="text-gray-600 dark:text-gray-200" />
          </button>

          {currentUser?(
            <>
            <Dropdown arrowIcon={false} inline  label={
              <Avatar alt="user" img={currentUser.profilePhoto} rounded/>
            }>
              <Dropdown.Header className="block text-sm">
                <span className="block text-sm">@{currentUser.userName}</span>
                <span className="block text-sm font-medium truncate">{currentUser.email}</span>
              </Dropdown.Header>
              <Link to="/dashboard?tab=profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider/>
              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>


            </Dropdown>
            </>
          ):
          (
            <>
            <Link to="/sign-in" className="bg-gradient-to-r from-indigo-500 to-pink-500 text-blue-50 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
              Sign In
            </Link>
           </>
          )}
         
          

          {/* Menu Toggle for small screens */}
          <button
            className="lg:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <HiX className="w-8 h-8 text-gray-600 dark:text-gray-200" />
            ) : (
              <HiMenu className="w-8 h-8 text-gray-600 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {/* Menu links for small screens */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800">
          <ul className="space-y-2 py-2">
            <li>
              <Link
                to="/"
                className={`block px-4 py-2 ${path === "/" ? "bg-indigo-500 text-white" : "text-gray-700 dark:text-gray-200"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`block px-4 py-2 ${path === "/about" ? "bg-indigo-500 text-white" : "text-gray-700 dark:text-gray-200"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className={`block px-4 py-2 ${path === "/projects" ? "bg-indigo-500 text-white" : "text-gray-700 dark:text-gray-200"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
