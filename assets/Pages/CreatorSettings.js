import React from 'react'
import Layout from '../components/Layout'
import { Link } from "react-router-dom";
import useAuth from '../contexts/AuthContext';
import { CreatorSettingsForm } from '../components/form/CreatorSettingsForm';

export const CreatorSettings = () => {
    const { isAuthenticated, userRole } = useAuth();
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
            <CreatorSettingsForm />
        </Layout >
    )
}
