import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import axios from 'axios';
import Swal from 'sweetalert2';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import { Document, Page } from 'react-pdf';



export const CampagneForm = () => {

    const [file, setFile] = useState('');
    const [projectName, setProjectName] = useState('');
    const [size, setSize] = useState('A4');
    const [paper, setPaper] = useState('Couché');
    const [weight, setWeight] = useState('130');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false)
    const [tax, setTax] = useState(0.20);

    const handleSubmit = (e) => {

        const totalTax = parseFloat(price) * parseFloat(tax)
        const totalPrice = parseFloat(price) + (parseFloat(price) * parseFloat(tax));

        e.preventDefault();
        setIsSaving(true);
        let formData = new FormData()
        formData.append("file", file)
        formData.append("projectName", projectName)
        formData.append("size", size)
        formData.append("paper", paper)
        formData.append("weight", weight)
        formData.append("price", price)
        formData.append("description", description)
        formData.append("totalTax", totalTax)
        formData.append("totalPrice", totalPrice)

        axios.post('/api/campagne/add', formData, {
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
                setFile('')
                setProjectName('')
                setPrice('')
                setDescription('')
            })
            .catch((error) => {
                console.error(error.response.status);
                if (error.response.status == 401) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Vous devez etre connecté pour soumettre une création',
                        html:
                            'Vous devez etre connecté pour soumettre une création, ' +
                            '<a href="http://127.0.0.1:8000/login">Se connecter</a>',
                        showConfirmButton: false,
                        timer: 5500
                    })
                } else if (error.response.status == 500) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur, veuillez réessayer',
                        showConfirmButton: false,
                        timer: 2500
                    })

                    setFile('')
                    setProjectName('')
                    setPrice('')
                    setDescription('')
                } else if (error.response.status == 500) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur, veuillez réessayer',
                        showConfirmButton: false,
                        timer: 5500
                    })
                }
                setIsSaving(false)
            });
    };

    return (
        <form>
            <input type="file" accept="application/pdf" onChange={e => (setFile(e.target.files[0]))} />
            <br />
            <label>
                Name of your project :
                <input type="text" value={projectName} onChange={e => (setProjectName(e.target.value))} />
            </label>
            <br />
            <label>
                Size :
                <select name="size" value={size} onChange={e => (setSize(e.target.value))}>
                    <option value="A4" >A4</option>
                    <option value="A3">A3</option>
                    <option value="A2" >A2</option>
                </select>
            </label>
            <br />
            <label>
                Paper :
                <select name="paper" value={paper} onChange={e => (setPaper(e.target.value))}>
                    <option value="couché">Couché</option>
                    <option value="Non couché">Non couché</option>
                </select>
            </label>
            <br />
            <label>
                Weight :
                <select name="weight" value={weight} onChange={e => (setWeight(e.target.value, console.log(e.target.value)))}>
                    <option value="130" >130</option>
                    <option value="160" >160</option>
                </select>
            </label>
            <br />
            <label>
                Price :
                <input type="text" value={price} onChange={e => (setPrice(e.target.value))} />
            </label>
            <br />
            <label>
                Description :
                <input type="text" value={description} onChange={e => (setDescription(e.target.value))} />
            </label>
            {/* {file && (
                <Document file={file}></Document>
            )} */}
            <button type="submit" disabled={isSaving} onClick={handleSubmit}>Register</button>
        </form>
    );

}
