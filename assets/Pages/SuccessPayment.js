import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';

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
                localStorage.removeItem('cartItems')
            })
            .catch(error => {
                console.log(error.response.data.error);
                setMessage(error.response.data.error)

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
            <Layout>
                <div className="success-payment-container">
                    <h1>{message}</h1>
                    <br />
                    <Link to="/" className="submit-button">Back to the home page</Link>
                </div>
            </Layout>
        </div>
    )
}
