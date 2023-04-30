import React from 'react'
import Layout from '../components/Layout'
import { Link } from "react-router-dom";
import useAuth from '../contexts/AuthContext';
import { CreatorSettingsForm } from '../components/form/CreatorSettingsForm';
import HeaderAccount from '../components/navigation/HeaderAccount';
import Footer from '../components/navigation/Footer';

export const CreatorSettings = () => {
    return (
        <Layout>
            <div className="page-account">
                <HeaderAccount />
                <CreatorSettingsForm />
            </div>
            <Footer />
        </Layout >
    )
}
