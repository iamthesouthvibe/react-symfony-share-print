import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');

    // Fonction pour vérifier l'authentification de l'utilisateur
    const checkAuth = () => {
        try {        // Décoder le JWT ici
            const token = localStorage.getItem('token');
            const decoded = jwt_decode(token);

            // Vérifier le contenu du JWT pour s'assurer que l'utilisateur est connecté
            if (decoded.exp * 1000 < Date.now()) {
                setIsAuthenticated(false);
            } else {
                setIsAuthenticated(true);
                setUserRole(decoded.roles);
            }
        }
        catch {
            console.log('error');
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return { isAuthenticated, checkAuth, userRole };
};

export default useAuth;