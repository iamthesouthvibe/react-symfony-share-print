import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { CartContext } from '../../contexts/CartContext';

const Campagne = ({ campagne }) => {
    const [cartItemsCount, setCartItemsCount] = useState(0);

    const { updateCartItemsCount } = useContext(CartContext);

    // Ajoute un produit dans le localStorage
    const addToCart = (campagne) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Vérifie si le produit est déjà dans le panier
        let campagneInCart = false;
        cartItems.forEach(item => {
            console.log(campagne.id)
            console.log(item.id)
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


        setCartItemsCount(cartItems.length);
        updateCartItemsCount(cartItems.length);
    };

    return (
        <>
            <div className="campagne-card">
                <Link to={`/shop/product/details/${campagne.slug}`}>
                    <div className="campagne-card-img-container">
                        <img src={'/images/campagnes/' + campagne.userid + '/' + campagne.fileSource} alt={campagne.nameproject} />
                    </div>
                    <div className="campagne-card-contents">
                        <div>
                            <p> {campagne.nameproject}</p>
                            <p> {campagne.name}</p>
                            <p className="text-large"> {campagne.price}€</p>
                        </div>
                        <div>
                            <p className="text-secondary text-light"> {45 - campagne.days} Days left</p>
                        </div>
                    </div>
                </Link>
                <button className="add-to-card" onClick={() => addToCart(campagne)}>Add to basket</button>
            </div>
        </>
    );
}

export default Campagne;