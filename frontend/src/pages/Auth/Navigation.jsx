import React, { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation, useLogoutMutation } from "../../redux/api/userApiSlice";

import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoriteCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation(); // ✅ Correct hook for logout

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const logOutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{ zIndex: 999 }}
      className={`${showSidebar ? "hidden" : "flex"}
        xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4
        text-white bg-black w-[4%] hover:w-[15%] h-[100vh] fixed`}
    >
      {/* ----------- Navigation Links ----------- */}
          <div className="flex flex-col justify-center space-y-4">
            <Link
              to="/"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <div className="mr-2 mt-[3rem]">
                <AiOutlineHome size={26} />
              </div>
              <span className="hidden nav-item-name mt-[3rem]">HOME</span>
            </Link>

            <Link
              to="/shop"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <div className="mr-2 mt-[3rem]">
                <AiOutlineShopping size={26} />
              </div>
              <span className="hidden nav-item-name mt-[3rem]">SHOP</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <div className="mr-2 mt-[3rem]">
                <AiOutlineShoppingCart size={26} />
              </div>
              <span className="hidden nav-item-name mt-[3rem]">CART</span>
            </Link>

            <Link to="/favorite" className="flex relative">
              <div className="flex items-center transition-transform transform hover:translate-x-2">
                <div className="mr-2 mt-[3rem]">
                  <FaHeart size={26} />
                </div>
                <span className="hidden nav-item-name mt-[3rem]">FAVORITES</span>
              </div>
              <div className="absolute top-9 left-3">
                <FavoritesCount />
              </div>
            </Link>
          </div>  

      {/* ----------- User Section ----------- */}
      <div className="relative">
        <button
          onClick={toggleDropDown}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="text-white">{userInfo.username}</span>
          ) : (
            <>
            </>
          )}
          {userInfo && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={dropdownOpen ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"}
                  />
                </svg>
              )}
        </button>

       {dropdownOpen && userInfo && (
  <ul
    className={`absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-600 
      ${!userInfo.isAdmin ? "-top-20" : "-top-80"}`}
  >
    <>
      {userInfo.isAdmin ? (
        <>
          <li>
            <Link
              to="/admin/dashboard"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/productlist"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Add Product
            </Link>
          </li>
          <li>
            <Link
              to="/admin/categorylists"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Category
            </Link>
          </li>
          <li>
            <Link
              to="/admin/orderlist"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/admin/userlist"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              userList
            </Link>
          </li>
           <li>
            <Link
              to="/admin/categorylist"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              categorylist
            </Link>
          </li>
        </>
      ) : null}

      {/* Common for both admin and non-admin */}
      <li>
        <Link
          to="/profile"
          className="block px-4 py-2 hover:bg-gray-100"
        >
          Profile
        </Link>
      </li>
      <li>
       <button
        onClick={logOutHandler}
        className="block px-4 py-2 hover:bg-gray-100">
           Logout
       </button>
      </li>
    </>
  </ul>
)}

      </div>

      {/* ----------- Auth Links ----------- */}
      {!userInfo && (
        <ul>
          <li>
            <Link
              to="/login"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">Login</span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineUserAdd className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">Register</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
