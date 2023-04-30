import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const CreatorSettingsForm = () => {

    // Errors
    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [organisationError, setOrganisationError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [cityError, setCityError] = useState('');
    const [countryError, setCountryError] = useState('');
    const [zipError, setZipError] = useState('');
    const [paypalError, setPaypalError] = useState(null);

    const resetErrors = () => {
        setFirstnameError(null);
        setLastnameError(null);
        setOrganisationError(null)
        setAddressError(null);
        setCountryError(null);
        setCityError(null);
        setZipError(null);
        setPaypalError(null)
    };

    const validateEmail = (email) => {
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    };

    const validateCustomerData = () => {
        const errors = {};
        const regex = /^[a-zA-ZÀ-ÿ ]+$/;
        const regexZip = /^\d+$/;
        const regexMobile = /^\d+$/;

        if (firstname && (typeof firstname !== 'string' || !firstname.trim() || !regex.test(firstname))) {
            errors.firstname = 'Le prénom doit être une chaîne de caractères';
            setFirstnameError(errors.firstname);
        }
        if (lastname && (typeof lastname !== 'string' || !lastname.trim() || !regex.test(lastname))) {
            errors.lastname = 'Le nom doit être une chaîne de caractères';
            setLastnameError(errors.lastname);
        }

        if (organisation && (typeof organisation !== 'string' || !organisation.trim() || !regex.test(organisation))) {
            errors.organisation = 'Le nom doit être une chaîne de caractères';
            setOrganisationError(errors.organisation);
        }

        if (address && (typeof address !== 'string' || !address.trim() || !regex.test(country))) {
            errors.address = 'L\'adresse doit être une chaîne de caractères';
            setAddressError(errors.address);
        }
        if (country && (typeof country !== 'string' || !country.trim() || !regex.test(country))) {
            errors.country = 'L\'adresse doit être une chaîne de caractères';
            setCountryError(errors.country);
        }
        if (city && (typeof city !== 'string' || !city.trim() || !regex.test(city))) {
            errors.city = 'La ville doit être une chaîne de caractères';
            setCityError(errors.city);
        }

        if (zip && (typeof zip !== 'string' || !zip.trim() || !regexZip.test(zip))) {
            errors.zip = 'Le code postal doit être composé uniquement de chiffres';
            setZipError(errors.zip);
        }

        if (paypalEmail && (typeof paypalEmail !== 'string' || !paypalEmail.trim() || !validateEmail(paypalEmail))) {
            errors.paypalEmail = 'L\'adresse e-mail n\'est pas valide';
            setPaypalError(errors.paypalEmail);
        }

        return Object.keys(errors).length ? errors : null;
    };

    /** DATA */
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [organisation, setOrganisation] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [zip, setZip] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');
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
        formData.append("organisation", organisation)
        formData.append("address", address)
        formData.append("city", city)
        formData.append("country", country)
        formData.append("zip", zip)
        formData.append("paypalEmail", paypalEmail)

        Swal.showLoading();
        axios.post('/api/account/creator/settings/update', formData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then((response) => {
                Swal.update({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
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
                    timer: 2500
                })
                setIsSaving(false)
                setTimeout(() => {
                    Swal.close();
                }, 1500);
            });
    }

    return (
        <div className="page-account-container">
            <h2>Payout information</h2>
            <form>
                <div className="form-group">
                    <label>Firstname :</label>
                    <input type="text" value={firstname} onChange={e => (setFirstname(e.target.value))} placeholder="Firstname" />
                    {firstnameError && <span className="error">{firstnameError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Lastname :</label>
                    <input type="textarea" value={lastname} onChange={e => (setLastname(e.target.value))} placeholder="Lastname" />
                    {lastnameError && <span className="error">{lastnameError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Organisation :</label>
                    <input type="text" value={organisation} onChange={e => (setOrganisation(e.target.value))} placeholder="Organisation" />
                    {organisationError && <span className="error">{organisationError}</span>}
                </div>
                <br />
                <br />
                <h2>Invoice address</h2>
                <div className="form-group">
                    <label>Address :</label>
                    <input type="text" value={address} onChange={e => (setAddress(e.target.value))} placeholder="Address" />
                    {addressError && <span className="error">{addressError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>City :</label>
                    <input type="text" value={city} onChange={e => (setCity(e.target.value))} placeholder="City" />
                    {cityError && <span className="error">{cityError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Country :</label>
                    <input type="text" value={country} onChange={e => (setCountry(e.target.value))} placeholder="Country" />
                    {countryError && <span className="error">{countryError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Postecode/ZIP :</label>
                    <input type="text" value={zip} onChange={e => (setZip(e.target.value))} placeholder="Postecode/ZIP" />
                    {zipError && <span className="error">{zipError}</span>}
                </div>
                <br />
                <br />
                <h2>Payment information</h2>
                <div className="form-group">
                    <label>PayPal email :</label>
                    <input type="email" value={paypalEmail} onChange={e => (setPaypalEmail(e.target.value))} placeholder="PayPal email" />
                    {paypalError && <span className="error">{paypalError}</span>}
                </div>
                <br />
                <button type="submit" className="submit-button" disabled={isSaving} onClick={handleSubmit} >Register</button>
            </form>
        </div>
    )
}
