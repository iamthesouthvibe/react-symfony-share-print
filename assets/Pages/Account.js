import React, { useState, useEffect, useContext } from 'react';
import Layout from "../components/Layout"
import { ProfileChangePassword } from '../components/ProfileChangePassword';
import ProfileInformation from "../components/ProfileInformation"
import { Link } from "react-router-dom";
import useAuth from '../contexts/AuthContext';

function Account() {
    const { isAuthenticated, userRole } = useAuth();

    /** VUE */
    return (
        <Layout>
            <br />
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
            <ProfileInformation />
            <ProfileChangePassword />
        </Layout>
    );
}

export default Account;