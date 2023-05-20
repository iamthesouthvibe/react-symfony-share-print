import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import LayoutAdmin from '../components/admin/LayoutAdmin';

const AdminCampagneDetails = () => {
    const { id } = useParams();
    const [campagne, setCampagne] = useState(null);

    const breadcrumbItems = [
        { label: "Campagnes", link: "/admin/campagne/overview" },
        { label: "Détails", link: "" },
    ];

    useEffect(() => {
        axios.get(`/api/admin/campagne/detail/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setCampagne(response.data);
            })
            .catch(error => {
                console.log(error);
                // localStorage.clear();
                // window.location.pathname = "/";
            });
    }, []);

    console.log(campagne)

    if (!campagne) {
        return <div>Chargement en cours...</div>;
    }

    const imageUrl = `/images/campagnes/${campagne.userid}/${campagne.fileSource}`;
    return (
        <>
            <Header items={breadcrumbItems} />
            <Sidebar />
            <LayoutAdmin>
                <>
                    <div style={styles.headerCampagnedetail}>
                        <div>
                            <h1>#{campagne.id}</h1>
                            <h2 style={{ ...styles.textSecondary }}>{campagne.nameproject}</h2>
                        </div>
                        <div>
                            <p>{campagne.status}</p>
                        </div>
                    </div>
                    <br /><br />

                    <h3>Campagne</h3>
                    <div style={styles.threeContainerCampagne}>
                        <div style={styles.imgContainer}>
                            <img src={imageUrl} alt={campagne.nameproject} style={styles.img} />
                        </div>
                        <div style={styles.descriptionContainer}>
                            <div style={{ ...styles.flex }}>
                                <div>
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Campagne accepté le</p>
                                        <p style={{ ...styles.paragraph }}>{campagne.createdAt}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }} >Format</p>
                                        <p style={{ ...styles.paragraph }}>{campagne.size}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Grammage</p>
                                        <p style={{ ...styles.paragraph }}>{campagne.weight}GR</p>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Jours restant</p>
                                        <p style={{ ...styles.paragraph }}>{45 - campagne.days}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Papier</p>
                                        <p style={{ ...styles.paragraph }}>{campagne.paper}</p>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div>
                                <p style={{ ...styles.textSecondary, ...styles.paragraph }}>Description</p>
                                <p style={{ ...styles.paragraph }}>{campagne.description}</p>
                            </div>
                        </div>
                        <div style={styles.lastContainer}>
                            <div style={styles.lastContainer1}>
                                <p style={{ ...styles.textSecondary }}>Prix HT</p>
                                <p>{campagne.price}€</p>
                            </div>
                            <div style={styles.lastContainer2}>
                                <p style={{ ...styles.textSecondary }}>Prix taxe</p>
                                <p>{campagne.totalTax}€</p>
                            </div>
                            <div style={styles.lastContainer3}>
                                <p style={{ ...styles.textSecondary }}>Prix de l'impression</p>
                                <p>{campagne.pricePrint}€</p>
                            </div>
                            <div style={styles.lastContainer4}>
                                <p style={{ ...styles.textSecondary }}>Prix total</p>
                                <p>{campagne.priceAti}€</p>
                            </div>
                        </div>
                    </div>

                    <br /><br />
                    <h3>Ecommerce</h3>
                    <div style={styles.ecommerceContainer}>
                        <div style={styles.ecommerceContainer1}>
                            <p style={{ ...styles.textSecondary }}>Chiffres d'affaires</p>
                            <p>{campagne.ca}€</p>
                        </div>
                        <div style={styles.ecommerceContainer2}>
                            <p style={{ ...styles.textSecondary }}>Campagne vendu</p>
                            <p>{campagne.nbvente}</p>
                        </div>
                        <div style={styles.ecommerceContainer3}>
                            <p style={{ ...styles.textSecondary }}>Montant de la taxe</p>
                            <p>{campagne.totaltax}€</p>
                        </div>
                        <div style={styles.ecommerceContainer4}>
                            <p style={{ ...styles.textSecondary }}>Bénéfice créateur</p>
                            <p>{campagne.benefCreator}€</p>
                        </div>
                        <div style={styles.ecommerceContainer5}>
                            <p style={{ ...styles.textSecondary }}>Bénéfice Shareprint</p>
                            <p>{campagne.benefCompany}€</p>
                        </div>
                    </div>

                    <br /><br />
                    <h3>Information créateur</h3>
                    <div style={styles.informationCreator}>
                        <div>
                            <p style={{ ...styles.textSecondary }}>Paiement créateur nom</p>
                            <p>{campagne.payoutfirstname} {campagne.payoutlastname}</p>
                        </div>
                        <br />
                        <div>
                            <p style={{ ...styles.textSecondary }}>Paiement créateur email</p>
                            <p>{campagne.paypalemail}</p>
                        </div>
                        <br />
                        <Link to={`/admin/profil/details/${campagne.userid}`}>Voir le profil</Link>
                    </div>

                </>
            </LayoutAdmin>

        </>
    )
}

const styles = {
    headerCampagnedetail: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    textSecondary: {
        color: "rgba(0, 0, 0, 0.6)"
    },
    threeContainerCampagne: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '15px',
        marginTop: '10px'
    },
    paragraph: {
        fontSize: '12px',
    },
    imgContainer: {
        width: '25%',
        backgroundColor: 'rgba(240, 240, 240, 0.38)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        objectFit: 'cover',
        borderRadius: '10px'
    },
    img: {
        maxWidth: '90%',
        maxHeight: '90%',
    },
    descriptionContainer: {
        width: '40%',
        borderRadius: '10px',
        backgroundColor: 'rgba(242, 78, 30, 0.06)',
        padding: '10px'
    },
    lastContainer: {
        width: '35%',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    lastContainer1: {
        borderRadius: '10px',
        backgroundColor: 'rgba(242, 78, 30, 0.06)',
        padding: '10px'
    },
    lastContainer2: {
        borderRadius: '10px',
        backgroundColor: 'rgba(240, 240, 240, 0.38)',
        padding: '10px'
    },
    lastContainer3: {
        borderRadius: '10px',
        backgroundColor: 'rgba(242, 78, 30, 0.06)',
        padding: '10px'
    },
    lastContainer4: {
        borderRadius: '10px',
        backgroundColor: 'rgba(240, 240, 240, 0.38)',
        padding: '10px'
    },
    flex: {
        display: 'flex',
        gap: '70px'
    },
    ecommerceContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '15px'
    },
    ecommerceContainer1: {
        backgroundColor: '#F9F9F9',
        borderRadius: '10px',
        padding: '10px',
        width: '20%'
    },
    ecommerceContainer2: {
        backgroundColor: 'rgba(242, 78, 30, 0.06)',
        borderRadius: '10px',
        padding: '10px',
        width: '20%'
    },
    ecommerceContainer3: {
        backgroundColor: '#FCD1C5',
        borderRadius: '10px',
        padding: '10px',
        width: '20%'
    },
    ecommerceContainer4: {
        backgroundColor: '#F9F9F9',
        borderRadius: '10px',
        padding: '10px',
        width: '20%'
    },
    ecommerceContainer5: {
        backgroundColor: 'rgba(242, 78, 30, 0.06)',
        borderRadius: '10px',
        padding: '10px',
        width: '20%'
    },
    informationCreator: {
        backgroundColor: '#F9F9F9',
        borderRadius: '10px',
        padding: '10px',
        width: '50%'
    }

}

export default AdminCampagneDetails
