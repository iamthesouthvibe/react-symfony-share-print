import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import Swal from 'sweetalert2';

const LookbookList = () => {

    const [lookbooks, setLookbooks] = useState([]);

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/marketing/lookbook/list`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
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

    if (!lookbooks) {
        return <div>Chargement en cours...</div>;
    }

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(!showModal);
    };

    const [file, setFile] = useState(false);
    const [fileError, setFileError] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setFileError('Le champ file ne peut pas etre vide');
            return;
        }
        setIsSaving(true);
        let formData = new FormData()

        formData.append("file", file)

        axios.post('/api/marketing/lookbook/add', formData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                handleShowModal()
                fetchData()
                setFileError('');
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'erreur',
                    showConfirmButton: false,
                    timer: 2500
                })
                setIsSaving(false)
                handleShowModal()
                fetchData()
                setFileError('');
            });
    };



    return (
        <div>
            <div style={styles.filtreContainer}>
                <button style={{ ...styles.input, ...styles.buttonPrimary }} onClick={handleShowModal}>Ajouter un nouveau lookbook</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Picture</th>
                        <th>Filename</th>
                    </tr>
                </thead>
                <tbody>
                    {lookbooks.map(lookbook => (
                        <tr>
                            <td>{lookbook.id}</td>
                            <td><img src={'/images/lookbook/' + lookbook.filesource} style={styles.img} /></td>
                            <td>{lookbook.filesource}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {
                showModal && (
                    <div style={styles.modalContainer}>
                        <div>
                            <h3>Ajouter un nouveau lookbook</h3>
                            <br />
                            <form>
                                <div style={styles.formGroup}>
                                    <label>Fichier</label>
                                    <input type="file" accept="application/png" onChange={e => (setFile(e.target.files[0]))} />
                                    {fileError && <span className="error" style={{ ...styles.inputError }}>{fileError}</span>}
                                </div>

                                <br />
                                <div style={styles.flex}>
                                    <button type="submit" style={{ ...styles.input, ...styles.buttonPrimary }} disabled={isSaving} onClick={handleSubmit}>Envoyer</button>
                                    <button onClick={() => {
                                        setFile('');
                                        handleShowModal();
                                    }} style={styles.input}>Annuler</button>
                                </div>
                            </form>
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
    img: {
        width: '80px',
        // padding: '10px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '0px'
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

export default LookbookList
