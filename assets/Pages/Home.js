import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Layout from "../components/Layout"
import { LastCampagnes } from '../components/home/LastCampagnes';
import BestCampagnes from '../components/home/BestCampagnes';
import CreatorsList from '../components/home/CreatorsList';
import LookbooksLists from '../components/home/LookbooksLists';
import Qhero from '../components/home/Qhero';
import { CartContext } from '../contexts/CartContext'
import Footer from '../components/navigation/Footer';


function Home() {

    const { updateCartItemsCount } = useContext(CartContext);


    useEffect(() => {
        const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartItemsCount(itemsFromLocalStorage.length);
    }, []);


    return <Layout>
        <Qhero />
        <LastCampagnes />
        <Footer />
    </Layout>
}



export default Home;