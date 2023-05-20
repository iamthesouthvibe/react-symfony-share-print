import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import LayoutAdmin from '../components/admin/LayoutAdmin';

const AminProfilDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`/api/admin/user/detail/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setUser(response.data);
            })
            .catch(error => {
                console.log(error);
                // localStorage.clear();
                // window.location.pathname = "/";
            });
    }, []);

    const breadcrumbItems = [
        { label: "User profil", link: "/admin/profil/overview" },
        { label: "Détails", link: "" },
    ];

    if (!user) {
        return <div>Chargement en cours...</div>;
    }

    return (
        <>
            <Header items={breadcrumbItems} />
            <Sidebar />
            <LayoutAdmin>
                <div style={styles.headerDetailsContainer}>
                    <h1>{user.firstname} {user.lastname}</h1>
                    <h2 style={styles.textSecondary}>{user.email} </h2>
                    {user.roles.map(role => (
                        <span>{role} </span>
                    ))}
                </div>
                <div style={styles.threeContainer}>
                    <div style={{ ...styles.container, ...styles.container1 }}>
                        <h3>Profil information</h3>
                        <br />
                        <div>
                            <div style={styles.flex}>
                                <div>
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Nom complet</p>
                                        <p style={{ ...styles.paragraph }}>{user.adressFullname}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Adresse</p>
                                        <p style={{ ...styles.paragraph }}>{user.adress}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Code postal</p>
                                        <p style={{ ...styles.paragraph }}>{user.adressZip}</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Nom de la société</p>
                                        <p style={{ ...styles.paragraph }}>{user.adressSocieteName}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Ville</p>
                                        <p style={{ ...styles.paragraph }}>{user.adressCity}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Pays</p>
                                        <p style={{ ...styles.paragraph }}>{user.adressCountry}</p>
                                    </div>
                                </div>
                            </div>


                            <br />
                        </div>
                    </div>
                    <div style={{ ...styles.container, ...styles.container2 }}>
                        <h3>Creator profil</h3>
                        <br />
                        <div>
                            <div>
                                <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Créateur nom</p>
                                <p style={{ ...styles.paragraph }}>{user.displayname}</p>
                            </div>
                            <br />
                            <div>
                                <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Description</p>
                                <p style={{ ...styles.paragraph }}>{user.bio}</p>
                            </div>
                            <br />
                            <div>
                                <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Instagram</p>
                                <p style={{ ...styles.paragraph }}>{user.instagram}</p>
                            </div>
                            <br />
                            <div>
                                <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Linkedin</p>
                                <p style={{ ...styles.paragraph }}>{user.linkedin}</p>
                            </div>
                            <br />
                            <div>
                                <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Dribble</p>
                                <p style={{ ...styles.paragraph }}>{user.dribble}</p>
                            </div>
                            <br />
                            <div>
                                <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Behance</p>
                                <p style={{ ...styles.paragraph }}>{user.behance}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ ...styles.container, ...styles.container3 }}>
                        <h3>Creator settings</h3>
                        <br />
                        <div>
                            <div style={styles.flex}>
                                <div>
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Paiement prénom</p>
                                        <p style={{ ...styles.paragraph }}>{user.payoutFirstname}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Paiement organisation</p>
                                        <p style={{ ...styles.paragraph }}>{user.payoutOrganisation}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Adresse de facturation</p>
                                        <p style={{ ...styles.paragraph }}>{user.invoiceAddress}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Code postal</p>
                                        <p style={{ ...styles.paragraph }}>{user.invoiceZip}</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Paiement nom</p>
                                        <p style={{ ...styles.paragraph }}>{user.payoutLastname}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Paypal Email</p>
                                        <p style={{ ...styles.paragraph }}>{user.paypalEmail}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>City</p>
                                        <p style={{ ...styles.paragraph }}>{user.invoiceCity}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Pays</p>
                                        <p style={{ ...styles.paragraph }}>{user.invoiceCountry}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </LayoutAdmin>
        </>

    );
};

const styles = {
    headerDetailsContainer: {
        marginBottom: '30px',
    },
    textSecondary: {
        color: "rgba(0, 0, 0, 0.6)"
    },
    paragraph: {
        fontSize: '12px',
    },
    threeContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    container: {
        width: '30%',
        borderRadius: '10px',
        padding: '15px'
    },
    container1: {
        backgroundColor: 'rgba(240, 240, 240, 0.38)'
    },
    container2: {
        backgroundColor: '#FEF4F1'
    },
    container3: {
        backgroundColor: '#FCD1C5'
    },
    flex: {
        display: 'flex',
        gap: '50px'
    }
}

export default AminProfilDetails;
