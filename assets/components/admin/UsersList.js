
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import Swal from 'sweetalert2';
import iconActions from '../../images/icon-actions.svg';
import { Link } from 'react-router-dom';
import ReactPaginate from "react-paginate";

const UsersList = () => {

    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [roles, setRoles] = useState([]);
    const [name, setName] = useState('');
    const [emailUser, setEmailUser] = useState('')
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(15);

    const [selectedUserId, setSelectedUserId] = useState(null);

    /** TRAITEMENTS */
    const fetchData = async () => {
        axios.get(`/api/admin/list/users`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setUsers(response.data.users)
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




    const handleRoleChange = event => {
        setRoles(event.target.value);
    };

    const handleNameChange = event => {
        setName(event.target.value);
    };

    const handleSortOrderChange = event => {
        setSortOrder(event.target.value);
    };

    const handlePageChange = (data) => {
        setCurrentPage(data.selected + 1);
    };

    // const handlePageClick = (data) => {
    //     setCurrentPage(data.selected + 1);
    // };

    const handleOpen = () => {
        setOpen(!open)
    }

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDelete = (event) => {
        const element = event.target;
        const dataId = element.dataset.id;

        Swal.fire({
            title: "Êtes-vous sûr?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui",
            cancelButtonText: "annuler ",
        })
            .then((confirmation) => {
                if (confirmation.value) {
                    axios.delete(`/api/admin/user/delete/${dataId}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        },
                    })
                        .then(function (response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'User delete successful',
                                showConfirmButton: false,
                            })
                            setTimeout(() => {
                                Swal.close();
                            }, 1500);
                            fetchData();
                        })
                        .catch(error => {
                            console.log(error);
                            Swal.fire({
                                icon: 'error',
                                title: 'User delete error',
                                showConfirmButton: false,
                            })
                            setTimeout(() => {
                                Swal.close();
                            }, 1500);
                            fetchData();
                        });
                }
            });

    }

    let filteredUsers = users;
    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    if (roles.length > 0 || name.length > 0 || sortOrder.length > 0) {
        filteredUsers = users.filter(user => {
            const nameMatch = name.length === 0 || removeAccents(user.email).toLowerCase().includes(name.toLowerCase()) || String(user.id).toLowerCase().includes(name);
            const roleMatch = roles.length === 0 || user.roles.some(role => roles.includes(role));

            return nameMatch && roleMatch;
        });
        filteredUsers = filteredUsers.sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.id - a.id;
            }
            return a.id - b.id;
        });
    }

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Form new and update user
    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState('');
    const [roleError, setRoleError] = useState('')

    const resetErrors = () => {
        setFirstnameError(null);
        setLastnameError(null);
        setEmailError(null)
        setPasswordError(null)
        setRoleError(null)
    };

    const validateEmail = (email) => {
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    };

    const validateCustomerData = () => {
        const errors = {};
        const regex = /^[a-zA-ZÀ-ÿ ]+$/;

        if (firstname && (typeof firstname !== 'string' || !firstname.trim() || !regex.test(firstname))) {
            errors.firstname = 'Le prénom doit être une chaîne de caractères';
            setFirstnameError(errors.firstname);
        }
        if (lastname && (typeof lastname !== 'string' || !lastname.trim() || !regex.test(lastname))) {
            errors.lastname = 'Le nom doit être une chaîne de caractères';
            setLastnameError(errors.lastname);
        }

        if (email && (typeof email !== 'string' || !email.trim() || !validateEmail(email))) {
            errors.email = 'L\'adresse e-mail n\'est pas valide';
            setEmailError(errors.email);
        }

        if (password && (!/(?=.*\d)(?=.*[a-zA-Z]).{8,}/.test(password))) {
            errors.password =
                "Le mot de passe doit contenir au moins un chiffre et faire plus de 8 caractères";
            setPasswordError(errors.password);
        }

        if (role && (typeof role !== 'string' || !role.trim())) {
            errors.role = 'Le role doit être une chaîne de caractères';
            setRoleError(errors.role);
        }

        return Object.keys(errors).length ? errors : null;
    };

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [id, setId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        resetErrors();
        const errors = validateCustomerData();
        if (errors) {
            // Si des erreurs sont présentes, les afficher sous les inputs correspondants
            return;
        }
        setIsSaving(true);
        let formData = new FormData()
        formData.append("firstname", firstname)
        formData.append("lastname", lastname)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("role", role)

        Swal.showLoading();
        axios.post(`/api/admin/add/user/${id}`, formData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then((response) => {
                Swal.update({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                })
                setIsSaving(false);
                fetchData();
                setShowModal(false);
                setFirstname('')
                setLastname('')
                setEmail('')
                setPassword('')
                setRole('')
                setTimeout(() => {
                    Swal.close();
                }, 1500);

            })
            .catch((error) => {
                console.log(error);
                Swal.update({
                    icon: 'error',
                    title: 'erreur',
                    showConfirmButton: false,
                })
                setIsSaving(false)
                setShowModal(false);
                setTimeout(() => {
                    Swal.close();
                }, 1500);
            });
    }

    /** MODAL LOGS */
    const [allLogsByUsers, setAllLogsByUsers] = useState(null);
    const [showModalLogs, setShowModalLogs] = useState(false);

    const handleShowModalLogs = () => {
        setShowModalLogs(true);
    };

    const handleCloseModalLogs = () => {
        setShowModalLogs(false);
    };

    /** Email Form */
    const [content, setContent] = useState('');
    const [object, setObject] = useState('');
    const [iduser, setIduser] = useState(null)
    const [showModalEmail, setShowModalEmail] = useState(false);
    const [isSavingEmail, setIsSavingEmail] = useState(false);
    const [emailSendError, setEmailSendError] = useState(false);

    const handleShowModalEmail = () => {
        setShowModalEmail(true);
    };

    const handleCloseModalEmail = () => {
        setShowModalEmail(false);
    };

    const handleSubmitEmail = (e) => {
        e.preventDefault();
        if (!content) {
            setEmailSendError('Erreur le message ne peut pas etre vide')
            return;
        }
        setIsSavingEmail(true);
        let formData = new FormData()
        formData.append("content", content)
        formData.append("object", object)

        axios.post(`/api/admin/user/send/email/${iduser}`, formData, {
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
                setIsSavingEmail(false);
                fetchData();
                setShowModalEmail(false);
                setContent('')
                setObject('')
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'erreur',
                    showConfirmButton: false,
                    timer: 2500
                })
                setIsSavingEmail(false)
                setShowModalEmail(false);
            });
    }

    return (
        <div>
            <div style={styles.filtreContainer}>
                <select onChange={handleRoleChange} style={styles.input}>
                    <option value="ROLE_USER">User</option>
                    <option value="ROLE_CREATOR">Creator</option>
                    <option value="ROLE_ADMIN">Admin</option>
                </select>
                <input value={name} onChange={handleNameChange} style={styles.input} placeholder="Rechercher par nom, prénom, id" />
                <select onChange={handleSortOrderChange} style={styles.input}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <button style={{ ...styles.input, ...styles.buttonPrimary }} onClick={handleShowModal}>Ajouter un nouveau utilisateur</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th>Created at</th>
                        <th>Updated at</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.roles.map(role => (
                                    role + ' '
                                ))}
                            </td>
                            <td >{user.createdAt} </td>
                            <td>{user.updatedAt}</td>
                            <td style={styles.table__td_relative} onClick={() => {
                                setSelectedUserId(selectedUserId === user.id ? null : user.id);
                            }}>
                                <img className="table__td-relative-img" src={iconActions} alt="" />
                                {selectedUserId === user.id && (
                                    <div className="table__breadcrumb">
                                        <Link to={`/admin/profil/details/${user.id}`}>Détails</Link>
                                        <a data-id={user.id} onClick={(event) => handleDelete(event)}>Supprimer</a>
                                        <a data-id={user.id} onClick={() => {
                                            const usersLogs = logs.filter(log => log.userId === user.id);
                                            console.log(usersLogs)
                                            setAllLogsByUsers(usersLogs)
                                            handleShowModalLogs()
                                        }}>Logs</a>
                                        <a data-id={user.id} onClick={() => {
                                            setFirstname(user.firstname);
                                            setLastname(user.lastname);
                                            setEmail(user.email)
                                            setId(user.id);
                                            handleShowModal();
                                        }}>Modifier</a>
                                        <a data-id={user.id} onClick={() => {
                                            setIduser(user.id);
                                            handleShowModalEmail();
                                        }}>Envoyer un mail</a>
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
                onPageChange={handlePageChange}
                pageRangeDisplayed={5}
                pageCount={Math.ceil(filteredUsers.length / usersPerPage)}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                activeClassName="active"
            />

            {
                showModal && (
                    <div style={styles.modalContainer}>
                        <div>
                            <h3>Ajouter un nouvel utilisateur</h3>
                            <br />
                            <form style={styles.form}>
                                <div style={styles.flex}>
                                    <div style={styles.formGroup}>
                                        <label>Nom</label>
                                        <input type="text" style={{ ...styles.input, ...styles.inputForm }} value={lastname} onChange={e => (setLastname(e.target.value))} placeholder="Nom " />
                                        {lastnameError && <span className="error" style={{ ...styles.inputError }}>{lastnameError}</span>}
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label>Prénom</label>
                                        <input type="text" style={{ ...styles.input, ...styles.inputForm }} value={firstname} onChange={e => (setFirstname(e.target.value))} placeholder="Prénom" />
                                        {firstnameError && <span className="error" style={{ ...styles.inputError }}>{firstnameError}</span>}
                                    </div>
                                </div>

                                <div style={styles.flex}>
                                    <div style={styles.formGroup}>
                                        <label>Adresse e-mail </label>
                                        <input type="email" style={{ ...styles.input, ...styles.inputForm }} value={email} onChange={e => (setEmail(e.target.value))} placeholder="Email" />
                                        {emailError && <span className="error" style={{ ...styles.inputError }}>{emailError}</span>}
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label>Password </label>
                                        <input type="password" style={{ ...styles.input, ...styles.inputForm }} value={password} onChange={e => (setPassword(e.target.value))} placeholder="Password" />
                                        {passwordError && <span className="error" style={{ ...styles.inputError }}>{passwordError}</span>}
                                    </div>
                                </div>

                                <div style={styles.flex}>
                                    <div style={styles.formGroup}>
                                        <label>
                                            Roles</label>
                                        <select name="role" style={{ ...styles.input, ...styles.inputForm }} value={role} onChange={e => (setRole(e.target.value))}>
                                            <option value="">Choisir un rôle</option>
                                            <option value="ROLE_USER">User</option>
                                            <option value="ROLE_CREATOR">Creator</option>
                                            <option value="ROLE_ADMIN">Admin</option>
                                        </select>
                                        {roleError && <span className="error" style={{ ...styles.inputError }}>{roleError}</span>}
                                    </div>
                                    <div style={styles.formGroup}>

                                    </div>
                                </div>

                                <br />
                                <div style={styles.flex}>
                                    <button type="submit" style={{ ...styles.input, ...styles.inputForm, ...styles.buttonPrimary }} onClick={handleSubmit}>Ajouter</button>
                                    <button onClick={() => {
                                        setFirstname('');
                                        setLastname('');
                                        setEmail('')
                                        setId(null);
                                        handleCloseModal();
                                        resetErrors();
                                    }} style={{ ...styles.input, ...styles.inputForm }}>Annuler</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Modal Logs */}
            {
                showModalLogs && (
                    <div style={styles.modalContainer}>
                        <div onClick={handleCloseModalLogs}>Fermer</div>
                        <div style={styles.modalContainerContent}>
                            {allLogsByUsers.length > 0 ? allLogsByUsers.map(loge => (
                                <>
                                    <div key={loge.logId} style={styles.modalContainerContentInside}>
                                        <p>#{loge.logId}</p>
                                        <p>{loge.message}</p>
                                        <p>CODE_{loge.code}</p>
                                    </div>
                                    <br />
                                </>
                            )) : <p>Pas de logs</p>}
                        </div>
                    </div>
                )
            }

            {/* Modal Email */}
            {
                showModalEmail && (
                    <div style={styles.modalContainer}>
                        <div>
                            <h3>Envoyer un email</h3>
                            <br />
                            <form style={styles.form}>
                                <div style={styles.flex}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Objet du mail : <br /> </label>
                                        <input type="text" style={{ ...styles.input, ...styles.inputForm }} value={object} onChange={e => (setObject(e.target.value))} />
                                    </div>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Message</label>
                                    <textarea style={{ ...styles.input, ...styles.inputForm, ...styles.textArea }} value={content} onChange={e => (setContent(e.target.value))} />
                                    {emailSendError && <span className="error" style={{ ...styles.inputError }}>{emailSendError}</span>}
                                </div>

                                <div style={styles.flex}>
                                    <button type="submit" style={{ ...styles.input, ...styles.buttonPrimary }} onClick={handleSubmitEmail}>Envoyer</button>
                                    <button onClick={() => {
                                        setContent('');
                                        setObject('')
                                        setId(null);
                                        handleCloseModalEmail();
                                    }} style={styles.input}>Annuler</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* <Pagination
                usersPerPage={usersPerPage}
                totalUsers={filteredUsers.length}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
            /> */}

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
        margin: '0.1rem 0'
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
        gap: '10px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '15px'
    },
    modalContainerContent: {
        height: '320px',
        overflow: 'scroll',
        marginTop: '15px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    inputForm: {
        width: '90%'
    },
    inputError: {
        fontSize: '0.7rem',
        color: '#d64d4d'
    },
    textArea: {
        width: '95%',
        height: '170px'
    },
    label: {
        fontSize: '0.9rem',
        color: 'grey'
    },
    buttonPrimary: {
        backgroundColor: 'rgb(245, 78, 49)',
        color: '#fff'
    },
    modalContainerContentInside: {
        backgroundColor: '#f0f0f1',
        padding: '10px',
        borderRadius: '10px'
    }
}

export default UsersList
