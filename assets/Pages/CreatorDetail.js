import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout';
import { Link } from "react-router-dom";

export const CreatorDetail = () => {

    const { id } = useParams();
    // Get best seller
    const [creator, setCreator] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/creator/detail/${id}`)
            .then(function (response) {
                setCreator(response.data.creator)
            })
            .catch(error => {
                console.log(error);
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
            <img src={'/images/creators/' + creator.id + '/' + creator.fileSource} />
            <p> {creator.name}</p>
            <p> {creator.bio}</p>
            <p> {creator.behance}</p>
            <p> {creator.dribble}</p>
            <p> {creator.instagram}</p>
            <p> {creator.linkedin}</p>

            {creator.campagnes.map(campagne => (
                <>
                    <Link to={`/shop/product/details/${campagne.slug}`}>
                        <img src={'/images/campagnes/' + campagne.userid + '/' + campagne.fileSource} alt={campagne.nameproject} />
                        <p> {campagne.nameproject}</p>
                        <p> {campagne.name}</p>
                        <p> {campagne.price}€</p>
                    </Link>
                </>
            ))}
        </Layout>
    )
}
