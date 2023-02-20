import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from "../components/Layout"

const ShopProductDetails = () => {

    const { slug } = useParams();
    const [campagne, setCampagne] = useState(null);

    const fetchCampagne = async (slug) => {
        try {
            const response = await axios.get(`/api/shop/product/details/${slug}`);
            setCampagne(response.data.campagne);
        } catch (error) {
            console.log(error);
            // localStorage.clear();
            // window.location.pathname = "/";
        }
    };

    useEffect(() => {
        fetchCampagne(slug);
    }, [slug]);
    console.log(campagne)

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
            cartItems.push({ id: campagne.id, name: campagne.nameproject, price: campagne.price, quantity: 1, total: campagne.price });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    };

    return (
        <div>
            <Layout>
                <p>details</p>
                <img src={'/images/campagnes/' + campagne.userid + '/' + campagne.fileSource} alt={campagne.nameproject} />
                <p>{campagne.nameproject}</p>
                <p>{campagne.name}</p>
                <p>{campagne.price}</p>
                <button onClick={() => addToCart(campagne)}>Ajouter au panier</button>
                <p>{campagne.paper}</p>
                <p>{campagne.size}</p>
                <p>{campagne.weight}</p>
                <p>{campagne.bio}</p>
                <p>{campagne.instagram}</p>
                <p>{campagne.linkedin}</p>
                <p>{campagne.dribble}</p>
                <p>{campagne.behance}</p>
                {campagne.campagnes.map(c => (
                    <>
                        <Link to={`/shop/product/details/${c.slug}`}>
                            <img src={'/images/campagnes/' + c.userid + '/' + c.fileSource} alt={campagne.nameproject} />
                            <p>{c.nameproject}</p>
                            <p>{c.price}</p>
                        </Link>
                    </>
                ))}
            </Layout>
        </div>
    )
}

export default ShopProductDetails
