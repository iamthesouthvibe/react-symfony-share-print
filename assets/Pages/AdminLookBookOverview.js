import React from 'react'
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import LayoutAdmin from '../components/admin/LayoutAdmin';
import LookbookList from '../components/admin/LookbookList';

export const AdminLookBookOverview = () => {

    const breadcrumbItems = [
        { label: "Lookbook", link: "/admin/marketing/overview" },
    ];

    return (
        <>
            <Header items={breadcrumbItems} />
            <Sidebar />
            <LayoutAdmin>
                <LookbookList />
            </LayoutAdmin>

        </>
    );
}
