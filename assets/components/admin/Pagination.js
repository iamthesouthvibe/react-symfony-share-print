import React, { useState, useEffect, useContext } from 'react';

const Pagination = ({ usersPerPage, totalUsers, currentPage, handlePageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul>
                {pageNumbers.map(number => (
                    <li key={number}>
                        <a onClick={() => handlePageChange(number)}>{number}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination