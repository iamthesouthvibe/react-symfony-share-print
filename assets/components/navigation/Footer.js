import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-top">
                <div>
                    <p>About</p>
                    <NavLink to="/shop">
                        Home
                </NavLink>
                    <NavLink to="/shop">
                        Shop
                </NavLink>
                    <NavLink to="/shop">
                        Design your own
                </NavLink>
                    <NavLink to="/shop">
                        How it works
                </NavLink>
                    <NavLink to="/shop">
                        Designer & Studios
                </NavLink>
                    <NavLink to="/shop">
                        Lookbook
                </NavLink>

                    <a>Instagram</a>
                    <a>Pinterest</a>
                </div>
                <div>
                    <p>Customer Service</p>
                    <NavLink to="/shop">
                        Contact
                </NavLink>
                    <NavLink to="/shop">
                        Faq
                </NavLink>
                </div>
                <div>
                    <p>Payment methods</p>
                    <NavLink to="/shop">
                        MasterCard
                </NavLink>
                    <NavLink to="/shop">
                        Visa
                </NavLink>
                </div>
            </div>

            <div className="footer-bottom">
                <NavLink to="/shop">
                    Terms & Conditions
                </NavLink>
                <NavLink to="/shop">
                    Privacy Policy
                </NavLink>
                <NavLink to="/shop">
                    CopyRight - PrintShare 2023
                </NavLink>
            </div>
        </div>
    )
}

export default Footer
