import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';

export const ResetPassword = () => {

    const [passwordError, setPasswordError] = useState('');
    const [messageConfirmPasswordError, setErrorMessageConfirmPassword] = useState('');

    const resetErrors = () => {
        setPasswordError(null)
        setErrorMessageConfirmPassword(null)
    };

    const validateCustomerData = () => {
        const errors = {};
        if (!password) {
            errors.password = 'Password cannot be empty';
            setPasswordError(errors.password);
        } else if (!/(?=.*\d)(?=.*[a-zA-Z]).{8,}/.test(password)) {
            errors.password =
                "The password must contain at least one number and be longer than 8 characters";
            setPasswordError(errors.password);
        }

        if (password !== confirmPassword) {
            errors.confirmPassword =
                "The password is not the same";
            setErrorMessageConfirmPassword(errors.confirmPassword)
        }

        return Object.keys(errors).length ? errors : null;
    }

    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
        formData.append("password", password);

        axios.post(`/api/resetpassword/${token}`, formData)
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setPassword('');

                setTimeout(function () {
                    window.location.pathname = "/"
                }, 1700);
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: error.data.message,
                    showConfirmButton: false,
                    timer: 2500
                })
                setIsSaving(false)
            })
    };

    return (
        <Layout>
            <div className="page-account">
                <h1 className="subtitle-home text-large">Reset your password</h1>
                <form onSubmit={handleSubmit} className="form-sign">
                    <div className="form-group">
                        <label>New Password </label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" />
                        {passwordError && <span className="error">{passwordError}</span>}
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                        {messageConfirmPasswordError && <span className="error">{messageConfirmPasswordError}</span>}
                    </div>
                    <br />
                    <button type="submit" className="submit-button">submit</button>
                </form>
            </div>

        </Layout>
    )
}
