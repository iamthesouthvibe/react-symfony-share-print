import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export const CreatorProfilForm = () => {

    const navigate = useNavigate();

    // Errors
    const [instagramError, setInstagramError] = useState('');
    const [dribbleError, setDribbleError] = useState('');
    const [behanceError, setBehanceError] = useState('');
    const [linkedinError, setLinkedinError] = useState('');
    const [fileError, setFileError] = useState('');

    const resetErrors = () => {
        setInstagramError(null);
        setDribbleError(null);
        setBehanceError(null);
        setLinkedinError(null);
    };

    const validateCustomerData = () => {
        const acceptedFileTypes = ['application/png', 'application/jpg', 'application/jpeg'];
        const fileExtension = file.type;
        const errors = {};

        if (instagram && !(typeof instagram === 'string' && instagram.includes('https://'))) {
            errors.instagram = 'Attention le champ instagram doit être un lien vers votre instagram';
            setInstagramError(errors.instagram);
        }

        if (behance && !(typeof behance === 'string' && behance.includes('https://'))) {
            errors.behance = 'Attention le champ behance doit être un lien vers votre behance';
            setBehanceError(errors.behance);
        }

        if (dribble && !(typeof dribble === 'string' && dribble.includes('https://'))) {
            errors.dribble = 'Attention le champ dribble doit être un lien vers votre dribble';
            setDribbleError(errors.dribble);
        }

        if (linkedin && !(typeof linkedin === 'string' && linkedin.includes('https://'))) {
            errors.linkedin = 'Attention le champ linkedin doit être un lien vers votre linkedin';
            setLinkedinError(errors.linkedin);
        }

        if (file && !acceptedFileTypes.includes(fileExtension)) {
            errors.file = 'Attention le fichier doit etre au format jpeg, jpg ou png';
            setFileError(errors.file);
        }

        return Object.keys(errors).length ? errors : null;
    };




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
                if (error.response.status == 401) {
                    Swal.close();
                    localStorage.removeItem('token');
                    navigate('/login')
                } else {
                    Swal.close();
                    navigate('/404')
                }
            });
    }, []);

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

        formData.append("file", file)
        formData.append("displayname", displayname)
        formData.append("bio", bio)
        formData.append("instagram", instagram)
        formData.append("linkedin", linkedin)
        formData.append("dribble", dribble)
        formData.append("behance", behance)

        Swal.showLoading();
        axios.post('/api/account/creator/update', formData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then((response) => {
                Swal.update({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => {
                    Swal.close();
                }, 1500);
                setIsSaving(false);
                resetErrors()
            })
            .catch((error) => {
                if (error.response.status == 401) {
                    Swal.close();
                    localStorage.removeItem('token');
                    navigate('/login')
                } else if (error.response.status == 404) {
                    Swal.close();
                    navigate('/404')
                } else {
                    Swal.update({
                        icon: 'error',
                        title: 'Form error',
                        showConfirmButton: false,
                        timer: 2500
                    })
                    setTimeout(() => {
                        Swal.close();
                    }, 1500);
                }

                resetErrors()
                setIsSaving(false)
            });
    };

    /** VUE */
    return (
        <div className="page-account-container">
            <h2>Profile</h2>
            <form>
                <div className="form-group">
                    <label>Profil picture :</label>
                    <input type="file" onChange={e => (setFile(e.target.files[0]))} placeholder="Profil picture" />
                    {fileError && <span className="error">{fileError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Display name :</label>
                    <input type="text" value={displayname} onChange={e => (setDisplayname(e.target.value))} placeholder="Display name" />
                </div>
                <br />
                <br />
                <div className="form-group">
                    <label>Bio :</label>
                    <textarea type="textarea" value={bio} onChange={e => (setBio(e.target.value))} placeholder="Bio" />
                </div>
                <br />
                <br />
                <h2>Social media</h2>
                <div className="form-group">
                    <label>Instagram :</label>
                    <input type="text" value={instagram} onChange={e => (setInstagram(e.target.value))} placeholder="Instagram link" />
                    {instagramError && <span className="error">{instagramError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Linkedin : </label>
                    <input type="text" value={linkedin} onChange={e => (setLinkedin(e.target.value))} placeholder="Linkedin link" />
                    {linkedinError && <span className="error">{linkedinError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Dribble :</label>
                    <input type="text" value={dribble} onChange={e => (setDribble(e.target.value))} placeholder="Dribble link" />
                    {dribbleError && <span className="error">{dribbleError}</span>}
                </div>
                <br />
                <div className="form-group">
                    <label>Behance :</label>
                    <input type="text" value={behance} onChange={e => (setBehance(e.target.value))} placeholder="Behance link" />
                    {behanceError && <span className="error">{behanceError}</span>}
                </div>
                <br />
                <button type="submit" className="submit-button" disabled={isSaving} onClick={handleSubmit}>Register</button>
            </form>
        </div>
    )
}
