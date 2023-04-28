import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext'

function Login() {

    const { updateCartItemsCount } = useContext(CartContext);

    useEffect(() => {
        const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartItemsCount(itemsFromLocalStorage.length);
    }, []);


    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const resetErrors = () => {
        setEmailError(null)
        setPasswordError(null)
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

        if (!password) {
            errors.password = 'L\'adresse e-mail ne peut pas être vide';
            setPasswordError(errors.password);
        }

        return Object.keys(errors).length ? errors : null;
    }


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [token, setToken] = useState('');

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
        formData.append("password", password);

        axios.post('/api/login', formData)
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Vous etes connecté',
                    showConfirmButton: false,
                    timer: 1500
                })
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                setIsSaving(false);
                setEmail('');
                setPassword('');

                setTimeout(function () {
                    window.location.pathname = "/"
                }, 1700);
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error,
                    showConfirmButton: false,
                    timer: 2500
                })
                setIsSaving(false)
            })
    };

    return (
        <Layout>
            <div className="page-account">
                <h1 className="subtitle-home text-large">Sign in</h1>
                <form onSubmit={handleSubmit} className="form-sign">
                    <div className="form-group">
                        <label>email :</label>
                        <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                        {emailError && <span className="error">{emailError}</span>}
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Password :</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                        {passwordError && <span className="error">{passwordError}</span>}
                    </div>
                    <br />
                    <button type="submit" className="submit-button">Login</button>
                </form>
                <div className="container-forget-and-signup">
                    <Link to="/change_password">Forget password ? <span className="text-large">Click here</span></Link>
                    <p>Don’t have an account? <Link to="/register" className="text-large">Sign up</Link></p>
                </div>

            </div>
        </Layout>
    );
}

export default Login;