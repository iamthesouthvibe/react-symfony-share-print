import React, { useState, useEffect, useContext } from 'react';
import Layout from "../components/Layout"
import axios from 'axios';
import Swal from 'sweetalert2';


function ProfileInformation() {

    /** DATA */
    const [email, setEmail] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    /** TRAITEMENTS */
    useEffect(() => {
        // Récupération des données utilisateur à partir de l'API
        axios.get(`/api/user`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                let user = response.data
                setFirstName(user.firstname);
                setLastName(user.lastname);
                setEmail(user.email);
                setAddress(user.address);
                setCity(user.city);
                setCountry(user.country);
                setZip(user.zip);
            })
            .catch(error => {
                if (error.response.status == 404) {
                    localStorage.clear();
                    window.location.pathname = "/";
                }
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        console.log(firstname, email, lastname)
        let formData = new FormData()
        formData.append("email", email)
        formData.append("firstname", firstname)
        formData.append("lastname", lastname)
        formData.append("address", address)
        formData.append("country", country)
        formData.append("city", city)
        formData.append("zip", zip)

        axios.post('/api/account/update', formData, {
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
    };

    /** VUE */
    return <>
        <div className="page-account-container">
            <h2>Informations utilisateur</h2>
            <form>
                <div className="form-group">
                    <label>FirstName: </label>
                    <input type="text" value={firstname} onChange={e => (setFirstName(e.target.value))} />
                </div>
                <br />
                <div className="form-group">
                    <label>LastName:</label>
                    <input type="text" value={lastname} onChange={e => (setLastName(e.target.value))} />
                </div>
                <br />
                <div className="form-group">
                    <label>Email: </label>
                    <input type="email" value={email} onChange={e => (setEmail(e.target.value))} />
                </div>
                <br />
                <div className="form-group">
                    <label>Address:</label>
                    <input type="text" value={address} onChange={e => (setAddress(e.target.value))} />
                </div>
                <br />
                <div className="form-group">
                    <label> Country:</label>
                    <input type="text" value={country} onChange={e => (setCountry(e.target.value))} />
                </div>
                <br />
                <div className="form-group">
                    <label>City:</label>
                    <input type="email" value={city} onChange={e => (setCity(e.target.value))} />
                </div>
                <br />
                <div className="form-group">
                    <label>Zip:</label>
                    <input type="text" value={zip} onChange={e => (setZip(e.target.value))} />
                </div>
                <br />
                <button type="submit" className="submit-button" disabled={isSaving} onClick={handleSubmit}>Register</button>
            </form>
        </div>
    </>
}

export default ProfileInformation;