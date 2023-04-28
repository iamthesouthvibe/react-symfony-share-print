import React, { useState, useEffect, useContext } from 'react';
import Layout from "../components/Layout"
import HeaderAccount from '../components/navigation/HeaderAccount';
import { ProfileChangePassword } from '../components/ProfileChangePassword';
import ProfileInformation from "../components/ProfileInformation"


function Account() {

    /** VUE */
    return (
        <Layout>
            <div className="page-account">
                <HeaderAccount />
                <ProfileInformation />
                <ProfileChangePassword />
            </div>
        </Layout>
    );
}

export default Account;