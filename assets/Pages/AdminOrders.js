import React from 'react'
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import LayoutAdmin from '../components/admin/LayoutAdmin';
import { OrdersList } from '../components/admin/OrdersList';

export const AdminOrders = () => {
    const breadcrumbItems = [
        { label: "Orders", link: "/admin/ecommerce/order" },
    ];

    return (
        <>
            <Header items={breadcrumbItems} />
            <Sidebar />
            <LayoutAdmin>
                <OrdersList />
            </LayoutAdmin>
        </>
    );
}
