import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { Fragment } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
const FriendList = (props) => {
    const [users, setUsers] = useState()
    return (
        <Fragment>
            <div className="user-title">
                <PeopleIcon fontSize="inherit" />
                Chats
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