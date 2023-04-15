import Layout from '../components/Layout'
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

export const CreatorsList = () => {
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

    /** Pagination */
    const [currentPage, setCurrentPage] = useState(1);
    const [cratorsPerPage] = useState(20);
    const indexOfLastCreator = currentPage * cratorsPerPage;
    const indexOfFirstCreator = indexOfLastCreator - cratorsPerPage;

    const currentCreators = creators.slice(indexOfFirstCreator, indexOfLastCreator);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    };


    return (
        <Layout>
            <h1>Artists, Designer & Creators </h1>
            {currentCreators.map(creator => (
                <>
                    <Link to={`/creator/detail/${creator.id}`}>
                        <img src={'/images/creators/' + creator.id + '/' + creator.fileSource} />
                        <p> {creator.name}</p>
                    </Link>
                </>
            ))}

            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={Math.ceil(currentCreators.length / cratorsPerPage)}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                activeClassName="active"
            />
        </Layout>
    )
}