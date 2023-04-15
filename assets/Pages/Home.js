import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Layout from "../components/Layout"
import { LastCampagnes } from '../components/home/LastCampagnes';
import BestCampagnes from '../components/home/BestCampagnes';
import CreatorsList from '../components/home/CreatorsList';
import LookbooksLists from '../components/home/LookbooksLists';


function Home() {

    return <Layout>
        <LastCampagnes />
        <BestCampagnes />
        <CreatorsList />
        <LookbooksLists />
    </Layout>
}



export default Home;