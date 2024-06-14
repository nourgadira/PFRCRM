import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
function Layout({ children }) {
  const navigate = useNavigate();

  const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");

  const changeStyle = () => {
    setStyle((prevStyle) =>
      prevStyle === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        ? "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled"
        : "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
  };
  const changeStyle1 = () => {
    setStyle((prevStyle) =>
      prevStyle === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        ? "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled1"
        : "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
    );
  };
  const navigateToGetAll = () => {
    navigate("/Login");
  };
  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
          <Sidebar />
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Navbar
                style={style}
                changeStyle={changeStyle}
                changeStyle1={changeStyle1}
                navigateToGetAll={navigateToGetAll}
              />
              <div className="container-fluid">
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </div>
        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
    </div>
  );
}

export default Layout;
