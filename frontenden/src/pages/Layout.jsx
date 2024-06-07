import React from "react";
import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      <img className="absolute bg-cover -mt-96" src="/images/login_img.jpg" alt="Login/Register Background" />
      <div className="relative">
        <Navbar/>
        <Outlet/>
      </div>
    </div>
  );
};

export default Layout;
