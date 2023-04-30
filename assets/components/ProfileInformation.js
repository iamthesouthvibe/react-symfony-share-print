import React, { useState, useEffect, useContext } from 'react';
import Layout from "../components/Layout"
import axios from 'axios';
import Swal from 'sweetalert2';


function ProfileInformation() {

    // Errors
    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [cityError, setCityError] = useState('');
    const [zipError, setZipError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [countryError, setCountryError] = useState('')

    const resetErrors = () => {
        setFirstnameError(null);
        setLastnameError(null);
        setAddressError(null);
        setCityError(null);
        setZipError(null);
        setEmailError(null);
        setCountryError(null);
    };

    const validateEmail = (email) => {
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    };

    const validateCustomerData = () => {
        const errors = {};
        const regex = /^[a-zA-ZÀ-ÿ ]+$/;
        const regexZip = /^\d+$/;

        if (firstname && (typeof firstname !== 'string' || !firstname.trim() || !regex.test(firstname))) {
            errors.firstname = 'Le prénom doit être une chaîne de caractères';
            setFirstnameError(errors.firstname);
        }
        if (lastname && (typeof lastname !== 'string' || !lastname.trim() || !regex.test(lastname))) {
            errors.lastname = 'Le nom doit être une chaîne de caractères';
            setLastnameError(errors.lastname);
        }
        if (address && (typeof address !== 'string' || !address.trim())) {
            errors.address = 'L\'adresse doit être une chaîne de caractères';
            setAddressError(errors.address);
        }
        if (country && (typeof country !== 'string' || !country.trim())) {
            errors.country = 'Le pays doit être une chaîne de caractères';
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
        if (email && (typeof email !== 'string' || !email.trim() || !validateEmail(email))) {
            errors.email = 'L\'adresse e-mail n\'est pas valide';
            setEmailError(errors.email);
        }

        return Object.keys(errors).length ? errors : null;
    };

    const [submitCount, setSubmitCount] = useState(0);


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
        resetErrors();
        const errors = validateCustomerData();
        if (errors) {
            // Si des erreurs sont présentes, les afficher sous les inputs correspondants
            return;
        }
        setIsSaving(true);
        let formData = new FormData()
        formData.append("email", email)
        formData.append("firstname", firstname)
        formData.append("lastname", lastname)
        formData.append("address", address)
        formData.append("country", country)
        formData.append("city", city)
        formData.append("zip", zip)

        Swal.showLoading();
        axios.post('/api/account/update', formData, {
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
            })
            .finally(() => {
                // Réinitialiser les erreurs
                resetErrors()
                setSubmitCount(submitCount + 1);
                if (submitCount === 2) {
                    document.querySelector('.submit-button').setAttribute('disabled', true);
                    document.querySelector('.submit-button').classList.add('disabled');
                    document.querySelector('.submit-button').style.backgroundColor = "#D9D9D9";
                    setTimeout(() => {
                        document.querySelector('.submit-button').removeAttribute('disabled');
                        document.querySelector('.submit-button').classList.remove('disabled');
                        document.querySelector('.submit-button').style.backgroundColor = "#000";
                        setSubmitCount(0);
                    }, 60000);
                }
            });
    };

    /** VUE */
    return <>
        <div className="page-account-container">
            <h2>Informations utilisateur</h2>
            <form>
                <div className="form-group">
                    <label>FirstName: </label>
                    <input type="text" value={firstname} onChange={e => (setFirstName(e.target.value))} placeholder="Firstname" />
                    {firstnameError && <span className="error">{firstnameError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>LastName:</label>
                    <input type="text" value={lastname} onChange={e => (setLastName(e.target.value))} placeholder="Lastname" />
                    {lastnameError && <span className="error">{lastnameError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Email: </label>
                    <input type="email" value={email} onChange={e => (setEmail(e.target.value))} placeholder="Email" />
                    {emailError && <span className="error">{emailError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Address:</label>
                    <input type="text" value={address} onChange={e => (setAddress(e.target.value))} placeholder="Address" />
                    {addressError && <span className="error">{addressError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label> Country:</label>
                    <input type="text" value={country} onChange={e => (setCountry(e.target.value))} placeholder="Country" />
                    {countryError && <span className="error">{countryError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>City:</label>
                    <input type="email" value={city} onChange={e => (setCity(e.target.value))} placeholder="City" />
                    {cityError && <span className="error">{cityError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Zip:</label>
                    <input type="text" value={zip} onChange={e => (setZip(e.target.value))} placeholder="Zipcode" />
                    {zipError && <span className="error">{zipError}</span>}
                </div>
                <br />
                <button type="submit" className="submit-button" onClick={handleSubmit}>Register</button>
            </form>
        </div>
    </>
}

export default ProfileInformation;