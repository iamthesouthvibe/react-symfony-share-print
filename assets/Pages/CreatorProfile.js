import React from 'react'
import Layout from '../components/Layout'
import { Link } from "react-router-dom";
import useAuth from '../contexts/AuthContext';
import { CreatorProfilForm } from '../components/form/CreatorProfilForm';
import HeaderAccount from '../components/navigation/HeaderAccount';
import Footer from '../components/navigation/Footer';

export const CreatorProfile = () => {

    /** VUE */
    return <Layout>
        <div className="page-account">
            <HeaderAccount />
            <CreatorProfilForm />
        </div>
        <Footer />
    </Layout>
}
