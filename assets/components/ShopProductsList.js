import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from "react-paginate";

const ShopProductsList = () => {

    const [campagnes, setCampagnes] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/list/shop`)
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


    /** Filtre */
    const [currentPage, setCurrentPage] = useState(1);
    const [campagnesPerPage] = useState(15);
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterA3, setFilterA3] = useState(false);
    const [filterA4, setFilterA4] = useState(false);
    const [filterA2, setFilterA2] = useState(false);

    const handleSortOrderChange = event => {
        setSortOrder(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        setFilterA3(event.target.checked);
    }

    const handleCheckboxChangeA2 = (event) => {
        setFilterA2(event.target.checked);
    }

    const handleCheckboxChangeA4 = (event) => {
        setFilterA4(event.target.checked);
    }

    let filteredCampagnes = campagnes;
    if (sortOrder.length > 0 || filterA3 || filterA2 || filterA4) {
        filteredCampagnes = campagnes.filter(campagne => {
            const sizeMatchA3 = !filterA3 || campagne.size === "A3";
            const sizeMatchA2 = !filterA2 || campagne.size === "A2";
            const sizeMatchA4 = !filterA4 || campagne.size === "A4";

            if (filterA2 && filterA3 && filterA4) {
                return sizeMatchA2 || sizeMatchA3 || sizeMatchA4;
            }
            else if (filterA2 && filterA3) {
                return sizeMatchA2 || sizeMatchA3;
            }
            else if (filterA2 && filterA4) {
                return sizeMatchA2 || sizeMatchA4;
            }
            else if (filterA3 && filterA4) {
                return sizeMatchA3 || sizeMatchA4;
            }
            else if (filterA2) {
                return sizeMatchA2;
            }
            else if (filterA3) {
                return sizeMatchA3;
            }
            else if (filterA4) {
                return sizeMatchA4;
            }
            return true;
        });
        filteredCampagnes = filteredCampagnes.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.id - b.id;
            }
            return b.id - a.id;
        });
    }


    /** Pagination */
    const indexOfLastCampagne = currentPage * campagnesPerPage;
    const indexOfFirstCampagne = indexOfLastCampagne - campagnesPerPage;

    const currentCampagnes = filteredCampagnes.slice(indexOfFirstCampagne, indexOfLastCampagne);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    };


    const [cartItemsCount, setCartItemsCount] = useState(0);

    // Ajoute un produit dans le localStorage
    const addToCart = (campagne) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Vérifie si le produit est déjà dans le panier
        let campagneInCart = false;
        cartItems.forEach(item => {
            if (item.id === campagne.id) {
                item.quantity++;
                item.total = item.quantity * item.price
                campagneInCart = true;
            }
        });

        // Ajoute le produit au panier s'il n'y est pas déjà
        if (!campagneInCart) {
            cartItems.push({ id: campagne.id, name: campagne.nameproject, price: campagne.price, quantity: 1, total: campagne.price });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));


        setCartItemsCount(cartItems.length);
    };

    return (
        <div>
            <select onChange={handleSortOrderChange}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
            <br />
            Filtrer par taille :
            <label>
                A4
                <input type="checkbox" checked={filterA4} onChange={handleCheckboxChangeA4} />
            </label>
            <label>
                A3
                <input type="checkbox" checked={filterA3} onChange={handleCheckboxChange} />
            </label>
            <label>
                A2
                <input type="checkbox" checked={filterA2} onChange={handleCheckboxChangeA2} />
            </label>
            <br />
            {currentCampagnes.map(campagne => (
                <>
                    <Link to={`/shop/product/details/${campagne.slug}`}>
                        <img src={'/images/campagnes/' + campagne.userid + '/' + campagne.fileSource} alt={campagne.nameproject} />
                        <p> {campagne.nameproject}</p>
                        <p> {campagne.name}</p>
                        <p> {campagne.price}€</p>
                    </Link>
                    <br />
                    <button onClick={() => addToCart(campagne)}>Ajouter au panier</button>
                </>
            ))}
            <br />
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={Math.ceil(filteredCampagnes.length / campagnesPerPage)}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                activeClassName="active"
            />
        </div>
    )
}

export default ShopProductsList
