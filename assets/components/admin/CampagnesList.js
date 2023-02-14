import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import iconActions from '../../images/icon-actions.svg';
import ReactPaginate from "react-paginate";
import { Link } from 'react-router-dom';



const CampagnesList = () => {

    // Fetch data
    const [currentPage, setCurrentPage] = useState(1);
    const [campagnesPerPage] = useState(10);
    const [campagnes, setCampagnes] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/list/campagnes`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setCampagnes(response.data.campagnes)
                //setLogs(response.data.logs)
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

    // Filter search
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [sortOrder, setSortOrder] = useState('desc');

    const handleSearchChange = event => {
        setSearch(event.target.value);
    };

    const handleStatusChange = event => {
        setStatus(event.target.value);
    };

    const handleSortOrderChange = event => {
        setSortOrder(event.target.value);
    };

    let filteredCampagnes = campagnes;
    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    if (search.length > 0 || status.length > 0 || sortOrder.length > 0) {
        filteredCampagnes = campagnes.filter(campagne => {
            const searchMatch = search.length === 0 || removeAccents(campagne.ncommande).toLowerCase().includes(removeAccents(search.toLowerCase())) || removeAccents(campagne.name).toLowerCase().includes(removeAccents(search.toLowerCase())) || String(campagne.id).toLowerCase().includes(search);
            const statusMatch = status.length === 0 || campagne.status.toLowerCase().includes(status.toLowerCase());
            return searchMatch && statusMatch;
        });
        filteredCampagnes = filteredCampagnes.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.id - b.id;
            }
            return b.id - a.id;
        });
    }

    // Pagination
    const indexOfLastCampagne = currentPage * campagnesPerPage;
    const indexOfFirstCampagne = indexOfLastCampagne - campagnesPerPage;

    const currentCampagnes = filteredCampagnes.slice(indexOfFirstCampagne, indexOfLastCampagne);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    };

    const [selectedCampagneId, setSelectedCampagneId] = useState(null);


    // Download
    const [CampaignCommand, setCampaignCommand] = useState('')
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleDownload = () => {
        axios.get(`/api/admin/campagne/download/${selectedCampagneId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': "application/pdf"
            },
            responseType: 'blob',
        })
            .then(response => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', CampaignCommand + '.pdf');
                link.click();
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleValidCampaign = () => {
        axios.get(`/api/admin/campagne/accept/${selectedCampagneId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: response.data.success,
                    showConfirmButton: false,
                    timer: 1500
                })
            })

            .catch(error => {
                Swal.fire({
                    icon: 'success',
                    title: 'error',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.error(error);
            });

        fetchData()
    }

    return (
        <div>
            <div style={styles.filtreContainer}>
                <input style={styles.input} onChange={handleSearchChange} value={search} placeholder="Rechercher par N°Commande, Id, nom" />
                <select style={styles.input} onChange={handleStatusChange}>
                    <option value="" selected>Select your option</option>
                    <option value="À valider">À valider</option>
                    <option value="En cours">En cours</option>
                    <option value="En attente de paiement">En attente de paiement</option>
                    <option value="Terminée">Terminée</option>
                    <option value="Terminée">Archivée</option>
                    <option value="Refuser">Refuser</option>
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
                        <th>Ncommande</th>
                        <th>Name</th>
                        <th>Name project</th>
                        <th>Price</th>
                        <th>Jours restant</th>
                        <th>Status</th>
                        <th>Created at</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCampagnes.map(campagne => (
                        <tr key={campagne.id}>
                            <td>{campagne.id}</td>
                            <td>{campagne.ncommande}</td>
                            <td>
                                <Link to={`/admin/profil/details/${campagne.userid}`}>{campagne.name}</Link>
                            </td>
                            <td>{campagne.nameproject}</td>
                            <td>{campagne.price}</td>
                            <td>{30 - campagne.days}J</td>
                            <td>{campagne.status}</td>
                            <td >{campagne.createdAt} </td>
                            <td style={styles.table__td_relative} onClick={() => {
                                setSelectedCampagneId(selectedCampagneId === campagne.id ? null : campagne.id)
                                setCampaignCommand(campagne.ncommande)
                            }}>
                                <img className="table__td-relative-img" src={iconActions} alt="" />
                                {selectedCampagneId === campagne.id && (
                                    <div className="table__breadcrumb">
                                        <a onClick={() => {
                                            handleDownload()
                                        }}>Télécharger le fichier source</a>
                                        <Link to={`/admin/campagne/details/${campagne.id}`}>Détails</Link>
                                        <a onClick={() => { handleValidCampaign() }}>Valider</a>
                                        {/*
                                        <a data-id={user.id} onClick={() => {
                                            setFirstname(user.firstname);
                                            setLastname(user.lastname);
                                            setEmail(user.email)
                                            setId(user.id);
                                            handleShowModal();
                                        }}>Modifier</a>
                                    */}
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
                pageCount={Math.ceil(filteredCampagnes.length / campagnesPerPage)}
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
    }
}

export default CampagnesList
