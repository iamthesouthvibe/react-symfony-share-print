import React from 'react'
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import LayoutAdmin from '../components/admin/LayoutAdmin';
import CampagnesList from '../components/admin/CampagnesList';

const AdminCampagneOverview = () => {
    const breadcrumbItems = [
        { label: "Campagnes", link: "/admin/campagne/overview" },
    ];

    return (
        <>
            <Header items={breadcrumbItems} />
            <Sidebar />
            <LayoutAdmin>
                <CampagnesList />
            </LayoutAdmin>

        </>
    );
}


export default AdminCampagneOverview