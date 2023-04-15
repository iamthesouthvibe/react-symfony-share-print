import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Layout from '../components/Layout'

const Lookbook = () => {

    const [lookbooks, setLookbooks] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/lookbook/list`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
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
        fetchData()
    }, []);

    return (
        <Layout>
            <h1>Lookbook</h1>
            {lookbooks.map(lookbook => (
                <img src={'/images/lookbook/' + lookbook.filesource} />
            ))}
        </Layout>
    )
}

export default Lookbook
