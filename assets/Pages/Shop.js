import React, { useState, useEffect, useContext } from 'react';
import Layout from "../components/Layout"
import Footer from '../components/navigation/Footer';
import ShopProductsList from '../components/ShopProductsList'
import { CartContext } from '../contexts/CartContext'

const Shop = () => {

    const { updateCartItemsCount } = useContext(CartContext);


    useEffect(() => {
        const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartItemsCount(itemsFromLocalStorage.length);
    }, []);

    return (
        <Layout>
            <div id="page-shop">
                <p className="subtitle-home text-large">Shop</p>
                <ShopProductsList />
            </div>
            <Footer />
        </Layout>
    )
}

export default Shop
