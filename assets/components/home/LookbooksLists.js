import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';


const LookbooksLists = () => {

    const [lookbooks, setLookbooks] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
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
        fetchData()
    }, []);

    return (
        <div>
            <h1>Lookbook</h1>
            {lookbooks.map(lookbook => (
                <img src={'/images/lookbook/' + lookbook.filesource} />
            ))}
        </div>
    )
}

export default LookbooksLists
