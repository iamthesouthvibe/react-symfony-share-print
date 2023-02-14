import React from 'react';
import { Link } from "react-router-dom";
import useAuth from '../contexts/AuthContext';

const Layout = ({ children }) => {
    const handleLogout = () => {
        localStorage.clear();
        window.location.pathname = "/";
    }

    const { isAuthenticated, userRole } = useAuth();

    return (
        <div className="container">
            <Link to="/">Home</Link>
            <Link to="/create_campagne">Design your own</Link>
            <Link to="/account"> {isAuthenticated ? 'Account' : 'Sign in'}</Link>
            {isAuthenticated ? <button onClick={handleLogout}>Logout</button> : ''}
            {isAuthenticated && userRole.includes('ROLE_CREATOR') && (
                <>
                    <Link to="/admin/profil/overview">Admin</Link>
                </>
            )}
            { children}
        </div >
    )
}

export default Layout;