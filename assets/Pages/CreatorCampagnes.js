import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Link } from "react-router-dom";
import axios from 'axios';
import useAuth from '../contexts/AuthContext';
import Footer from '../components/navigation/Footer';
import HeaderAccount from '../components/navigation/HeaderAccount';

export const CreatorCampagnes = () => {
    const { isAuthenticated, userRole } = useAuth();
    const [campagnes, setCampagnes] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        // Récupération des données utilisateur à partir de l'API
        axios.get(`/api/account/campagne/list`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setCampagnes(response.data.campagnes)
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

    const images = campagnes.map(campagne => {
        const imageUrl = `/images/campagnes/${campagne.userid}/${campagne.fileSource}`;
        return (
            <>
                <div className="order-container">
                    <h2>#{campagne.id}</h2>
                    <div className="order-container-top">
                        <div>
                            <p className="text-secondary">Created at</p>
                            <p>{campagne.createdAt}</p>
                        </div>
                        <div>
                            <p className="text-secondary">Days</p>
                            <p> {45 - campagne.days}days</p>
                        </div>
                        <div>
                            <p className="text-secondary">Price</p>
                            <p>{campagne.price}€</p>
                        </div>
                    </div>
                    <div className="order-container-middle">
                        <div>
                            <p className="text-secondary">Campagne status</p>
                            <p>{campagne.status}</p>
                        </div>
                    </div>
                    <div className="order-container-products">
                        <p className="text-secondary">Product</p>
                        <div className="order-container-product">
                            <div>
                                <img src={imageUrl} alt={campagne.nameproject} />
                            </div>
                            <div>
                                <p>{campagne.nameproject}</p>
                                <p>{campagne.size} - {campagne.weight}GR - {campagne.paper}</p>
                            </div>
                        </div>
                    </div>
                    <p><span className="text-secondary">Number orders : </span>{campagne.nbvente}</p>
                    <p><span className="text-secondary">Total benefice : </span>{campagne.benefCreator}€</p>
                </div>

            </>
        );
    });

    /** VUE */
    return <Layout>
        <div className="page-account">
            <HeaderAccount />
            {images}
        </div>
        <Footer />
    </Layout >
}
