import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// components
import Navigation from "./components/Navigation";
import Search from './components/Search';
import Home from './componets/Home';

// ABIs
import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'

// Config
import config from './config.json'

function Apo() {

    return (
        <div>
            <div className = 'cards__section'>
                <h3> Welcome to Raso RealEstate </h3>
            </div>
        </div>
    );
}