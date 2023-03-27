
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import Swal from 'sweetalert2';
import iconActions from '../../images/icon-actions.svg';
import { Link } from 'react-router-dom';

const UsersList = () => {

    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [roles, setRoles] = useState([]);
    const [name, setName] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

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

    const handlePageChange = pageNumber => {
        setCurrentPage(pageNumber);
    };

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
                    axios.get(`/api/admin/user/delete/${dataId}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        },
                    })
                        .then(function (response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'User delete successful',
                                showConfirmButton: false,
                                timer: 1500
                            })

                            fetchData();
                        })
                        .catch(error => {
                            console.log(error);
                            // localStorage.clear();
                            // window.location.pathname = "/";
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
            const nameMatch = name.length === 0 || removeAccents(user.firstname).toLowerCase().includes(removeAccents(name.toLowerCase())) || removeAccents(user.lastname).toLowerCase().includes(removeAccents(name.toLowerCase())) || String(user.id).toLowerCase().includes(name);
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
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [id, setId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        let formData = new FormData()
        formData.append("firstname", firstname)
        formData.append("lastname", lastname)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("role", role)

        axios.post(`/api/admin/add/user/${id}`, formData, {
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
                fetchData();
                setShowModal(false);
                setFirstname('')
                setLastname('')
                setEmail('')
                setPassword('')
                setRole('')

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
                setShowModal(false);
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

    const handleShowModalEmail = () => {
        setShowModalEmail(true);
    };

    const handleCloseModalEmail = () => {
        setShowModalEmail(false);
    };

    const handleSubmitEmail = (e) => {
        e.preventDefault();
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
                <button style={styles.input} onClick={handleShowModal}>Ajouter un nouvel utilisateur</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
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
                            <td>{user.firstname} {user.lastname}</td>
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

            {
                showModal && (
                    <div style={styles.modalContainer}>
                        <div>
                            <h3>Ajouter un nouvel utilisateur</h3>
                            <form>
                                <div style={styles.flex}>
                                    <label>
                                        prénom : <br />
                                        <input type="text" style={styles.input} value={lastname} onChange={e => (setLastname(e.target.value))} />
                                    </label>
                                    <br />
                                    <label>
                                        Nom : <br />
                                        <input type="text" style={styles.input} value={firstname} onChange={e => (setFirstname(e.target.value))} />
                                    </label>
                                </div>

                                <br />
                                <div style={styles.flex}>
                                    <label>
                                        Adresse e-mail :<br />
                                        <input type="email" style={styles.input} value={email} onChange={e => (setEmail(e.target.value))} />
                                    </label>
                                    <br />
                                    <label>
                                        Password :<br />
                                        <input type="password" style={styles.input} value={password} onChange={e => (setPassword(e.target.value))} />
                                    </label>
                                </div>
                                <br />
                                <label>
                                    Roles :<br />
                                    <select name="role" style={styles.input} value={role} onChange={e => (setRole(e.target.value))}>
                                        <option value="ROLE_USER">User</option>
                                        <option value="ROLE_CREATOR">Creator</option>
                                        <option value="ROLE_ADMIN">Admin</option>
                                    </select>
                                </label>
                                <br />
                                <button type="submit" style={styles.input} onClick={handleSubmit}>Ajouter</button>
                                <button onClick={() => {
                                    setFirstname('');
                                    setLastname('');
                                    setEmail('')
                                    setId(null);
                                    handleCloseModal();
                                }} style={styles.input}>Annuler</button>
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
                                    <p key={loge.userId}>{loge.userId}</p>
                                    <p>{loge.logId}</p>
                                    <p>{loge.message}</p>
                                    <p>{loge.code}</p>
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
                            <form>
                                <div style={styles.flex}>
                                    <label>
                                        Objet du mail : <br />
                                        <input type="text" style={styles.input} value={object} onChange={e => (setObject(e.target.value))} />
                                    </label>
                                    <br />
                                    <label>
                                        Message : <br />
                                        <input type="text" style={styles.input} value={content} onChange={e => (setContent(e.target.value))} />
                                    </label>
                                </div>

                                <br />
                                <button type="submit" style={styles.input} onClick={handleSubmitEmail}>Envoyer</button>
                                <button onClick={() => {
                                    setContent('');
                                    setObject('')
                                    setId(null);
                                    handleCloseModalEmail();
                                }} style={styles.input}>Annuler</button>
                            </form>
                        </div>
                    </div>
                )
            }

            <Pagination
                usersPerPage={usersPerPage}
                totalUsers={filteredUsers.length}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
            />
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

export default UsersList
