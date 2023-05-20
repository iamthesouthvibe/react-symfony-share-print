import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const ProfileChangePassword = () => {

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
                "Password must contain at least one number and be more than 8 characters long";
            setPasswordError(errors.password);
        }

        if (password !== confirmPassword) {
            errors.confirmPassword =
                "Password is not identical";
            setErrorMessageConfirmPassword(errors.confirmPassword)
        }

        return Object.keys(errors).length ? errors : null;
    }

    /* DATA */
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false)
    const [submitCount, setSubmitCount] = useState(0);

    /* TRAITEMENTS */
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
        formData.append("password", password)

        Swal.showLoading();
        axios.post('/api/account/change_password', formData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then((response) => {
                if (response) {
                    Swal.update({
                        icon: 'success',
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 2000
                    })
                    setIsSaving(false);
                    setPassword('')
                    setConfirmPassword('')
                    setTimeout(() => {
                        Swal.close();
                    }, 1500);
                }
            })
            .catch((error) => {
                if (error.response.status == 401) {
                    Swal.close();
                    localStorage.removeItem('token');
                    navigate('/login')
                } else if (error.response.status == 401) {
                    Swal.close();
                    navigate('/404')
                } else {
                    Swal.update({
                        icon: 'error',
                        title: "An error occurred",
                        showConfirmButton: false,
                        timer: 2500
                    })
                    setTimeout(() => {
                        Swal.close();
                    }, 1500);
                }
                setIsSaving(false)
                setPassword('')
                setConfirmPassword('')
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

    /* VUE */
    return (
        <div className="page-account-container">
            <h2>Change password</h2>
            <form>
                <div className="form-group">
                    <label> Password:  </label>
                    <input type="password" value={password} onChange={e => (setPassword(e.target.value))} placeholder="New password" />
                    {passwordError && <span className="error">{passwordError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Confirm password:</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
                    {messageConfirmPasswordError && <span className="error">{messageConfirmPasswordError}</span>}
                </div>
                <br />
                <button type="submit" disabled={isSaving} className="submit-button" onClick={handleSubmit} >Change password</button>
            </form>
        </div>
    )
}
