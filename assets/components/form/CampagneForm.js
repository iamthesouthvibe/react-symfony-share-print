import React, { useState, useContext, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import axios from 'axios';
import Swal from 'sweetalert2';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import { Document, Page } from 'react-pdf';
import { CartContext } from '../../contexts/CartContext';
import Layout from "../Layout"
import { useNavigate } from 'react-router-dom';

export const CampagneForm = () => {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const { updateCartItemsCount } = useContext(CartContext);


    useEffect(() => {
        const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(itemsFromLocalStorage);
        updateCartItemsCount(itemsFromLocalStorage.length);
    }, []);


    const [multiplier, setMultiplier] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (price) {
            const totalPriceSend = parseFloat(price) * parseInt(multiplier);
            setTotal(totalPriceSend * 0.60);
        }
    }, [price, multiplier]);

    const resetErrors = () => {
        setPriceError(null);
        setProjectNamerror(null);
        setDescriptionError(null);
        setFileError(null);
        setSizeError(null)
        setPaperError(null)
    };

    const [priceError, setPriceError] = useState('')
    const [projectNameError, setProjectNamerror] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const [fileError, setFileError] = useState('')
    const [sizeError, setSizeError] = useState('')
    const [paperError, setPaperError] = useState('')

    const validateCustomerData = () => {
        const errors = {};
        const regex = /^[a-zA-Z ]+$/;
        const regexPrice = /^\d+$/;
        const acceptedFileTypes = ['application/pdf'];
        const fileExtension = file.type;

        if (typeof projectName !== 'string' || !projectName.trim() || !regex.test(projectName)) {
            errors.projectName = 'Le prénom doit être une chaîne de caractères et ne peux pas etre vide';
            setProjectNamerror(errors.projectName);
        }

        if (typeof description !== 'string' || !description.trim() || !regex.test(description)) {
            errors.description = 'Le prénom doit être une chaîne de caractères et ne peux pas etre vide';
            setDescriptionError(errors.description);
        }

        if (typeof price !== 'string' || !price.trim() || !regexPrice.test(price)) {
            errors.price = 'Le code postal doit être composé uniquement de chiffres';
            setPriceError(errors.price);
        } else if (price < 35) {
            errors.price = 'Le prix ne peux pas etre inférieur à 35';
            setPriceError(errors.price);
        }

        if (size !== 'A4' && size !== 'A3' && size !== 'A2') {
            errors.size = 'Veuillez choisir une taille';
            setSizeError(errors.size);
        }

        if (paper !== 'Couché' && paper !== 'Non couché') {
            errors.paper = 'Veuillez choisir un type de papier';
            setPaperError(errors.paper);
        }

        if (!file) {
            errors.file = 'Le champ file ne peut pas etre vide';
            setFileError(errors.file);
        } else if (!acceptedFileTypes.includes(fileExtension)) {
            errors.file = 'Le fichier sélectionné n\'est pas un PDF. Veuillez sélectionner un fichier PDF.';
            setFileError(errors.file);
        }

        return Object.keys(errors).length ? errors : null;
    };

    const [file, setFile] = useState('');
    const [projectName, setProjectName] = useState('');
    const [size, setSize] = useState('Choose your size');
    const [paper, setPaper] = useState('Choose your paper');
    const [weight, setWeight] = useState('Choose your weight');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false)
    const [tax, setTax] = useState(0.20);


    const handleSubmit = (e) => {

        e.preventDefault();
        resetErrors();
        const errors = validateCustomerData();
        if (errors) {
            // Si des erreurs sont présentes, les afficher sous les inputs correspondants
            return;
        }

        const totalTax = parseFloat(price) * parseFloat(tax)
        const totalPrice = parseFloat(price) + (parseFloat(price) * parseFloat(tax));

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

        Swal.showLoading();
        axios.post('/api/campagne/add', formData, {
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
                setTimeout(() => {
                    navigate('/creator_campagnes')
                }, 1550);
                setIsSaving(false);
                setFile('')
                setProjectName('')
                setPrice('')
                setDescription('')
            })
            .catch((error) => {
                if (error.response.status == 401 || error.response.status == 404) {
                    Swal.update({
                        icon: 'warning',
                        title: 'Vous devez etre connecté pour soumettre une création',
                        html:
                            'Vous devez etre connecté pour soumettre une création, ' +
                            '<a href="http://127.0.0.1:8000/login">Se connecter</a>',
                        showConfirmButton: false,
                        timer: 5500
                    })
                    setTimeout(() => {
                        Swal.close();
                    }, 1500);
                } else if (error.response.status == 500) {
                    Swal.update({
                        icon: 'error',
                        title: 'Erreur, veuillez réessayer',
                        showConfirmButton: false,
                        timer: 2500
                    })
                    setTimeout(() => {
                        Swal.close();
                    }, 1500);
                    setFile('')
                    setProjectName('')
                    setPrice('')
                    setDescription('')
                }
                setIsSaving(false)
            });
    };

    return (
        <>
            <div>
                <div className="page-card">
                    <div className="page-card-checkout-container">
                        <h1>Design your own</h1>
                        <form>
                            <div className="page-card-form">
                                <div className="page-card-form-left">
                                    <div className="form-group">
                                        <label>Name of your project :</label>
                                        <input type="text" value={projectName} onChange={e => (setProjectName(e.target.value))} placeholder="Name of your project" />
                                        {projectNameError && <span className="error">{projectNameError}</span>}
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label>Upload your file :</label>
                                        <input type="file" accept="application/pdf" onChange={e => (setFile(e.target.files[0]))} />
                                        {fileError && <span className="error">{fileError}</span>}
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label>Size :</label>
                                        <select name="size" value={size} onChange={e => (setSize(e.target.value))}>
                                            <option value="Choose your size" disabled hidden>Choose your size</option>
                                            <option value="A4" >A4</option>
                                            <option value="A3">A3</option>
                                            <option value="A2" >A2</option>
                                        </select>
                                        {sizeError && <span className="error">{sizeError}</span>}
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label>Paper :</label>
                                        <select name="paper" value={paper} onChange={e => (setPaper(e.target.value))}>
                                            <option value="Choose your paper" disabled hidden>Choose your paper</option>
                                            <option value="Couché">Couché</option>
                                            <option value="Non couché">Non couché</option>
                                        </select>
                                        {paperError && <span className="error">{paperError}</span>}
                                    </div>
                                    <br />
                                </div>
                                <div className="page-card-form-right">
                                    <div className="form-group">
                                        <label>Weight :</label>
                                        <select name="weight" value={weight} onChange={e => (setWeight(e.target.value, console.log(e.target.value)))}>
                                            <option value="Choose your weight" class="grey" disabled hidden >Choose your weight</option>
                                            <option value="130" >130GR</option>
                                            <option value="160" >160GR</option>
                                        </select>
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label> Price :</label>
                                        <input type="text" min="0" value={price} onChange={e => (setPrice(e.target.value))} placeholder="Price" />
                                        {priceError && <span className="error">{priceError}</span>}
                                    </div>
                                    <br />
                                    <div className="form-group-textarea">
                                        <textarea type="text" value={description} onChange={e => (setDescription(e.target.value))} placeholder="Description" />
                                        {descriptionError && <span className="error">{descriptionError}</span>}
                                    </div>

                                </div>
                            </div>
                        </form>
                        <div className="page-card-info">
                            <p>Your poster will be in store only if we believe that the information entered is correct.</p>
                            <p>The price displayed in the store will be different because there will be taxes on it</p>
                        </div>
                        <button type="submit" className="submit-button" disabled={isSaving} onClick={handleSubmit}>Register</button>
                    </div>
                    <div className="page-card-card-container">
                        <div className="pdf-container">
                            {file && (
                                <Document file={file}>
                                    <Page pageNumber={1} size="A5" />
                                </Document>
                            )}
                        </div>
                        <div className="block-profit">
                            <div className="block-profit-first">
                                <label htmlFor="multiplier">How many garments do you estimate your design will sell?</label>
                                <input
                                    type="number"
                                    id="multiplier"
                                    value={multiplier}
                                    min="0"
                                    onChange={(e) => setMultiplier(e.target.value)}
                                />
                            </div>
                            <div className="block-profit-last">
                                <p>Estimed profit</p>
                                <p>With {multiplier} sales and 1 print, you'll earn a minimum:</p>
                                <span>{total.toFixed(2)}€</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
