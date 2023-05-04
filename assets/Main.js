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
import Shop from './Pages/Shop';
import ShopProductDetails from './Pages/ShopProductDetails';
import Card from './Pages/Card';
import { SuccessPayment } from './Pages/SuccessPayment';
import { CreatorCampagnes } from './Pages/CreatorCampagnes';
import { Orders } from './Pages/Orders';
import { AdminOrders } from './Pages/AdminOrders';
import { AdminOrderDetails } from './Pages/AdminOrderDetails';
import { ChangePassword } from './Pages/ChangePassword';
import { ResetPassword } from './Pages/ResetPassword';
import { CreatorsList } from './Pages/CreatorsList';
import { CreatorDetail } from './Pages/CreatorDetail';
import { AdminLookBookOverview } from './Pages/AdminLookBookOverview';
import Lookbook from './Pages/Lookbook';
import { CartProvider } from './contexts/CartContext'
import Howitswork from './Pages/Howitswork';
import { Page404 } from './Pages/Page404';

function Main() {
    const { isAuthenticated, userRole } = useAuth();

    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/shop" element={<Shop />} />
                    <Route exact path="/shop/product/details/:slug" element={<ShopProductDetails />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/card" element={<Card />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/create_campagne" element={<CampagneCreate />} />
                    <Route exact path="/success_payment" element={<SuccessPayment />} />
                    <Route exact path="/change_password" element={<ChangePassword />} />
                    <Route exact path="/reset-password/:token" element={<ResetPassword />} />
                    <Route exact path="/creators" element={<CreatorsList />} />
                    <Route exact path="/creator/detail/:id" element={<CreatorDetail />} />
                    <Route exact path="/lookbook" element={<Lookbook />} />
                    <Route exact path="/how-its-work" element={<Howitswork />} />
                    <Route exact path="/404" element={<Page404 />} />
                    {isAuthenticated && userRole.includes('ROLE_USER') ? <Route exact path="/account" element={<Account />} /> : <Route exact path="/account" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_USER') ? <Route exact path="/orders" element={<Orders />} /> : <Route exact path="/account" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_CREATOR') ? <Route exact path="/creator_profil" element={<CreatorProfile />} /> : <Route exact path="/creator_profil" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_CREATOR') ? <Route exact path="/creator_settings" element={<CreatorSettings />} /> : <Route exact path="/creator_settings" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_CREATOR') ? <Route exact path="/creator_campagnes" element={<CreatorCampagnes />} /> : <Route exact path="/creator_campagnes" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/profil/overview" element={<AdminProfil />} /> : <Route exact path="/admin/profil/overview" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/profil/details/:id" element={<AminProfilDetails />} /> : <Route exact path="/admin/profil/overview" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/profil/delete/:id" element={<AminProfilDetails />} /> : <Route exact path="/admin/profil/overview" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/campagne/overview" element={<AdminCampagneOverview />} /> : <Route exact path="/admin/campagne/overview" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/campagne/details/:id" element={<AdminCampagneDetails />} /> : <Route exact path="/admin/campagne/overview" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/ecommerce/order" element={<AdminOrders />} /> : <Route exact path="/admin/ecommerce/order" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/order/details/:id" element={<AdminOrderDetails />} /> : <Route exact path="/admin/order/details/:id" element={<Navigate to="/login" />} />}
                    {isAuthenticated && userRole.includes('ROLE_ADMIN') ? <Route exact path="/admin/marketing/overview" element={<AdminLookBookOverview />} /> : <Route exact path="/admin/marketing/overview" element={<Navigate to="/login" />} />}
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default Main;

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
    <CartProvider>
        <Main />
    </CartProvider>
);