import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Link } from "react-router-dom";
import useAuth from '../contexts/AuthContext';
import axios from 'axios';

export const Orders = () => {
    const { isAuthenticated, userRole } = useAuth();
    const [orders, setOrders] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        // Récupération des données utilisateur à partir de l'API
        axios.get(`/api/order/list`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setOrders(response.data.orders)
            })
            .catch(error => {
                console.log(error);

                // localStorage.clear();
                // window.location.pathname = "/";
            });
    }
    useEffect(() => {
        fetchData()
    }, []);

    console.log(orders)

    const render = orders.map(order => {
        return (
            <>
                {order.createdAt}
                {order.shipping_address}
                {order.shipping_city}
                {order.shipping_country}
                {order.shipping_zip}
                {order.total_price}
                {order.campagne_orders.map(product => {
                    const imageUrl = `/images/campagnes/${product.creatorId}/${product.campagne_filesource}`;
                    return (
                        <>
                            <img src={imageUrl} alt={product.campagne_name} />
                            {product.campagne_name}
                            {product.quantity}
                            {product.campagne_price}
                            {product.campagne_size}
                            {product.campagne_weight}
                            {product.campagne_paper}
                        </>
                    );
                })}
            </>
        );
    });
    return (
        <Layout>
            <br />
            {isAuthenticated && userRole.includes('ROLE_USER') && (
                <>
                    <Link to="/account">Profil</Link>
                    <Link to="/orders">Orders</Link>
                </>
            )}
            {isAuthenticated && userRole.includes('ROLE_CREATOR') && (
                <>
                    <Link to="/creator_profil">Creator profil</Link>
                    <Link to="/creator_settings">Creator settings</Link>
                    <Link to="/creator_campagnes">Campagnes</Link>
                </>
            )}

            {render}
        </Layout >
    )
}
