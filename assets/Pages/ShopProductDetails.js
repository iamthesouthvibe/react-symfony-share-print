import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from "../components/Layout"
import Campagne from '../components/Partials/Campagne';
import Footer from '../components/navigation/Footer';
import { CartContext } from '../contexts/CartContext'
import { useNavigate } from "react-router-dom";

const ShopProductDetails = () => {

    const navigate = useNavigate();

    const { updateCartItemsCount } = useContext(CartContext);


    useEffect(() => {
        const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartItemsCount(itemsFromLocalStorage.length);
    }, []);

    const { slug } = useParams();
    const [campagne, setCampagne] = useState(null);

    const fetchCampagne = async (slug) => {
        try {
            const response = await axios.get(`/api/shop/product/details/${slug}`);
            setCampagne(response.data.campagne);
        } catch (error) {
            if (error.response.status == 404) {
                navigate('/404')
            } else {
                navigate('/404')
            }
        }
    };

    useEffect(() => {
        if (!slug) {
            navigate('/404')
        }
        fetchCampagne(slug);
    }, [slug]);


    if (!campagne) {
        return <div>Chargement en cours...</div>;
    }

    // Ajoute un produit dans le localStorage
    const addToCart = (campagne) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Vérifie si le produit est déjà dans le panier
        let campagneInCart = false;
        cartItems.forEach(item => {
            if (item.id === campagne.id) {
                item.quantity++;
                item.total = item.quantity * item.price
                campagneInCart = true;
            }
        });

        // Ajoute le produit au panier s'il n'y est pas déjà
        if (!campagneInCart) {
            cartItems.push({ id: campagne.id, name: campagne.nameproject, price: campagne.price, quantity: 1, total: campagne.price, fileSource: campagne.fileSource, userId: campagne.userid });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartItemsCount(itemsFromLocalStorage.length);
    };

    return (
        <div>
            <Layout>
                <div class="shop-detail-page">
                    <div className="header-shop-detail-container">
                        <div className="header-shop-detail-container-left">
                            <img src={'/images/campagnes/' + campagne.userid + '/' + campagne.fileSource} alt={campagne.nameproject} />
                        </div>
                        <div className="header-shop-detail-container-right">
                            <div className="header-shop-detail-container-right-contents">
                                <h1 className="name-h1roject">{campagne.nameproject}</h1>
                                <p className="name-creator">{campagne.name}</p>
                                <p className="price">{campagne.price}€</p>
                                <div className="contents-shop">
                                    <div>
                                        <p>{campagne.description}</p>
                                    </div>
                                    <div>
                                        <p>Technical details</p>
                                        <p>&bull; Paper : {campagne.paper}</p>
                                        <p>&bull; Size : {campagne.size}</p>
                                        <p>&bull; Weight : {campagne.weight}</p>
                                    </div>
                                    <div>
                                        <button className="add-to-card" onClick={() => addToCart(campagne)}>Add to basket</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {campagne.bio || campagne.instagram || campagne.linkedin || campagne.dribble || campagne.behance ? (
                        <div className="creator-container">
                            <h2 className="subtitle-home">About creator</h2>
                            <div className="creator-container-contents">
                                <div className="creator-container-contents-socialmedia">
                                    <h4>
                                        Social media
                                </h4>
                                    {campagne.instagram && (
                                        <a href={campagne.instagram}>Instagram</a>
                                    )}
                                    {campagne.linkedin && (
                                        <a href={campagne.linkedin}>Linkedin</a>
                                    )}
                                    {campagne.dribble && (
                                        <a href={campagne.dribble}>Dribble</a>
                                    )}
                                    {campagne.behance && (
                                        <a href={campagne.behance}>Behance</a>
                                    )}
                                </div>
                                <div className="creator-container-contents-bio">
                                    <h4>
                                        Bio
                                </h4>
                                    <p>{campagne.bio}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {campagne.campagnes && campagne.campagnes.length > 0 && (
                        <div className="campaign-container">
                            <h2 className="subtitle-home">More works about creator</h2>
                            <div className="campaign-container-shop-row">
                                {campagne.campagnes.map(c => (
                                    <Campagne key={c.id} campagne={c} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <Footer />
            </Layout>
        </div>

    )
}

export default ShopProductDetails
