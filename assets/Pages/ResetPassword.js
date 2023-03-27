import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export const ResetPassword = () => {

    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    New Password:
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <br />
                <button type="submit">submit</button>
            </form>
        </div>
    )
}
