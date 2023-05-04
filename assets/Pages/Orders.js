import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Link } from "react-router-dom";
import useAuth from '../contexts/AuthContext';
import axios from 'axios';
import HeaderAccount from '../components/navigation/HeaderAccount';
import Footer from '../components/navigation/Footer';
import { useNavigate } from "react-router-dom";

export const Orders = () => {

    const navigate = useNavigate();
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
                if (error.response.status == 401) {
                    localStorage.removeItem('token');
                    navigate('/login')
                } else {
                    navigate('/404')
                }
            });
    }
    useEffect(() => {
        fetchData()
    }, []);

    console.log(orders)

    const render = orders.map(order => {
        return (
            <>
                <div className="order-container">
                    <h2>#{order.id}</h2>
                    <div className="order-container-top">
                        <div>
                            <p className="text-secondary">Order date</p>
                            <p>{order.createdAt}</p>
                        </div>
                        <div>
                            <p className="text-secondary">Payment</p>
                            <p>Visa</p>
                        </div>
                        <div>
                            <p className="text-secondary">Status</p>
                            <p>{order.status}</p>
                        </div>
                    </div>
                    <div className="order-container-middle">
                        <div>
                            <p className="text-secondary">Address</p>
                            <p>{order.shipping_address}, {order.shipping_city} {order.shipping_country} <br />{order.shipping_zip}</p>
                        </div>

                        <div>
                            <p className="text-secondary">Shipping Status</p>
                            {order.shipping ? (<p>{order.shipping}</p>) : (<p>Waiting to be deposited</p>)}

                        </div>
                    </div>

                    <div className="order-container-products">
                        <p className="text-secondary">Product(s)</p>
                        {order.campagne_orders.map(product => {
                            const imageUrl = `/images/campagnes/${product.creatorId}/${product.campagne_filesource}`;
                            return (
                                <>
                                    <div className="order-container-product">
                                        <div>
                                            <img src={imageUrl} alt={product.campagne_name} />
                                        </div>
                                        <div>
                                            <p>{product.campagne_name}</p>
                                            <p><span className="text-secondary">Qty : </span>{product.quantity}</p>
                                            <p><span className="text-secondary">Price : </span>{product.campagne_price}€</p>
                                            <p>{product.campagne_size} - {product.campagne_weight}GR - {product.campagne_paper}</p>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                    <p><span className="text-secondary">Shipping price :</span> 6.50€</p>
                    <p><span className="text-secondary">Total price : </span>  <span className="text-large">{order.total_price}€</span></p>
                </div>
            </>
        );
    });
    return (
        <Layout>
            <div className="page-account">
                <HeaderAccount />
                {render}
            </div>
            <Footer />
        </Layout >
    )
}
