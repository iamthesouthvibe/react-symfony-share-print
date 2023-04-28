import React, { useEffect, useState, useContext } from 'react';
import { Link, NavLink } from "react-router-dom";
import useAuth from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';


const HeaderMobile = () => {
    const [activeLinkIndex, setActiveLinkIndex] = useState(-1);

    const handleLogout = () => {
        localStorage.clear();
        window.location.pathname = "/";
    }

    const { isAuthenticated, userRole } = useAuth();

    const { cartItemsCount } = useContext(CartContext);

    const [isActive, setIsActive] = useState(false);

    const handleIsActive = () => {
        setIsActive(!isActive)
    }


    useEffect(() => {
        document.body.style.overflow = isActive ? 'hidden' : 'unset';
    }, [isActive]);

    return (
        <>
            <div>
                <div class="header-mobile">
                    <div>
                        <NavLink to="/" className="header-logo">PrintShare</NavLink>
                    </div>
                    <div>
                        <Link class="hover-underline-animation" to="/card">card (<span class="card-inside">{cartItemsCount}</span>)</Link>
                        <svg class={`burger-btn ${isActive ? 'active' : ''}`} width="37" height="20" viewBox="0 0 37 20" xmlns="http://www.w3.org/2000/svg" onClick={handleIsActive}>
                            <rect class="burger-btn--1" width="35" height="3" rx="3" ry="3" />
                            <rect class="burger-btn--2" width="35" height="3" y="10" rx="3" ry="3" />
                            <rect class="burger-btn--3" width="35" height="3" y="20" rx="3" ry="3" />
                        </svg>
                    </div>
                </div>
                {isActive &&
                    <div className="header-mobile-container">
                        <div className="header-mobile-container-contents">
                            <NavLink
                                exact
                                to="/shop">
                                Shop
                            </NavLink>
                            <div className="underline-mobile"></div>
                            <NavLink
                                exact
                                to="/create_campagne">
                                Design your own
                            </NavLink>
                            <div className="underline-mobile"></div>
                            <NavLink
                                exact
                                to="/how-its-work">
                                How its work
                            </NavLink>
                            <div className="underline-mobile"></div>
                            <NavLink
                                exact
                                to="/creators">
                                Designer & Creators
                            </NavLink>
                            <div className="underline-mobile"></div>
                            <NavLink
                                exact
                                to="/lookbook">
                                Lookbook
                            </NavLink>
                            <div className="underline-mobile"></div>
                            <NavLink to="/account"> {isAuthenticated ? 'Account' : 'Sign in'}</NavLink>
                            <div className="underline-mobile"></div>
                            {isAuthenticated ? <button onClick={handleLogout}>Logout</button> : ''}
                        </div>
                        <div className="header-mobile-container-bottom">
                            {/* <NavLink
                                exact
                                to="/">
                                Contact
                            </NavLink>
                            <NavLink
                                exact
                                to="/">
                                Faq
                            </NavLink> */}
                        </div>
                    </div>
                }

            </div>
        </>
    )
}

export default HeaderMobile;

