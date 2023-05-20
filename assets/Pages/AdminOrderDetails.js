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
                <div style={styles.headerOrderDetail}>
                    <div>
                        <h1>Commande #{order.id}</h1>
                        <h2 style={styles.textSecondary}>{order.customer_firstname} {order.customer_lastname}</h2>
                    </div>
                    <div>
                        <p>{order.createdAt}</p>
                    </div>
                </div>
                <br /><br />
                <div style={styles.containerFlex}>
                    <div style={styles.form}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Img</th>
                                    <th>Num de campagne</th>
                                    <th>Price unitaire</th>
                                    <th>Quantité</th>
                                    <th>Prix total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order[0].map(product => {
                                    const imageUrl = `/images/campagnes/${product.creatorId}/${product.campagne_filesource}`;
                                    return (
                                        <>
                                            <tr>
                                                <td><img style={styles.img} src={imageUrl} alt={product.campagne_name} /></td>
                                                <td>{product.campagne_id}</td>
                                                <td>{product.campagne_price}€</td>
                                                <td>{product.quantity}</td>
                                                <td>{product.quantity * product.campagne_price}€</td>
                                            </tr>
                                        </>
                                    );
                                })}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Prix de la livraison : </td>
                                    <td>{order.delivery}$</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Prix total : </td>
                                    <td>{order.total_price}$</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={styles.containerInfo}>
                        <div style={styles.containerInfo1}>
                            <h5>{order.customer_firstname} {order.customer_lastname}</h5>
                            <p>{order.customer_email}</p>
                            <p>{order.customer_mobile}</p>
                        </div>
                        <div style={styles.containerInfo2}>
                            <h5>Adresse de livraison</h5>
                            <p>{order.shipping_address}</p>
                            <p>{order.shipping_city}</p>
                            <p>{order.shipping_country}</p>
                            <p>{order.shipping_zip}</p>
                        </div>
                    </div>
                </div>
            </LayoutAdmin>
        </>
    )
}

const styles = {
    headerOrderDetail: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    textSecondary: {
        color: "rgba(0, 0, 0, 0.6)"
    },
    img: {
        maxWidth: '50px',
        maxHeight: '130px'
    },
    form: {
        width: '60%'
    },
    containerFlex: {
        display: 'flex',
        gap: '50px'
    },
    containerInfo: {
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        rowGap: '20px'
    },
    containerInfo1: {
        backgroundColor: '#FEF4F1',
        borderRadius: '10px',
        padding: '10px'
    },
    containerInfo2: {
        backgroundColor: '#FCD1C5',
        borderRadius: '10px',
        padding: '10px'
    }
}
