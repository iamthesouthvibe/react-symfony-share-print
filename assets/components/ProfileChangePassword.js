import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const ProfileChangePassword = () => {

    /* DATA */
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false)

    /* TRAITEMENTS */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        let formData = new FormData()
        formData.append("password", password)

        if (password !== confirmPassword) {
            alert('password not match')
            setPassword('')
            setConfirmPassword('')
            return;
        }

        Swal.fire({
            icon: 'https://www.boasnotas.com/img/loading2.gif',
            title: "",
            text: "Loading...",
            closeOnClickOutside: false,
            showConfirmButton: false,
            timer: 2500
        })

        axios.post('/api/account/change_password', formData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setPassword('')
                setConfirmPassword('')
            })
            .catch((error) => {
                if (error.response.status === 404) {
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
                setPassword('')
                setConfirmPassword('')
            });
    };

    /* VUE */
    return (
        <div>
            <h1>Titre 1</h1>
            <form>
                <label>
                    Password:
                <input type="password" value={password} onChange={e => (setPassword(e.target.value))} />
                </label>
                <br />
                <label>
                    Confirm password:
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </label>
                <br />
                <button type="submit" onClick={handleSubmit} >Change password</button>
            </form>
        </div>

    )
}
