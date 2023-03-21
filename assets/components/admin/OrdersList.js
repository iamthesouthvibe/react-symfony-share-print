import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from "react-paginate";
import iconActions from '../../images/icon-actions.svg';
import { Link } from 'react-router-dom';

export const OrdersList = () => {

    const [orders, setOrders] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/admin/order/list`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setOrders(response.data.orders)
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

    if (!orders) {
        return <div>Chargement en cours...</div>;
    }

    console.log(orders);

    // Filter search
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [statusPaid, setStatusPaid] = useState('')
    const [sortOrder, setSortOrder] = useState('desc');

    const handleSearchChange = event => {
        setSearch(event.target.value);
    };

    const handleStatusChange = event => {
        setStatus(event.target.value);
    };

    const handleStatusPaidChange = event => {
        setStatusPaid(event.target.value);
    };

    const handleSortOrderChange = event => {
        setSortOrder(event.target.value);
    };

    const [selectedOrderId, setSelectedOrderId] = useState(null);

    let filteredOrders = orders;
    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    if (search.length > 0 || status.length > 0 || sortOrder.length > 0) {
        filteredOrders = orders.filter(order => {
            const searchMatch = search.length === 0 || removeAccents(order.customer_name).toLowerCase().includes(removeAccents(search.toLowerCase())) || String(order.id).toLowerCase().includes(search);
            const statusMatch = status.length === 0 || order.print_status.toLowerCase().includes(status.toLowerCase());
            const statusSendMatch = statusPaid.length === 0 || order.send_status.toLowerCase().includes(statusPaid.toLowerCase());
            return searchMatch && statusMatch && statusSendMatch;
        });
        filteredOrders = filteredOrders.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.id - b.id;
            }
            return b.id - a.id;
        });
    }

    // Pagination
    // Fetch data
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    };

    return (
        <div>
            <div style={styles.filtreContainer}>
                <input style={styles.input} onChange={handleSearchChange} value={search} placeholder="Id, nom.." />
                <select style={styles.input} onChange={handleStatusChange}>
                    <option value="" selected>Select print status</option>
                    <option value="À imprimer">À imprimer</option>
                    <option value="Imprimé">Imprimé</option>
                </select>
                <select style={styles.input} onChange={handleStatusPaidChange}>
                    <option value="" selected>Select send status</option>
                    <option value="À envoyer">À envoyer</option>
                    <option value="Envoyé">Envoyé</option>
                </select>
                <select onChange={handleSortOrderChange} style={styles.input}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Created At</th>
                        <th>Name</th>
                        <th>Total Price</th>
                        <th>Payment status</th>
                        <th>Print status</th>
                        <th>Send status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map(order => (
                        <tr>
                            <td>{order.id}</td>
                            <td>{order.createdAt}</td>
                            <td>{order.customer_name}</td>
                            <td>{order.total_price}€</td>
                            <td>{order.status}</td>
                            <td>{order.print_status}</td>
                            <td>{order.send_status}</td>
                            <td style={styles.table__td_relative} onClick={() => {
                                setSelectedOrderId(selectedOrderId === order.id ? null : order.id);
                            }}>
                                <img className="table__td-relative-img" src={iconActions} alt="" />
                                {selectedOrderId === order.id && (
                                    <div className="table__breadcrumb">
                                        <Link to={`/admin/order/details/${order.id}`}>Détails</Link>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={Math.ceil(filteredOrders.length / ordersPerPage)}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                activeClassName="active"
            />
        </div>
    )

}
const styles = {
    input: {
        width: '200px',
        border: '1px solid #d1d5db',
        color: '#111827',
        borderRadius: '0.4rem',
        fontSize: '0.8rem',
        padding: '0.5rem',
        margin: '0.5rem 0'
    },
    filtreContainer: {
        display: 'flex',
        gap: '10px'
    },
    table__td_relative: {
        position: 'relative'
    },
    modalContainer: {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.2)',
        borderRadius: '0.4rem',
        height: '400px',
        width: '550px',
        zIndex: '20'
    },
    flex: {
        display: 'flex',
        gap: '20px'
    },
    modalContainerContent: {
        height: '320px',
        overflow: 'scroll',
        padding: '25px'
    },
    cardCampagne: {
        height: '100%',
        padding: '17px',
        border: '2px solid #F2F2F2',
        borderRadius: '11px',
        margin: '15px 0px',
    },
    cardCampagne_flex: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '18px',
        width: '100%',
        gap: '50px'
    },
    cardCampagne_flex_child: {
        width: '100%'
    },
    title: {
        fontSize: '18px',
        color: '#1C1C1C',
        textTransform: 'capitalize'
    },
    ncommande: {
        fontSize: '16px',
        color: 'rgba(0, 0, 0, 0.6)'
    },
    createdat: {
        fontSize: '13px',
        color: 'rgba(0, 0, 0, 0.6)'
    },
    orangePrimary: {
        color: '#F54E31'
    },
    subtitle: {
        fontSize: '12px',
        color: 'rgba(0, 0, 0, 0.6)'
    },
    paragraph: {
        fontSize: '13px',
    },
    flexGroup: {
        display: 'flex',
        gap: '100px',
    },
    flexLinks: {
        display: 'flex',
        gap: '40px',
        marginTop: '25x'
    },
    linkstyle: {
        color: '#F54E31',
        fontSize: '13.5px',
        cursor: 'pointer',
        textDecoration: 'none'
    }
}
