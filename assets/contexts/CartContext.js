import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItemsCount, setCartItemsCount] = useState(0);

    const updateCartItemsCount = (count) => {
        setCartItemsCount(count);
    };

    return (
        <CartContext.Provider value={{ cartItemsCount, updateCartItemsCount }}>
            {children}
        </CartContext.Provider>
    );
};