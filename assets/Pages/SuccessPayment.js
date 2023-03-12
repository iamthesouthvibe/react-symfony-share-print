import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link } from 'react-router-dom';

export const SuccessPayment = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');

    const [message, setMessage] = useState('')

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/success_payment?session_id=${sessionId}`)
            .then(function (response) {
                console.log(response.data.success)
                setMessage(response.data.success)
                localStorage.clear('cartItems')
            })
            .catch(error => {
                console.log(error.response.data.error);
                setMessage(error.response.data.error)
                setTimeout(() => {
                    window.location.pathname = "/";
                }, 3000);
            });
    }
    useEffect(() => {
        fetchData()
    }, []);

    if (!message) {
        return <div>Chargement en cours...</div>;
    }
    return (
        <div>
            {message}
            <Link to="/">Retour à la page d'accueil</Link>
        </div>
    )
}
