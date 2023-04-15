import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import useAuth from '../contexts/AuthContext';
import { Header } from './navigation/Header';

const Layout = ({ children }) => {


    return (
        <div className="container">
            <Header />
            { children}
        </div >
    )
}

export default Layout;