import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

export const LastCampagnes = () => {

    // Get last products
    const [lastcampagnes, setLastcampagnes] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/list/home/last`)
            .then(function (response) {
                setLastcampagnes(response.data.campagnes)
            })
            .catch(error => {
                console.log(error);
            });
    }
    useEffect(() => {
        fetchData()
    }, []);
    return (
        <div>
            <h1>Last products</h1>
            {lastcampagnes.map(campagne => (
                <>
                    <Link to={`/shop/product/details/${campagne.slug}`}>
                        <img src={'/images/campagnes/' + campagne.userid + '/' + campagne.fileSource} alt={campagne.nameproject} />
                        <p> {campagne.nameproject}</p>
                        <p> {campagne.name}</p>
                        <p> {campagne.price}€</p>
                    </Link>
                    <br />
                    <button onClick={() => addToCart(campagne)}>Ajouter au panier</button>
                </>
            ))}
        </div>
    )
}
