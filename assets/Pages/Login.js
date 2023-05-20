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
            errors.email = 'Email address cannot be empty';
            setEmailError(errors.email);
        } else if (typeof email !== 'string' || !email.trim() || !validateEmail(email)) {
            errors.email = 'The email address is invalid';
            setEmailError(errors.email);
        }

        if (!password) {
            errors.password = 'Password cannot be empty';
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

        Swal.showLoading();
        axios.post('/api/login', formData)
            .then((response) => {
                Swal.update({
                    icon: 'success',
                    title: 'Authentication successful',
                    showConfirmButton: false,
                    timer: 1500
                })
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                setIsSaving(false);
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    Swal.close();
                }, 1500);
                setTimeout(() => {
                    Swal.close();
                    window.location.pathname = "/"
                }, 1550);
            })
            .catch((error) => {
                Swal.update({
                    icon: 'error',
                    title: error.response.data.error,
                    showConfirmButton: false,
                    timer: 2500
                })
                setTimeout(() => {
                    Swal.close();
                }, 1500);
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
                    <button type="submit" disabled={isSaving} className="submit-button">Login</button>
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