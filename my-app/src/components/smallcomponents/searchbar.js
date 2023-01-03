import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { Fragment } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
const searchBar = (props) => {

    return (
        <Fragment>
            <div className="input-search-bar">
                <input type="text" id="search" name="search" placeholder='Search for People'></input>
            </div>
            <div className="user">
                <PersonIcon fontSize="inherit" />Mark
            </div>
            <div className="user">
                <PersonIcon fontSize="inherit" />Mark
            </div>
            <div className="user">
                <PersonIcon fontSize="inherit" />Mark
            </div>
            <div className="user">
                <PersonIcon fontSize="inherit" />Mark
            </div>
            <div className="user">
                <PersonIcon fontSize="inherit" />Mark
            </div>
            <div className="user">
                <PersonIcon fontSize="inherit" />Mark
            </div>
        </Fragment>
    );


}
export default searchBar