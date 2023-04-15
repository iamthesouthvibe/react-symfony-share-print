import React, { useEffect, useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import useAuth from '../../contexts/AuthContext';
import HeaderMobile from './HeaderMobile';
import HeaderDesktop from './HeaderDesktop';



const useMediaQuery = (minWidth) => {
    const [isDesiredWidth, setIsDesiredWidth] = useState(
        () => window.matchMedia(`(max-width: ${minWidth}px)`).matches
    );

    useEffect(() => {
        const mediaQueryList = window.matchMedia(`(max-width: ${minWidth}px)`);
        const resizeHandler = (event) => {
            setIsDesiredWidth(event.matches);
        };
        mediaQueryList.addEventListener("change", resizeHandler);
        return () => {
            mediaQueryList.removeEventListener("change", resizeHandler);
        };
    }, [minWidth]);

    return isDesiredWidth;
};



export const Header = () => {
    const isMobile = useMediaQuery(800);

    return (
        <>
            {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
        </>

    )
}
