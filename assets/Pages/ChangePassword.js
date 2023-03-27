import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

export const ChangePassword = () => {
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            <form onSubmit={handleSubmit}>
                <label>
                    email:
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <button type="submit">submit</button>
            </form>
        </Layout>
    )
}
