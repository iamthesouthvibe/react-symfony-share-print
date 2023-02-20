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
        setTotalPrice(totalPrice);
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

    const handleSubmit = () => {
        console.log('ok')
        calculateTotalPrice();
        axios.post('/api/card/checkout', cartItems)
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
            </Layout>
        </div>
    );
};

export default Card
