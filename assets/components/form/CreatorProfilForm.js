import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';



export const CreatorProfilForm = () => {

    /* DATA */
    const [file, setFile] = useState('');
    const [displayname, setDisplayname] = useState('');
    const [bio, setBio] = useState('');
    const [instagram, setInstagram] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [dribble, setDribble] = useState('');
    const [behance, setBehance] = useState('');
    const [isSaving, setIsSaving] = useState(false)


    /** TRAITEMENTS */
    useEffect(() => {
        // Récupération des données utilisateur à partir de l'API
        axios.get(`/api/account/creator/profile`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                let user = response.data
                setDisplayname(user.displayname);
                setBio(user.bio);
                setInstagram(user.instagram);
                setDribble(user.dribble);
                setLinkedin(user.linkedin);
                setBehance(user.behance);
            })
            .catch(error => {
                console.log(error);
                localStorage.clear();
                window.location.pathname = "/";
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        let formData = new FormData()

        formData.append("file", file)
        formData.append("displayname", displayname)
        formData.append("bio", bio)
        formData.append("instagram", instagram)
        formData.append("linkedin", linkedin)
        formData.append("dribble", dribble)
        formData.append("behance", behance)

        axios.post('/api/account/creator/update', formData, {
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
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'erreur',
                    showConfirmButton: false,
                    timer: 2500
                })
                setIsSaving(false)
            });
    };

    /** VUE */
    return (
        <form>
            <label>
                Profil picture :
                <input type="file" accept="application/png" onChange={e => (setFile(e.target.files[0]))} />
            </label>
            <br />
            <label>
                Display name :
                <input type="text" value={displayname} onChange={e => (setDisplayname(e.target.value))} />
            </label>
            <br />
            <label>
                Bio :
                <input type="textarea" value={bio} onChange={e => (setBio(e.target.value))} />
            </label>
            <br />
            <br />
            <label>
                Instagram :
                <input type="text" value={instagram} onChange={e => (setInstagram(e.target.value))} />
            </label>
            <br />
            <label>
                Linkedin :
                <input type="text" value={linkedin} onChange={e => (setLinkedin(e.target.value))} />
            </label>
            <br />
            <label>
                Dribble :
                <input type="text" value={dribble} onChange={e => (setDribble(e.target.value))} />
            </label>
            <br />
            <label>
                Behance :
                <input type="text" value={behance} onChange={e => (setBehance(e.target.value))} />
            </label>
            <button type="submit" disabled={isSaving} onClick={handleSubmit}>Register</button>
        </form>
    )
}
