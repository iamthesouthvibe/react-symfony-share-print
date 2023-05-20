import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Layout from "../components/Layout";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function Register() {

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [messageConfirmPasswordError, setErrorMessageConfirmPassword] = useState('');

    const resetErrors = () => {
        setEmailError(null)
        setPasswordError(null)
        setErrorMessageConfirmPassword(null)
    };
    const validateEmail = (email) => {
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    };

    const validateCustomerData = () => {
        const errors = {};
        if (!email) {
            errors.email = 'Email address cannot be empty';
            setEmailError(errors.email);
        } else if (typeof email !== 'string' || !email.trim() || !validateEmail(email)) {
            errors.email = 'The email address is invalid';
            setEmailError(errors.email);
        }

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
                "Le mot de passe n'est pas identique";
            setErrorMessageConfirmPassword(errors.confirmPassword)
        }

        return Object.keys(errors).length ? errors : null;
    }

    /** DATA */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate();

    /** TRAITEMENTS */

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
        formData.append("password", password)

        Swal.showLoading();
        axios.post('/api/register', formData)
            .then((response) => {
                Swal.update({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                setTimeout(() => {
                    Swal.close();
                }, 1500);
                setTimeout(() => {
                    navigate('/login')
                }, 1600);

            })
            .catch((error) => {
                if (error.response.status === 400) {
                    Swal.update({
                        icon: 'error',
                        title: error.response.data.error,
                        showConfirmButton: false,
                        timer: 2500
                    })
                    setTimeout(() => {
                        Swal.close();
                    }, 1500);
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
            });
    };

    /** VUE */
    return (
        <Layout>
            <div className="page-account">
                <h1 className="subtitle-home text-large">Sign up</h1>
                <form className="form-sign">
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" value={email} onChange={e => (setEmail(e.target.value))} placeholder="Email" />
                        {emailError && <span className="error">{emailError}</span>}
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" value={password} onChange={e => (setPassword(e.target.value))} placeholder="Password" />
                        {passwordError && <span className="error">{passwordError}</span>}
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                        {messageConfirmPasswordError && <span className="error">{messageConfirmPasswordError}</span>}
                    </div>
                    <br />
                    <button type="submit" disabled={isSaving} onClick={handleSubmit} className="submit-button">Register</button>
                </form>
                <div className="container-forget-and-signup">
                    <p>Have an account? <Link to="/login" className="text-large">Sign in</Link></p>
                </div>
            </div>
        </Layout>
    );
}

export default Register;