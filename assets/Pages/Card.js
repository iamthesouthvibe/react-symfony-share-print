import React, { useState, useEffect, useContext } from 'react'
import Layout from "../components/Layout"
import Swal from 'sweetalert2';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';

const Card = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const { updateCartItemsCount } = useContext(CartContext);


    useEffect(() => {
        const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(itemsFromLocalStorage);
        updateCartItemsCount(itemsFromLocalStorage.length);
    }, []);


    useEffect(() => {
        calculateTotalPrice();
    }, [cartItems]);

    const calculateTotalPrice = () => {
        const totalPrice = cartItems.reduce((acc, item) => acc + item.total, 0);
        const formattedPrice = totalPrice.toFixed(2);
        setTotalPrice(formattedPrice);;
    };

    const incrementQuantity = (id) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + 1);
                return {
                    ...item,
                    quantity: newQuantity,
                    total: newQuantity * item.price,
                };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const decrementQuantity = (id) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity - 1);
                return {
                    ...item,
                    quantity: newQuantity,
                    total: newQuantity * item.price,
                };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };


    const removeFromCart = (id) => {
        const updatedCartItems = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

        updateCartItemsCount(updatedCartItems.length);
    };

    const [checkoutSessionId, setCheckoutSessionId] = useState(null);


    /**   API Rest Countries  */
    const [countries, setCountries] = useState([]);
    useEffect(() => {
        fetch('https://restcountries.com/v3.1/region/europe')
            .then(response => response.json())
            .then(data => {
                const countryList = data.map(country => ({
                    name: country.name.common,
                    code: country.cca2,
                }));
                setCountries(countryList);
            })
            .catch(error => console.error(error));
    }, []);


    /* Formulaire et checkout */
    // Data
    const [firstname, setFirstname] = useState()
    const [lastname, setLastname] = useState()
    const [country, setCountry] = useState()
    const [address, setAddress] = useState()
    const [zip, setZip] = useState()
    const [city, setCity] = useState()
    const [mobile, setMobile] = useState()
    const [email, setEmail] = useState()
    const [isSaving, setIsSaving] = useState(false)

    // Errors
    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [cityError, setCityError] = useState('');
    const [zipError, setZipError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [countryError, setCountryError] = useState('');

    const resetErrors = () => {
        setFirstnameError(null);
        setLastnameError(null);
        setAddressError(null);
        setCityError(null);
        setZipError(null);
        setMobileError(null)
        setEmailError(null)
        setCountryError(null)
    };

    const validateEmail = (email) => {
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    };

    const validateCustomerData = () => {
        const errors = {};
        const regex = /^[a-zA-ZÀ-ÿ ]+$/;
        const regexZip = /^\d+$/;
        const regexMobile = /^\d+$/;

        if (typeof firstname !== 'string' || !firstname.trim() || !regex.test(firstname)) {
            errors.firstname = 'Le prénom doit être une chaîne de caractères';
            setFirstnameError(errors.firstname);
        }
        if (typeof lastname !== 'string' || !lastname.trim() || !regex.test(lastname)) {
            errors.lastname = 'Le nom doit être une chaîne de caractères';
            setLastnameError(errors.lastname);
        }
        if (typeof address !== 'string' || !address.trim()) {
            errors.address = 'L\'adresse doit être une chaîne de caractères';
            setAddressError(errors.address);
        }
        if (typeof city !== 'string' || !city.trim() || !regex.test(city)) {
            errors.city = 'La ville doit être une chaîne de caractères';
            setCityError(errors.city);
        }

        if (typeof country !== 'string' || !country.trim() || !regex.test(country)) {
            errors.country = 'La ville doit être une chaîne de caractères';
            setCountryError(errors.country);
        }

        if (typeof zip !== 'string' || !zip.trim() || !regexZip.test(zip)) {
            errors.zip = 'Le code postal doit être composé uniquement de chiffres';
            setZipError(errors.zip);
        }

        if (typeof mobile !== 'string' || !mobile.trim() || !regexMobile.test(mobile)) {
            errors.mobile = 'Le numéro de téléphone doit être composé uniquement de chiffres';
            setMobileError(errors.mobile);
        }

        if (typeof email !== 'string' || !email.trim() || !validateEmail(email)) {
            errors.email = 'L\'adresse e-mail n\'est pas valide';
            setEmailError(errors.email);
        }

        return Object.keys(errors).length ? errors : null;
    };

    const [submitCount, setSubmitCount] = useState(0);

    // Traitement
    const handleSubmit = (e) => {

        e.preventDefault();
        resetErrors();
        const errors = validateCustomerData();
        if (errors) {
            // Si des erreurs sont présentes, les afficher sous les inputs correspondants
            return;
        }
        const customerData = [firstname, lastname, country, address, zip, city, mobile, email];
        calculateTotalPrice();

        axios.post('/api/card/checkout', { cartItems, customerData, totalPrice })
            .then(response => {
                const { checkout_session_id } = response.data;
                setCheckoutSessionId(checkout_session_id);
                window.location.href = '/checkout/' + checkout_session_id;

            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error,
                    showConfirmButton: false,
                    timer: 2500
                })
            })
            .finally(() => {
                // Réinitialiser les erreurs
                resetErrors()
                setSubmitCount(submitCount + 1);
                if (submitCount === 2) {
                    document.querySelector('.submit-button').setAttribute('disabled', true);
                    document.querySelector('.submit-button').classList.add('disabled');
                    setTimeout(() => {
                        document.querySelector('.submit-button').removeAttribute('disabled');
                        document.querySelector('.submit-button').classList.remove('disabled');
                        setSubmitCount(0);
                    }, 60000);
                }
            });
    };

    return (
        <div>
            <Layout>
                <div className="page-card">
                    <div className="page-card-checkout-container">
                        <h1>Checkout</h1>
                        <form>
                            <div className="page-card-form">
                                <div className="page-card-form-left">
                                    <div className="form-group">
                                        <label>Firstname</label>
                                        <input value={firstname} onChange={e => (setFirstname(e.target.value))} type="text" placeholder="Firstname"></input>
                                        {firstnameError && <span className="error">{firstnameError}</span>}
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label>Lastname</label>
                                        <input value={lastname} onChange={e => (setLastname(e.target.value))} type="text" placeholder="Lastname"></input>
                                        {lastnameError && <span className="error">{lastnameError}</span>}
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input value={mobile} onChange={e => (setMobile(e.target.value))} type="text" placeholder="Phone number"></input>
                                        {mobileError && <span className="error">{mobileError}</span>}
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input value={email} onChange={e => (setEmail(e.target.value))} type="email" placeholder="Email"></input>
                                        {emailError && <span className="error">{emailError}</span>}
                                    </div>
                                    <br />
                                </div>
                                <div className="page-card-form-right">
                                    <div className="form-group">
                                        <label>country</label>
                                        <select value={country} onChange={e => setCountry(e.target.value)} placeholder="Country">
                                            <option>
                                                Choose a country
                                        </option>
                                            {countries.map(country => (
                                                <option key={country.code} value={country.name}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        {countryError && <span className="error">{countryError}</span>}
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label>Address </label>
                                        <input value={address} onChange={e => (setAddress(e.target.value))} type="text" placeholder="Address"></input>
                                        {addressError && <span className="error">{addressError}</span>}
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label>City</label>
                                        <input value={city} onChange={e => (setCity(e.target.value))} type="text" placeholder="City"></input>
                                        {cityError && <span className="error">{cityError}</span>}
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label>Zip</label>
                                        <input value={zip} onChange={e => (setZip(e.target.value))} type="text" placeholder="ZipCode"></input>
                                        {zipError && <span className="error">{zipError}</span>}
                                    </div>
                                    <br />
                                </div>
                            </div>
                        </form>
                        <div className="page-card-info">
                            <p>No payment is irquired at this stage.</p>
                            <p>After you’ve placed the orderm we will send you on payment page.</p>
                        </div>
                        <button onClick={handleSubmit} className="submit-button">Checkout</button>
                    </div>
                    <div className="page-card-card-container">
                        {cartItems.map(item => (
                            <div key={item.id}>
                                <div className="page-card-card-container-flex">
                                    <div className="page-card-card-container-img-cont">
                                        <img src={'/images/campagnes/' + item.userId + '/' + item.fileSource} alt={item.name} />
                                    </div>
                                    <div className="page-card-card-container-contents">
                                        <div>
                                            <p className="text-large">{item.name}</p>
                                            <p>{item.price}€</p>
                                        </div>
                                        <div className="page-card-card-container-contents-bottom">
                                            <div>
                                                <button onClick={() => decrementQuantity(item.id)}>-</button>
                                                <p>{item.quantity}</p>
                                                <button onClick={() => incrementQuantity(item.id)}>+</button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="remove-button">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <p className="totalprice">Prix total : {totalPrice}€</p>

                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default Card
