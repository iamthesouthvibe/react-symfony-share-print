import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/admin/Header'
import LayoutAdmin from '../components/admin/LayoutAdmin'
import Sidebar from '../components/admin/Sidebar';


export const AdminOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    const breadcrumbItems = [
        { label: "Orders", link: "/admin/ecommerce/order" },
        { label: "Détails", link: "" },
    ];

    useEffect(() => {
        axios.get(`/api/admin/order/detail/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setOrder(response.data.order);
            })
            .catch(error => {
                console.log(error);
                // localStorage.clear();
                // window.location.pathname = "/";
            });
    }, []);

    console.log(order)


    if (!order) {
        return <div>Chargement en cours...</div>;
    }
    return (
        <>
            <Header items={breadcrumbItems} />
            <Sidebar />
            <LayoutAdmin>
                {order.createdAt}
                {order.shipping_address}
                {order.shipping_city}
                {order.shipping_country}
                {order.shipping_zip}
                {order.total_price}$
                {order.priceHT}$
                {order.delivery}$
                {order.tax}$
                {order[0].map(product => {
                    const imageUrl = `/images/campagnes/${product.creatorId}/${product.campagne_filesource}`;
                    return (
                        <>
                            <img src={imageUrl} alt={product.campagne_name} /><br></br>
                            {product.campagne_name}<br></br>
                            {product.quantity}<br></br>
                            {product.campagne_price}<br></br>
                            {product.campagne_size}<br></br>
                            {product.campagne_weight}<br></br>
                            {product.campagne_paper}<br></br>
                        </>
                    );
                })}
            </LayoutAdmin>
        </>
    )
}
