import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import arrowRright from '../../images/arrow-right.svg';
import iconUser from '../../images/icon-userprofile.svg';

const Sidebar = () => {
    const [open, setOpen] = useState(true);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.navbar__header}>
                <h5 style={styles.navbar__header_name}>Léo Labeaume</h5>
            </div>
            <div>
                <Link>Dashboard</Link>
            </div>
            <div style={styles.navbar__accordion}>
                <div style={styles.navbar__accordion_action} onClick={handleOpen}>
                    <img src={arrowRright} style={open ? styles.navbar__accordion_action_img1_open : styles.navbar__accordion_action_img1} />
                    <img src={iconUser} style={styles.navbar__accordion_action_img2} />
                    <span>CRM</span>
                </div>
                {open && (
                    <>
                        <div style={styles.navbar__list_item}>
                            <Link to="/admin/profil/overview" style={styles.navbar__list_item_link}>Users</Link>
                        </div>
                    </>
                )}
            </div>
            <div style={styles.navbar__accordion}>
                <div style={styles.navbar__accordion_action} onClick={handleOpen}>
                    <img src={arrowRright} style={open ? styles.navbar__accordion_action_img1_open : styles.navbar__accordion_action_img1} />
                    <img src={iconUser} style={styles.navbar__accordion_action_img2} />
                    <span>ECommerce</span>
                </div>
                {open && (
                    <>
                        <div style={styles.navbar__list_item}>
                            <Link to="/admin/campagne/overview" style={styles.navbar__list_item_link}>Campagnes</Link>

                            <Link to="/admin/ecommerce/order" style={styles.navbar__list_item_link}>Orders</Link>
                        </div>
                    </>
                )}
            </div>
            <div style={styles.navbar__accordion}>
                <div style={styles.navbar__accordion_action} onClick={handleOpen}>
                    <img src={arrowRright} style={open ? styles.navbar__accordion_action_img1_open : styles.navbar__accordion_action_img1} />
                    <img src={iconUser} style={styles.navbar__accordion_action_img2} />
                    <span>Marketing</span>
                </div>
                {open && (
                    <>
                        <div style={styles.navbar__list_item}>
                            <Link to="/admin/marketing/overview" style={styles.navbar__list_item_link}>Lookbook</Link>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        boxSizing: 'border- box',
        position: 'fixed',
        width: '170px',
        height: '100vh',
        left: '0px',
        top: '0px',
        background: '#ffffff',
        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '20px',
        overflow: 'hidden',
        zIndex: '10',
    },
    navbar__header: {
        display: 'flex',
        marginBottom: '20px',
        gap: '10px',
        alignItems: 'center',
    },
    navbar__accordion: {
        marginTop: '10px',
    },
    navbar__accordion_action: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
    },
    navbar__header_name: {
        margin: 0
    },
    navbar__list_item: {
        paddingLeft: '0px',
        display: 'flex',
        flexDirection: 'column'
    },
    navbar__list_item_link: {
        padding: '5px 10px',
        paddingLeft: '37px',
        fontSize: '14px',
        background: '#ffffff',
        borderRadius: '8px',
        borderLeft: 'solid 2px white',
        position: 'relative',
        marginTop: '5px',
        textDecoration: 'none',
        color: '#000'
    },
    navbar__accordion_action_img1: {
        marginRight: '8px',
        width: '8px'
    },
    navbar__accordion_action_img1_open: {
        marginRight: '8px',
        width: '8px',
        rotate: '90deg',
    },
    navbar__accordion_action_img2: {
        marginRight: '5px',
        width: '17px'
    }
};

export default Sidebar
