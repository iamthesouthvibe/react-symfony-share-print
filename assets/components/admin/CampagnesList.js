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
    const [logs, setLogs] = useState([]);


    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/admin/list/campagnes`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setCampagnes(response.data.campagnes)
                setLogs(response.data.logs)
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


    const handleDownload = (campagneId) => {
        axios.get(`/api/admin/campagne/download/${campagneId}`, {
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
        fetchData()
    }

    const handleValidCampaign = (campagneId) => {
        axios.get(`/api/admin/campagne/accept/${campagneId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: response.data.success,
                    showConfirmButton: false,
                    timer: 2500
                })
            })


            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error,
                    showConfirmButton: false,
                    timer: 2500
                })
                console.error(error);
            });

        fetchData()
    }

    const handleRejectCampaign = (campagneId) => {
        axios.get(`/api/admin/campagne/reject/${campagneId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: response.data.success,
                    showConfirmButton: false,
                    timer: 2500
                })
            })

            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error,
                    showConfirmButton: false,
                    timer: 2500
                })
                console.error(error);
            });

        fetchData()
    }

    /** MODAL LOGS */
    const [allLogsBycampagnes, setAllLogsByCampagnes] = useState(null);
    const [showModalLogs, setShowModalLogs] = useState(false);

    const handleShowModalLogs = () => {
        setShowModalLogs(true);
    };

    const handleCloseModalLogs = () => {
        setShowModalLogs(false);
    };

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
            {currentCampagnes.map(campagne => (
                <section style={styles.cardCampagne} data-id={campagne.id}>
                    <div style={styles.cardCampagne_flex}>
                        <div style={styles.cardCampagne_flex_child}>
                            <h1 style={styles.title}>{campagne.nameproject}</h1>
                            <h2 style={styles.ncommande}>{campagne.ncommande}</h2>
                            <h3 style={styles.createdat}>{campagne.createdAt}</h3>
                        </div>
                        <div style={styles.cardCampagne_flex_child}>
                            <h4 style={styles.title}>ID : {campagne.id}</h4>
                        </div>
                        <div style={styles.cardCampagne_flex_child}>
                            <h5 style={styles.orangePrimary}>{campagne.status}</h5>

                        </div>
                    </div>
                    <div style={styles.cardCampagne_flex}>
                        <div style={styles.cardCampagne_flex_child}>
                            <h6 style={styles.subtitle}>Creator information</h6>
                            <p style={styles.paragraph}>{campagne.name}</p>
                            <p style={styles.paragraph}>
                                {campagne.roles.map(role => (
                                    <>
                                        {role + ' '}
                                    </>
                                ))}
                            </p>
                        </div>
                        <div style={styles.cardCampagne_flex_child}>
                            <h6 style={styles.subtitle}>Creator information</h6>
                            <p style={styles.paragraph}>{campagne.filename}</p>
                            <p style={styles.paragraph}>Paper {campagne.paper}</p>
                            <p style={styles.paragraph}>{campagne.size} - {campagne.weight}GR</p>
                        </div>
                        <div style={styles.cardCampagne_flex_child}>
                            <div style={styles.flexGroup}>
                                <div>
                                    <h6 style={styles.subtitle}>Price</h6>
                                    <p style={styles.paragraph}>{campagne.price}</p>
                                </div>
                                <div>
                                    <h6 style={styles.subtitle}>Days</h6>
                                    <p style={styles.paragraph}>{30 - campagne.days}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={Object.assign({},
                        { ...styles.flexLinks },
                        { ...styles.orangePrimary }
                    )}>
                        <div>
                            <Link style={styles.linkstyle} to={`/admin/campagne/details/${campagne.id}`}>Show details</Link>
                        </div>
                        <div>
                            <a style={styles.linkstyle} onClick={() => handleDownload(campagne.id)} >Download file</a>
                        </div>
                        <div>
                            <a style={styles.linkstyle} onClick={() => { campagne.acceptedAt == '' ? handleValidCampaign(campagne.id) : false }}>Accept</a>
                            <p style={styles.paragraph}>{campagne.acceptedAt !== '' ? campagne.acceptedAt : null}</p>
                        </div>
                        <div>
                            <a style={styles.linkstyle} onClick={() => { campagne.rejectAt == '' ? handleRejectCampaign(campagne.id) : false }}>Reject</a>
                            <p style={styles.paragraph}>{campagne.rejectAt !== '' ? campagne.rejectAt : null}</p>
                        </div>
                        <div>
                            <a style={styles.linkstyle} data-id={campagne.id} onClick={() => {
                                const campagneLogs = logs.filter(log => log.campagneid === campagne.id);
                                console.log(campagneLogs)
                                setAllLogsByCampagnes(campagneLogs)
                                handleShowModalLogs()
                            }}>View logs</a>
                        </div>
                    </div>
                </section>
            ))}

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

            {/* Modal Logs */}
            {
                showModalLogs && (
                    <div style={styles.modalContainer}>
                        <div onClick={handleCloseModalLogs}>Fermer</div>
                        <div style={styles.modalContainerContent}>
                            {allLogsBycampagnes.length > 0 ? allLogsBycampagnes.map(loge => (
                                <>
                                    <p key={loge.logId}>{loge.logId}</p>
                                    <p>{loge.campagneid}</p>
                                    <p>{loge.message}</p>
                                    <p>{loge.code}</p>
                                </>
                            )) : <p>Pas de logs</p>}
                        </div>
                    </div>
                )
            }
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

export default CampagnesList
