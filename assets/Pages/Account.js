import React, { useState, useEffect, useContext } from 'react';
import Layout from "../components/Layout"
import { ProfileChangePassword } from '../components/ProfileChangePassword';
import ProfileInformation from "../components/ProfileInformation"
import { Link, Navigate } from "react-router-dom";
import useAuth from '../contexts/AuthContext';


function Account() {
    const { isAuthenticated, userRole } = useAuth();

    /** VUE */
    return (
        <Layout>
            <br />
            {isAuthenticated && userRole.includes('ROLE_USER') && (
                <Link to="/account">Profil</Link>
            )}
            {isAuthenticated && userRole.includes('ROLE_CREATOR') && (
                <>
                    <Link to="/creator_profil">Creator profil</Link>
                    <Link to="/creator_settings">Creator settings</Link>
                </>
            )}
            <ProfileInformation />
            <ProfileChangePassword />
        </Layout>
    );
}

export default Account;