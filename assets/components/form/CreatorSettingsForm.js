import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const CreatorSettingsForm = () => {

    /** DATA */
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [organisation, setOrganisation] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [zip, setZip] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    /** TRAITEMENTS */
    useEffect(() => {
        // Récupération des données utilisateur à partir de l'API
        axios.get(`/api/account/creator/profile`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                let user = response.data
                setFirstname(user.payoutFirstname);
                setLastname(user.payoutFirstname);
                setOrganisation(user.payoutOrganisation);
                setAddress(user.address);
                setCity(user.city);
                setCountry(user.country);
                setZip(user.zip);
                setPaypalEmail(user.paypalEmail);
            })
            .catch(error => {
                console.log(error);
                // localStorage.clear();
                // window.location.pathname = "/";
            });
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        let formData = new FormData()
        formData.append("firstname", firstname)
        formData.append("lastname", lastname)
        formData.append("organisation", organisation)
        formData.append("address", address)
        formData.append("city", city)
        formData.append("country", country)
        formData.append("zip", zip)
        formData.append("paypalEmail", paypalEmail)

        axios.post('/api/account/creator/settings/update', formData, {
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
            });
    }

    return (
        <form>
            <h4>Payout information</h4>
            <label>
                Firstname :
                <input type="text" value={firstname} onChange={e => (setFirstname(e.target.value))} />
            </label>
            <br />
            <label>
                Lastname :
                <input type="textarea" value={lastname} onChange={e => (setLastname(e.target.value))} />
            </label>
            <br />
            <label>
                Organisation :
                <input type="text" value={organisation} onChange={e => (setOrganisation(e.target.value))} />
            </label>
            <br />
            <br />
            <h4>Invoice address</h4>
            <label>
                Address :
                <input type="text" value={address} onChange={e => (setAddress(e.target.value))} />
            </label>
            <br />
            <label>
                City :
                <input type="text" value={city} onChange={e => (setCity(e.target.value))} />
            </label>
            <br />
            <label>
                Country :
                <input type="text" value={country} onChange={e => (setCountry(e.target.value))} />
            </label>
            <br />
            <label>
                Postecode/ZIP :
                <input type="text" value={zip} onChange={e => (setZip(e.target.value))} />
            </label>
            <br />
            <br />
            <h4>Payment information</h4>
            <label>
                PayPal email :
                <input type="email" value={paypalEmail} onChange={e => (setPaypalEmail(e.target.value))} />
            </label>
            <br />
            <label>
                PayPal email confirmation :
                <input type="email" value={confirmEmail} onChange={e => (setConfirmEmail(e.target.value))} />
            </label>
            <button type="submit" disabled={isSaving} onClick={handleSubmit} >Register</button>
        </form>
    )
}
