import React, { useState } from 'react';
import axios from 'axios';
import Layout from "../components/Layout";
import Swal from 'sweetalert2';
import { redirect, useNavigate } from "react-router-dom";
import validator from 'validator'

function Register() {

    /** DATA */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [errorMessageConfirmPassword, setErrorMessageConfirmPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const navigate = useNavigate();

    /** TRAITEMENTS */
    // Check if password is validate
    const validate = (value) => {
        if (validator.isStrongPassword(value, {
            minLength: 8, minNumbers: 1, minSymbols: 1
        })) {
            setErrorMessage('')
        } else {
            setErrorMessage('Your password must be 8 characters long and must contain at least one number and symbol')
        }
    }

    // Check if email is validate
    const validateEmail = (value) => {
        if (validator.isEmail(value)) {
            setEmailError('')
        } else {
            setEmailError('Enter valid Email!')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        let formData = new FormData()
        formData.append("email", email)
        formData.append("password", password)

        if (password !== confirmPassword) {
            setErrorMessageConfirmPassword('Passwords do not match')
            return;
        }

        axios.post('/api/register', formData)
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                navigate('/login')
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    Swal.fire({
                        icon: 'error',
                        title: error.response.data.error,
                        showConfirmButton: false,
                        timer: 2500
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: "An error occurred",
                        showConfirmButton: false,
                        timer: 2500
                    })
                }
                setIsSaving(false)
            });
    };

    /** VUE */
    return (
        <Layout>
            <form>
                <label>
                    Email:
                <input type="email" value={email} onChange={e => (setEmail(e.target.value), validateEmail(e.target.value))} />
                    {emailError === '' ? null :
                        <span style={{
                            fontWeight: 'bold',
                            color: 'red',
                        }}>{emailError}</span>}
                </label>
                <br />
                <label>
                    Password:
                <input type="password" value={password} onChange={e => (setPassword(e.target.value), validate(e.target.value))} />
                    {errorMessage === '' ? null :
                        <span style={{
                            fontWeight: 'bold',
                            color: 'red',
                        }}>{errorMessage}</span>}
                </label>
                <br />
                <label>
                    Confirm Password:
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    {errorMessageConfirmPassword === '' ? null :
                        <span style={{
                            fontWeight: 'bold',
                            color: 'red',
                        }}>{errorMessageConfirmPassword}</span>}
                </label>
                <br />
                <button type="submit" disabled={isSaving} onClick={handleSubmit}>Register</button>
            </form>
        </Layout>
    );
}

export default Register;