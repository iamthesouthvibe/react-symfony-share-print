import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, NavLink } from "react-router-dom";
import Campagne from '../Partials/Campagne';

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

    // Get best seller
    const [creators, setCreators] = useState([]);

    /** TRAITEMENTS */
    const fetchDataCreators = async () => {
        axios.get(`/api/list/home/creators`)
            .then(function (response) {
                setCreators(response.data.creators)
            })
            .catch(error => {
                console.log(error);
            });
    }
    useEffect(() => {
        fetchDataCreators()
    }, []);

    const [lookbooks, setLookbooks] = useState([]);

    /** TRAITEMENTS */
    const fetchDataLookbooks = async () => {
        axios.get(`/api/list/home/lookbooks`)
            .then(function (response) {
                setLookbooks(response.data.lookbooks)
            })
            .catch(error => {
                console.log(error);
                // localStorage.clear();
                // window.location.pathname = "/";
            });
    }
    useEffect(() => {
        fetchDataLookbooks()
    }, []);

    if (!creators && !bestcampagnes && !lastcampagnes && !lookbooks) {
        return <div>Chargement en cours...</div>;
    }


    return (
        <div className="home-general-container">
            <div>
                <h2 className="subtitle-home">Last products</h2>
                <div className="container-campagnes-row">
                    {lastcampagnes.map(campagne => (
                        <div className="block-campagne-row">
                            <Campagne key={campagne.id} campagne={campagne} />
                        </div>
                    ))}
                </div>
                <NavLink to="/shop" className="call-to-action-home">Enter Shop</NavLink>
            </div>

            <div>
                <h2 className="subtitle-home">Best Sellers</h2>
                <div className="container-campagnes-row">
                    {bestcampagnes.map(campagne => (
                        <div className="block-campagne-row">
                            <Campagne key={campagne.id} campagne={campagne} />
                        </div>
                    ))}
                </div>
                <NavLink to="/shop" className="call-to-action-home">Enter Shop</NavLink>
            </div>

            <div>
                <h2 className="subtitle-home">Artists, Designers & Studios</h2>
                <div className="container-creator">
                    {creators.map(creator => (
                        <>
                            <div className="block-creator-row">
                                <Link to={`/creator/detail/${creator.id}`}>
                                    <img src={'/images/creators/' + creator.id + '/' + creator.fileSource} />
                                    <p> {creator.name}</p>
                                </Link>
                            </div>
                        </>
                    ))}
                </div>
                <NavLink to="/shop" className="call-to-action-home">Enter Shop</NavLink>
            </div>
            <div className="home-want-cell">
                <h3 className="home-want-cell-paragraphe">Have a design idea? Head to our campaign builder to create your own custom products to sell.</h3>
                <NavLink to="/shop" className="call-to-action-home-white">Do it now!</NavLink>
            </div>
            <div className="last-child-home">
                <h2 className="subtitle-home">Lookbook</h2>
                <div className="container-lookbooks-row-home">
                    {lookbooks.map(lookbook => (
                        <>
                            <div className="block-lookbooks-row-home">
                                <Link to={`/creator/detail/${lookbook.id}`}>
                                    <img src={'/images/lookbook/' + lookbook.filesource} />
                                </Link>
                            </div>
                        </>
                    ))}
                </div>
                <NavLink to="/shop" className="call-to-action-home">See more</NavLink>
            </div>
        </div >
    )
}
