import '../styles/chat-page.css'
import React, { useState, useEffect, useContext} from 'react';
import 'font-awesome/css/font-awesome.min.css';
import SearchBar from './smallcomponents/searchbar'
import FriendList from './smallcomponents/friendlist'
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

//chat messaging
import { io } from "socket.io-client";

//const socket = io();

function ChatPage(props) {
    //const [isConnected, setIsConnected] = useState(socket.connected);
    //const [lastPong, setLastPong] = useState(null);


    const [ShowFriends, setShowFriends] = useState(true);
    const navigate = useNavigate();

    const {setAuth} = useAuth();
    const Sidebar = () => {
        if (ShowFriends) {
            return (
                <FriendList/>
            );
        } else {
            return (
                <SearchBar/>
            );
        }
    }
    const handleLogOut = async () => {
        // set the authenticated user to empty
        setAuth({})
        await axios.get('/api/logout', { withCredentials: true });
        return navigate("/", { replace: true }); // <-- issue imperative redirect
    }

    const handleSendMessage = async ()=> {
        try {


        } catch(err) {
            // this should handle the submission and if you submit while the
            // refresh token has expired than you logout
            return navigate("/", { replace: true }); // <-- issue imperative redirect

        }

    }

    /*
    useEffect(() => {
        
    }, [])
    */


    return(
        <div>
            <div className="root">
                <div className="chat-portion">
                    <div className="navigation-bar">
                        <IconButton size="large">
                            <PersonIcon fontSize="inherit" onClick={()=> {setShowFriends(true)}}/>
                        </IconButton>
                        <IconButton  size="large">
                            <ManageSearchIcon fontSize="inherit"  onClick={()=>{setShowFriends(false)}}/>
                        </IconButton>
                        <IconButton  size="large">
                            <LogoutIcon fontSize="inherit"  onClick={()=>{handleLogOut()}}/>
                        </IconButton>
                    </div>
                    <div className="side-bar">
                        <Sidebar/>
                        
                    </div>
                    <div className="Chat-Display">
                        <div className="chat-container">
                            <div id="Content-Name">
                                {/*Chat Name*/}
                                <h2></h2>
                            </div>
                            <div id="message-container">
                                {/*
                                <div className="disconnect-message">
                                    <p className="disconnect-content">
                                        Brad has left &nbsp;<span>7:30pm</span>
                                    </p>
                                </div>
                                <div className="message">
                                    <div className="messenger">
                                        Alex &nbsp;<span>7:30pm</span>
                                    </div>
                                    <div className="messenge-box">
                                        <p className="message-content">
                                            hello World!
                                        </p>
                                    </div>
                                </div>
                                <div className="message">
                                    <div className="messenger">
                                        Mark &nbsp;<span>7:30pm</span>
                                    </div>
                                    <div className="messenge-box">
                                        <p className="message-content">
                                            that my friend is something a bit scary u might want to avoid for now lmao, because
                                            theres so many security things u have to put into place, its not exactly worth
                                            looking
                                            into, but ig if ur the only login, and logging in does nothing, then its fine,
                                            because
                                            if u have other logging in, they will complain if u have a breach.
                                            that my friend is something a bit scary u might want to avoid for now lmao, because
                                            theres so many security things u have to put into place, its not exactly worth
                                            looking
                                            into, but ig if ur the only login, and logging in does nothing, then its fine,
                                            because
                                            if u have other logging in, they will complain if u have a breach.
                                            that my friend is something a bit scary u might want to avoid for now lmao, because
                                            theres so many security things u have to put into place, its not exactly worth
                                            looking
                                            into, but ig if ur the only login, and logging in does nothing, then its fine,
                                            because
                                            if u have other logging in, they will complain if u have a breach
                                        </p>
                                    </div>
                                </div>
                                <div className="message">
                                    <div className="messenger">
                                        Brain &nbsp;<span>7:30pm</span>
                                    </div>
                                    <div className="messenge-box">
                                        <p className="message-content">
                                            You guys are all fucking stupid
                                        </p>
                                    </div>
                                </div>
                                <div className="user-message">
                                    <div className="user-messenger">
                                        Andrew&nbsp;<span>7:30pm</span>
                                    </div>
                                    <div className="user-messenge-box">
                                        <p className="user-message-content">
                                            stfu!!
                                        </p>
                                    </div>
                                </div>
                            */}

                            </div>
                        </div>
                        <div className="input-area">
                            <div className="input-form">
                                <form id="chat-form" onSubmit={()=> {return false;}}>
                                    <input type="text" id="message-form" name="message-form" placeholder="Aa"
                                        autoComplete="off"></input>
                                    <input type="button" id="Submit-message" value="Send"></input>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default ChatPage