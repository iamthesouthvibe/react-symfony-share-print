import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const CreatorsList = () => {

    // Get best seller
    const [creators, setCreators] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/list/home/creators`)
            .then(function (response) {
                setCreators(response.data.creators)
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
            <h1>Artists, Designers & Studios</h1>
            {creators.map(creator => (
                <>
                    <Link to={`/creator/detail/${creator.id}`}>
                        <img src={'/images/creators/' + creator.id + '/' + creator.fileSource} />
                        <p> {creator.name}</p>
                    </Link>
                </>
            ))}
        </div>
    )
}

export default CreatorsList
