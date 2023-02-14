import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home"
import Login from './Pages/Login';
import Register from './Pages/register';
import { createRoot } from 'react-dom/client';
import useAuth from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Account from './Pages/Account';
import { CreatorProfile } from './Pages/CreatorProfile';
import { CreatorSettings } from './Pages/CreatorSettings';
import { CampagneCreate } from './Pages/CampagneCreate';
import AdminProfil from './Pages/AdminProfil';
import AminProfilDetails from './Pages/AminProfilDetails';
import AdminCampagneOverview from './Pages/AdminCampagneOverview';
import AdminCampagneDetails from './Pages/AdminCampagneDetails';



function Main() {
    const { isAuthenticated, userRole } = useAuth();

    console.log(isAuthenticated, userRole)
    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/create_campagne" element={<CampagneCreate />} />
                    {isAuthenticated && userRole.includes('ROLE_USER') ? <Route exact path="/account" element={<Account />} /> : <Route exact path="/account" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_CREATOR') ? <Route exact path="/creator_profil" element={<CreatorProfile />} /> : <Route exact path="/creator_profil" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_CREATOR') ? <Route exact path="/creator_settings" element={<CreatorSettings />} /> : <Route exact path="/creator_settings" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/profil/overview" element={<AdminProfil />} /> : <Route exact path="/admin/profil/overview" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/profil/details/:id" element={<AminProfilDetails />} /> : <Route exact path="/admin/profil/overview" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/profil/delete/:id" element={<AminProfilDetails />} /> : <Route exact path="/admin/profil/overview" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/campagne/overview" element={<AdminCampagneOverview />} /> : <Route exact path="/admin/campagne/overview" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/campagne/details/:id" element={<AdminCampagneDetails />} /> : <Route exact path="/admin/campagne/overview" element={<Navigate to="/login" />} />}
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default Main;

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Main />);