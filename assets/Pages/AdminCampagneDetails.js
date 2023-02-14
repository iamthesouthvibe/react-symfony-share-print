import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
        axios.get(`/api/campagne/detail/${id}`, {
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
                    <img src={imageUrl} alt={campagne.nameproject} />
                    <p>{campagne.id}</p>
                    <p>{campagne.userid}</p>
                    <p>{campagne.name}</p>
                    <p>{campagne.filename}</p>
                    <p>{campagne.nameproject}</p>
                    <p>{campagne.ncommande}</p>
                    <p>{campagne.price}</p>
                    <p>{campagne.fileSource}</p>
                    <p>{campagne.status}</p>
                    <p>{campagne.paper}</p>
                    <p>{campagne.size}</p>
                    <p>{campagne.weight}</p>
                    <p>{campagne.payoutfirstname}</p>
                    <p>{campagne.payoutlastname}</p>
                    <p>{campagne.paypalemail}</p>
                    <p>{campagne.createdAt}</p>
                    <p>{campagne.days}</p>
                </>
            </LayoutAdmin>

        </>
    )
}

export default AdminCampagneDetails
