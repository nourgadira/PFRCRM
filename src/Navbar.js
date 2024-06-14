import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from './lib/axios';
import { decodeToken } from './lib/jwt';
import { useQuery } from '@tanstack/react-query';
import Notifications from './Notifications/Notifications';
import { Flex } from 'antd';

const Navbar = () => {
  const decoded = decodeToken(localStorage.getItem('token'))
  const router = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ["users", decoded.id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/${decoded.id}`);
      return response.data
    }
  })



  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
      </button>
      <ul className="navbar-nav ml-auto">
        <Flex align='center'>
          <Notifications />
          <li className="nav-item dropdown no-arrow">
            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="mr-2 d-none d-lg-inline text-gray-600 small"> {data?.name}</span>
              <img className="img-profile rounded-circle" src={data?.image && data?.image.includes("/uploads") ? data?.image : "/img/undraw_profile.svg"} alt="Profile" />
            </a>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
              <Link to={"/profile"} className="dropdown-item" href="#">
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                Profile
              </Link>

              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#" onClick={() => {
                localStorage.clear()
                router("/login")
              }}>
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Logout
              </a>
            </div>
          </li>
        </Flex>
      </ul>
    </nav>
  );
};

export default Navbar;
