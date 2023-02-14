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
        axios.get(`/api/user/detail/${id}`, {
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
                <h1>{user.firstname} {user.lastname}</h1>
                <h2>{user.email} </h2>
                {user.roles.map(role => (
                    <span>{role} </span>
                ))}
                <p>{user.adressFullname}</p>
                <p>{user.adressSocieteName}</p>
                <p>{user.adressCountry}</p>
                <p>{user.adress}</p>
                <p>{user.adressCity}</p>
                <p>{user.adressZip}</p>
                <p>{user.displayname}</p>
                <p>{user.bio}</p>
                <p>{user.instagram}</p>
                <p>{user.linkedin}</p>
                <p>{user.dribble}</p>
                <p>{user.behance}</p>
                <p>{user.payoutFirstname}</p>
                <p>{user.payoutLastname}</p>
                <p>{user.payoutOrganisation}</p>
                <p>{user.invoiceAddress}</p>
                <p>{user.invoiceCity}</p>
                <p>{user.invoiceCountry}</p>
                <p>{user.invoiceZip}</p>
                <p>{user.paypalEmail}</p>
            </LayoutAdmin>

        </>

    );
};

export default AminProfilDetails;
