import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import LayoutAdmin from '../components/admin/LayoutAdmin';
import UsersList from '../components/admin/UsersList';


const AdminProfil = () => {

    const breadcrumbItems = [
        { label: "User profil", link: "/admin/profil/overview" },
    ];

    return (
        <>
            <Header items={breadcrumbItems} />
            <Sidebar />
            <LayoutAdmin>
                <UsersList />
            </LayoutAdmin>

        </>
    );
}


export default AdminProfil
