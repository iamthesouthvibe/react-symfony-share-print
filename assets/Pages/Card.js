import React, { useState, useEffect } from 'react'
import Layout from "../components/Layout"
import Swal from 'sweetalert2';
import axios from 'axios';

const Card = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(itemsFromLocalStorage);
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
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [zip, setZip] = useState('')
    const [city, setCity] = useState('')
    const [mobile, setMobile] = useState('')
    const [email, setEmail] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Traitement
    const handleSubmit = (e) => {
        e.preventDefault();
        const customerData = [firstname, lastname, country, address, zip, city, mobile, email];
        calculateTotalPrice();
        console.log(totalPrice);
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
            });
    };

    return (
        <div>
            <Layout>
                <p>card</p>
                <div>
                    <form>
                        <label>
                            First name
                        <input value={firstname} onChange={e => (setFirstname(e.target.value))} type="text"></input>
                        </label>
                        <br />
                        <label>
                            Last name
                        <input value={lastname} onChange={e => (setLastname(e.target.value))} type="text"></input>
                        </label>
                        <br />
                        <label>
                            country
                            <select value={country} onChange={e => setCountry(e.target.value)}>
                                {countries.map(country => (
                                    <option key={country.code} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <br />
                        <label>
                            Address
                        <input value={address} onChange={e => (setAddress(e.target.value))} type="text"></input>
                        </label>
                        <br />
                        <label>
                            City
                        <input value={city} onChange={e => (setCity(e.target.value))} type="text"></input>
                        </label>
                        <br />
                        <label>
                            Zip
                        <input value={zip} onChange={e => (setZip(e.target.value))} type="text"></input>
                        </label>
                        <br />
                        <label>
                            Phone
                        <input value={mobile} onChange={e => (setMobile(e.target.value))} type="text"></input>
                        </label>
                        <br />
                        <label>
                            Email
                        <input value={email} onChange={e => (setEmail(e.target.value))} type="email"></input>
                        </label>
                        <br />
                    </form>
                </div>
                <div>
                    {cartItems.map(item => (
                        <div key={item.id}>
                            <p>{item.name}</p>
                            <p>{item.price}€</p>
                            <button onClick={() => decrementQuantity(item.id)}>-</button>
                            <p>{item.quantity}</p>
                            <button onClick={() => incrementQuantity(item.id)}>+</button>
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                    ))}
                    <p>Prix total : {totalPrice}€</p>
                    <button onClick={handleSubmit}>Checkout</button>
                </div>
            </Layout>
        </div>
    );
};

export default Card
