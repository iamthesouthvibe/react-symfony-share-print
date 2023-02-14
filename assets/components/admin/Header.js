import React from 'react'
import { Link, useLoaderData } from 'react-router-dom'

const Header = ({ items }) => {
    return (
        <nav style={styles.header}>
            <ul className="breadcrumb" style={styles.breadcrumb}>
                {items.map((item, index) => (
                    <li key={index} className="breadcrumb-item">
                        <Link to={item.link} style={styles.breadcrumb_item_link}>{item.label} /</Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

const styles = {
    header: {
        boxSizing: 'border- box',
        position: 'fixed',
        left: '170px',
        height: '72px',
        top: '0px',
        background: '#ffffff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '0px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        zIndex: '10',
    },
    breadcrumb: {
        display: 'flex',
        gap: '11px',
        alignItems: 'center',
        listStyleType: 'none'
    },
    breadcrumb_item_link: {
        color: '#999999',
        textDecoration: 'none',
        fontSize: '14px'
    }
}

export default Header
