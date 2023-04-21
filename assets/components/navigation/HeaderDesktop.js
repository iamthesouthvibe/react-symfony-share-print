import React, { useEffect, useState, useContext } from 'react';
import { Link, NavLink } from "react-router-dom";
import useAuth from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';


const HeaderDesktop = () => {
    const [activeLinkIndex, setActiveLinkIndex] = useState(-1);

    const handleLogout = () => {
        localStorage.clear();
        window.location.pathname = "/";
    }

    const { isAuthenticated, userRole } = useAuth();

    // const [cartItemsCount, setCartItemsCount] = useState(0);
    const { cartItemsCount } = useContext(CartContext);

    // useEffect(() => {
    //     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    //     setCartItemsCount(cartItems.length);
    // }, []);


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
                    to="/how-its-work">
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
                <NavLink activeClassName="active" className="hover-underline-animation" to="/card">card (<span class="card-inside">{cartItemsCount}</span>)</NavLink>
                <NavLink activeClassName="active" className="hover-underline-animation" to="/account"> {isAuthenticated ? 'Account' : 'Sign in'}</NavLink>
                {isAuthenticated ? <button onClick={handleLogout}>Logout</button> : ''}
                {isAuthenticated && userRole.includes('ROLE_ADMIN') && (
                    <>
                        <NavLink className="hover-underline-animation" to="/admin/profil/overview">Admin</NavLink>
                    </>
                )}
            </div>
        </div>
    )
}

export default HeaderDesktop;
