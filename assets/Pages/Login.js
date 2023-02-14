import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [token, setToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            <form onSubmit={handleSubmit}>
                <label>
                    email:
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </Layout>
    );
}

export default Login;