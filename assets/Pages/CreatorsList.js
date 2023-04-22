import Layout from '../components/Layout'
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { CartContext } from '../contexts/CartContext'
import Footer from '../components/navigation/Footer';

export const CreatorsList = () => {

    const { updateCartItemsCount } = useContext(CartContext);


    useEffect(() => {
        const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartItemsCount(itemsFromLocalStorage.length);
    }, []);

    // Get best seller
    const [creators, setCreators] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/list/page/creators`)
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
    const [cratorsPerPage] = useState(25);
    const indexOfLastCreator = currentPage * cratorsPerPage;
    const indexOfFirstCreator = indexOfLastCreator - cratorsPerPage;

    const currentCreators = creators.slice(indexOfFirstCreator, indexOfLastCreator);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    };


    return (
        <Layout>
            <div className="page-creators">
                <h1 className="subtitle-home">Artists, Designer & Creators </h1>
                <div className="page-creators-containers">
                    {currentCreators.map(creator => (
                        <div className="block-creator-row">
                            <>
                                <Link to={`/creator/detail/${creator.id}`}>
                                    <img src={'/images/creators/' + creator.id + '/' + creator.fileSource} />
                                    <p> {creator.name}</p>
                                </Link>
                            </>
                        </div>
                    ))}
                </div>
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
            </div>
            <Footer />
        </Layout>
    )
}
