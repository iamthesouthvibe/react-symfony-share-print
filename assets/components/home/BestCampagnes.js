import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const BestCampagnes = () => {

    // Get best seller
    const [bestcampagnes, setBestcampagnes] = useState([]);

    /** TRAITEMENTS */
    const fetchDataBest = async () => {
        axios.get(`/api/list/home/best`)
            .then(function (response) {
                setBestcampagnes(response.data.campagnes)
            })
            .catch(error => {
                console.log(error);
            });
    }
    useEffect(() => {
        fetchDataBest()
    }, []);

    return (
        <div>
            <h1>Best-seller</h1>
            {bestcampagnes.map(campagne => (
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

export default BestCampagnes
