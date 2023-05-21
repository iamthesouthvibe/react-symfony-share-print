import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-top">
                <div>
                    <p>About</p>
                    <NavLink to="/">
                        Home
                </NavLink>
                    <NavLink to="/shop">
                        Shop
                </NavLink>
                    <NavLink to="/create_campagne">
                        Design your own
                </NavLink>
                    <NavLink to="/how-its-work">
                        How it works
                </NavLink>
                    <NavLink to="/creators">
                        Designer & Studios
                </NavLink>
                    <NavLink to="/lookbook">
                        Lookbook
                </NavLink>

                    <a>Instagram</a>
                    <a>Pinterest</a>
                </div>
                <div>
                    <p>Customer Service</p>
                    <NavLink to="/">
                        Contact
                </NavLink>
                    <NavLink to="/">
                        Faq
                </NavLink>
                </div>
                <div>
                    <p>Payment methods</p>
                    <NavLink to="/">
                        MasterCard
                </NavLink>
                    <NavLink to="/">
                        Visa
                </NavLink>
                </div>
            </div>

            <div className="footer-bottom">
                <NavLink to="/">
                    Terms & Conditions
                </NavLink>
                <NavLink to="/">
                    Privacy Policy
                </NavLink>
                <NavLink to="/">
                    CopyRight - PrintShare 2023
                </NavLink>
            </div>
        </div>
    )
}

export default Footer
