import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from "react-paginate";
import iconActions from '../../images/icon-actions.svg';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

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


    const [shippingList, setShippingList] = useState([]);
    const fetchShippingList = async () => {
        axios.get(`/api/admin/shipping/list`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setShippingList(response.data.shippings)
            })
            .catch(error => {
                console.log(error);
                // localStorage.clear();
                // window.location.pathname = "/";
            });
    }
    useEffect(() => {
        fetchShippingList()
    }, []);

    console.log(shippingList)

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
    const [ordersPerPage] = useState(15);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    };

    // Download print 
    const handleDownloadPrint = () => {
        Swal.fire({
            title: "Êtes-vous sûr de vouloir effectuer cette action ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui",
            cancelButtonText: "annuler ",
        })
            .then((confirmation) => {
                if (confirmation.value) {
                    axios.get('/api/admin/order/print', {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                            'Accept': "application/pdf"
                        },
                        responseType: 'blob',
                    })
                        .then(response => {
                            const blob = new Blob([response.data], { type: 'application/pdf' });
                            const filename = getFilenameFromResponseHeader(response);
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.setAttribute('download', filename);
                            link.click();
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
    };


    function getFilenameFromResponseHeader(response) {
        const contentDispositionHeader = response.headers['content-disposition'];
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDispositionHeader);
        if (matches != null && matches[1]) {
            return matches[1].replace(/['"]/g, '');
        } else {
            return 'print.pdf';
        }
    }


    const handlePrintStatus = (event) => {
        const element = event.target;
        const dataId = element.dataset.id;

        Swal.fire({
            title: "Êtes-vous sûr de vouloir changer le status en imprimé ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui",
            cancelButtonText: "annuler ",
        })
            .then((confirmation) => {
                if (confirmation.value) {
                    axios.get(`/api/admin/order/printstatus/${dataId}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        },
                    })
                        .then(function (response) {
                            Swal.fire({
                                icon: 'success',
                                title: response.data.success,
                                showConfirmButton: false,
                                timer: 1500
                            })

                            fetchData();
                        })
                        .catch(error => {
                            Swal.fire({
                                icon: 'error',
                                title: response.data.error,
                                showConfirmButton: false,
                                timer: 1500
                            })

                            fetchData();
                            console.log(error);

                            // localStorage.clear();
                            // window.location.pathname = "/";
                        });
                }
            });
    }


    const handleDownloadOrderDelivery = () => {
        Swal.fire({
            title: "Êtes-vous sûr de vouloir effectuer cette action ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui",
            cancelButtonText: "annuler ",
        })
            .then((confirmation) => {
                if (confirmation.value) {
                    axios.get('/api/admin/print/delivery', {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        },
                        responseType: 'blob',
                    })
                        .then(response => {
                            const blob = new Blob([response.data]);
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            const disposition = response.headers['content-disposition'];
                            const match = disposition.match(/filename=(.+)$/);
                            if (match) {
                                const filename = match[1];
                                link.setAttribute('download', filename);
                            } else {
                                link.setAttribute('download', 'orders.zip');
                            }
                            link.click();
                        })
                        .catch(error => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Aucune commande a expedié',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        });
                }
            });
    };


    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => {
        setShowModal(!showModal);
    };

    const [idshipping, setIdshipping] = useState('');
    const [idorder, setIdorder] = useState('')
    const [isSaving, setIsSaving] = useState(false);
    const [shippingError, setShippingError] = useState(false)

    const handleShippingStatus = (e) => {
        e.preventDefault();
        if (!idshipping) {
            setShippingError('Le champ id shipping ne peut pas être vide')
            return
        }
        setIsSaving(true);
        let formData = new FormData()

        console.log(idshipping);
        formData.append("idshipping", idshipping)
        axios.post(`/api/admin/order/shippingstatus/${idorder}`, formData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.success,
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                fetchData();
                setShowModal();
                setIdshipping('')
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error,
                    showConfirmButton: false,
                    timer: 1500
                })

                setIsSaving(false);
                fetchData();
                setShowModal();
                setIdshipping('')

                // localStorage.clear();
                // window.location.pathname = "/";
            });

    }


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
                    {shippingList.map(shipping => (
                        <option value={shipping.libelle}>{shipping.libelle}</option>
                    ))}
                </select>

                <select onChange={handleSortOrderChange} style={styles.input}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
                <button onClick={handleDownloadPrint} style={{ ...styles.input, ...styles.buttonPrimary }}>Print download</button>
                <button onClick={handleDownloadOrderDelivery} style={{ ...styles.input, ...styles.buttonPrimary }}>Delivery download</button>
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
                        <th>Shipping status</th>
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
                                        <a data-id={order.id} onClick={(event) => handlePrintStatus(event)}>Commande imprimée</a>
                                        <a data-id={order.id} onClick={() => {
                                            setIdorder(order.id);
                                            handleShowModal();
                                        }}>Commande expédiée</a>
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

            {
                showModal && (
                    <div style={styles.modalContainer}>
                        <div>
                            <h3>Vous allez changer le statut en "declaratif receptionné", veuillez entrer l'id shipping </h3>
                            <br />
                            <form>
                                <div style={styles.flex}>
                                    <div style={styles.formGroup}>
                                        <label> Id shipping : </label>
                                        <input type="text" style={styles.input} value={idshipping} onChange={e => (setIdshipping(e.target.value))} />
                                        {shippingError && <span className="error" style={{ ...styles.inputError }}>{shippingError}</span>}
                                        <br />
                                    </div>
                                </div>
                                <br />
                                <div style={styles.flex}>
                                    <button type="submit" style={{ ...styles.input, ...styles.buttonPrimary }} onClick={handleShippingStatus}>Ajouter</button>
                                    <button style={styles.input} onClick={() => {
                                        setIdorder('');
                                        setIdshipping('');
                                        handleShowModal();
                                    }}>Annuler</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >

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
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '0px'
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
        zIndex: '20',
        padding: '20px'
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
    },
    buttonPrimary: {
        backgroundColor: 'rgb(245, 78, 49)',
        color: '#fff'
    },
    inputError: {
        fontSize: '0.7rem',
        color: '#d64d4d'
    }
}
