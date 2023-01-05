import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { Fragment } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useAuth from '../../hooks/useAuth';
const FriendList = (props) => {
    const [users, setUsers] = useState()
    const {auth} = useAuth();
    return (
        <Fragment>
            <div className="user-name">
                <AccountCircleIcon fontSize="inherit" />
                Welcome {auth.username} 
            </div>
            <div id="user-list">
                <div className="user">
                    <PersonIcon fontSize="inherit" />Andrew
                </div>
                <div className="user">
                    <PersonIcon fontSize="inherit" />Mark
                </div>
            </div>
        </Fragment>
    );
}
export default FriendList