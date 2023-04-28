import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Layout from '../components/Layout'
import ReactPaginate from "react-paginate";
import Footer from '../components/navigation/Footer';

const Lookbook = () => {

    const [lookbooks, setLookbooks] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/lookbook/list`)
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

    /** Pagination */
    const [currentPage, setCurrentPage] = useState(1);
    const [lookbooksPerPage] = useState(25);
    const indexOfLastLookbook = currentPage * lookbooksPerPage;
    const indexOfFirstLookbook = indexOfLastLookbook - lookbooksPerPage;

    const currentLookbooks = lookbooks.slice(indexOfFirstLookbook, indexOfLastLookbook);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    };

    return (
        <Layout>
            <div className="page-lookbook">
                <h1 className="subtitle-home text-large">Lookbook</h1>
                <div className="page-lookbook-row">
                    {lookbooks.map(lookbook => (
                        <img src={'/images/lookbook/' + lookbook.filesource} />
                    ))}
                </div>

                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={Math.ceil(currentLookbooks.length / lookbooksPerPage)}
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

export default Lookbook
