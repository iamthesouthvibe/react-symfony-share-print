import React, { useEffect, useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import useAuth from '../../contexts/AuthContext';

const HeaderDesktop = () => {
    const [activeLinkIndex, setActiveLinkIndex] = useState(-1);

    const handleLogout = () => {
        localStorage.clear();
        window.location.pathname = "/";
    }

    const { isAuthenticated, userRole } = useAuth();

    const [cartItemsCount, setCartItemsCount] = useState(0);

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItemsCount(cartItems.length);
    }, []);


    return (
        <div className="header">
            <div>
                <NavLink to="/" className="header-logo">PrintShare</NavLink>
            </div>
            <div>
                <NavLink
                    className="hover-underline-animation"
                    activeClassName="active"
                    exact
                    to="/shop">
                    Shop
            </NavLink>
                <NavLink
                    className="hover-underline-animation"
                    activeClassName="active"
                    exact
                    to="/create_campagne">
                    Design your own
            </NavLink>
                <NavLink
                    className="hover-underline-animation"
                    activeClassName="active"
                    exact
                    to="/create_campagne">
                    How its work
            </NavLink>
                <NavLink
                    className="hover-underline-animation"
                    activeClassName="active"
                    exact
                    to="/creators">
                    Designer & Creators
            </NavLink>
                <NavLink
                    className="hover-underline-animation"
                    activeClassName="active"
                    exact
                    to="/lookbook">
                    Lookbook
            </NavLink>
            </div>

            <div>
                <Link class="hover-underline-animation" to="/card">card (<span class="text-primary">{cartItemsCount}</span>)</Link>
                <Link class="hover-underline-animation" to="/account"> {isAuthenticated ? 'Account' : 'Sign in'}</Link>
                {isAuthenticated ? <button onClick={handleLogout}>Logout</button> : ''}
                {isAuthenticated && userRole.includes('ROLE_CREATOR') && (
                    <>
                        <Link class="hover-underline-animation" to="/admin/profil/overview">Admin</Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default HeaderDesktop;
