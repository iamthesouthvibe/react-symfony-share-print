import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout'
import Footer from '../components/navigation/Footer'
import { CartContext } from '../contexts/CartContext'

const Howitswork = () => {
    const { updateCartItemsCount } = useContext(CartContext);


    useEffect(() => {
        const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartItemsCount(itemsFromLocalStorage.length);
    }, []);
    return (
        <Layout>
            <div className="page-howitsworks">
                <div className="page-howitsworks-container">
                    <p className="page-howitsworks-container-title">01</p>
                    <div>
                        <p className="page-howitsworks-container-title-subtitle">Upload your work</p>
                        <p>Upload your design and we’ll start selling in minutes.</p>
                    </div>
                </div>
                <div className="page-howitsworks-container">
                    <p className="page-howitsworks-container-title">02</p>
                    <div>
                        <p className="page-howitsworks-container-title-subtitle">Choose your garment, set a price</p>
                        <p>Choose from a wide range of high quality garments, suggest a retail price and launch an campaign.</p>
                    </div>
                </div>
                <div className="page-howitsworks-container">
                    <p className="page-howitsworks-container-title">03</p>
                    <div>
                        <p className="page-howitsworks-container-title-subtitle">Tell your friends and followers</p>
                        <p>Share with your fans and followers and generate orders for the duration of the campaign. 30 days is the maximum. But short and sweet works well too.</p>
                    </div>
                </div>
                <div className="page-howitsworks-container">
                    <p className="page-howitsworks-container-title">04</p>
                    <div>
                        <p className="page-howitsworks-container-title-subtitle">We sell and you get paid</p>
                        <p>If we sell more than 5 items then they’ll go to print! There’s no limit on how many we can sell too; we manufacture all the orders, and ship directly to your fans worldwide. Enter your payment details, and we’ll pay you when the campaign ends.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </Layout>
    )
}

export default Howitswork

