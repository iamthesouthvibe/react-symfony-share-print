import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

export const ChangePassword = () => {

    const [emailError, setEmailError] = useState('');

    const resetErrors = () => {
        setEmailError(null)
    };

    const validateEmail = (email) => {
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    };

    const validateCustomerData = () => {
        const errors = {};
        if (!email) {
            errors.email = 'L\'adresse e-mail ne peut pas être vide';
            setEmailError(errors.email);
        } else if (typeof email !== 'string' || !email.trim() || !validateEmail(email)) {
            errors.email = 'L\'adresse e-mail n\'est pas valide';
            setEmailError(errors.email);
        }

        return Object.keys(errors).length ? errors : null;
    }

    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetErrors();
        const errors = validateCustomerData();
        if (errors) {
            // Si des erreurs sont présentes, les afficher sous les inputs correspondants
            return;
        }
        setIsSaving(true);
        let formData = new FormData();
        formData.append("email", email);

        axios.post('/api/requestpassword', formData)
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setEmail('');

                setTimeout(function () {
                    window.location.pathname = "/"
                }, 1700);
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.message,
                    showConfirmButton: false,
                    timer: 2500
                })
                setIsSaving(false)
            })
    };

    return (
        <Layout>
            <div className="page-account">
                <h1 className="subtitle-home text-large">Forget password</h1>
                <form onSubmit={handleSubmit} className="form-sign">
                    <div className="form-group">
                        <label>email:</label>
                        <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                        {emailError && <span className="error">{emailError}</span>}
                    </div>
                    <br />
                    <button type="submit" className="submit-button">submit</button>
                </form>
            </div>
        </Layout>
    )
}
