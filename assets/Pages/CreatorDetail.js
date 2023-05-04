import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout';
import { Link } from "react-router-dom";
import { CartContext } from '../contexts/CartContext';
import Campagne from '../components/Partials/Campagne';
import Footer from '../components/navigation/Footer';
import { useNavigate } from "react-router-dom";

export const CreatorDetail = () => {

    const navigate = useNavigate();

    const { updateCartItemsCount } = useContext(CartContext);

    useEffect(() => {
        const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartItemsCount(itemsFromLocalStorage.length);
    }, []);

    const { id } = useParams();
    // Get best seller
    const [creator, setCreator] = useState([]);

    if (!id) {
        navigate('/404')
    }

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/creator/detail/${id}`)
            .then(function (response) {
                setCreator(response.data.creator)
            })
            .catch(error => {
                if (error.response.status == 404) {
                    navigate('/404')
                } else {
                    navigate('/404')
                }
            });
    }
    useEffect(() => {
        fetchData()
    }, []);

    if (!creator || !creator.campagnes) {
        return <div>Loading data...</div>
    }

    return (
        <Layout>
            <div className="creator-details-top-container">
                <div className="creator-details-top-container-first">
                    <img src={'/images/creators/' + creator.id + '/' + creator.fileSource} />
                </div>
                <div className="creator-details-top-container-second">
                    <h1> {creator.name}</h1>
                    <p className="creator-details-top-container-second-bio"> {creator.bio}</p>
                    <div className="creator-details-top-container-second-social">
                        {creator.instagram && (
                            <a href={creator.instagram} target="_blank">Instagram</a>
                        )}
                        {creator.linkedin && (
                            <a href={creator.linkedin} target="_blank">Linkedin</a>
                        )}
                        {creator.behance && (
                            <a href={creator.behance} target="_blank">Behance</a>
                        )}
                        {creator.dribble && (
                            <a href={creator.dribble} target="_blank">Dribble</a>
                        )}
                    </div>
                </div>
            </div>
            <div className="creator-details-bottom-container">
                {creator.campagnes && creator.campagnes.length > 0 && (
                    <>
                        <h2 className="subtitle-home">More works about creator</h2>
                        <div className="campaign-container-shop-row">
                            {creator.campagnes.map(campagne => (
                                <>
                                    <Campagne key={campagne.id} campagne={campagne} />
                                </>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </Layout>
    )
}
