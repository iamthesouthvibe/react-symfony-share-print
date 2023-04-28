import React from 'react'
import { Link } from "react-router-dom";
import useAuth from '../../contexts/AuthContext';

const HeaderAccount = () => {
    const { isAuthenticated, userRole } = useAuth();

    return (
        <>
            <h1 className="subtitle-home text-large">Account</h1>
            <div className="account-header">
                {isAuthenticated && userRole.includes('ROLE_USER') && (
                    <>
                        <Link to="/account">Profil</Link>
                        <Link to="/orders">Orders</Link>
                    </>
                )}
                {isAuthenticated && userRole.includes('ROLE_CREATOR') && (
                    <>
                        <Link to="/creator_profil">Creator profil</Link>
                        <Link to="/creator_settings">Creator settings</Link>
                        <Link to="/creator_campagnes">Campagnes</Link>
                    </>
                )}
            </div>
        </>
    )
}

export default HeaderAccount

