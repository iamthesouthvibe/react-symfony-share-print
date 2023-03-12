import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Link } from "react-router-dom";
import axios from 'axios';
import useAuth from '../contexts/AuthContext';

export const CreatorCampagnes = () => {
    const { isAuthenticated, userRole } = useAuth();
    const [campagnes, setCampagnes] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        // Récupération des données utilisateur à partir de l'API
        axios.get(`/api/account/campagne/list`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setCampagnes(response.data.campagnes)
            })
            .catch(error => {
                console.log(error);

                // localStorage.clear();
                // window.location.pathname = "/";
            });
    }
    useEffect(() => {
        fetchData()
    }, []);

    const images = campagnes.map(campagne => {
        const imageUrl = `/images/campagnes/${campagne.userid}/${campagne.fileSource}`;
        return (
            <>
                <img src={imageUrl} alt={campagne.nameproject} />
                {campagne.nameproject}
                {campagne.ncommande}
                {campagne.createdAt}
                {campagne.paper}
                {campagne.size} {campagne.weight}
                {campagne.status}
                {30 - campagne.days} days
                <br></br>
                <br></br>
            </>
        );
    });

    /** VUE */
    return <Layout>
        <br />
        {isAuthenticated && userRole.includes('ROLE_USER') && (
            <>
                <Link to="/account">Profil</Link>
                <Link to="/orders">Orders</Link>
            </>
        )}
        {isAuthenticated && userRole.includes('ROLE_CREATOR') && (
            <>
                <Link to="/creator_profil">Creator profil</Link>
                <Link to="/creator_settings">Creator settings</Link>
                <Link to="/creator_campagnes">Campagnes</Link>
            </>
        )}
        <br></br>
        <br></br>
        {images}
    </Layout >
}
