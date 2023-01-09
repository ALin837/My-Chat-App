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
import useAPI from '../hooks/useApi'
//chat messaging
import { io } from "socket.io-client";

//const socket = io();

function ChatPage(props) {
    //const [isConnected, setIsConnected] = useState(socket.connected);
    //const [lastPong, setLastPong] = useState(null);

    // use the chat id. If the id is in the auth's conversations then default to that
    // else try to create a new chat
    const [currentChat, setCurrentChat] = useState({}); 
    const [chatInput, setChatInput] = useState("")

    const [ShowFriends, setShowFriends] = useState(true);
    const navigate = useNavigate();
    const axiosInstance = useAPI();
    const {auth,setAuth} = useAuth();

    // chatObject has an ID or a username/name
    const onHandleReceiver = (chatObject) => {
        console.log(chatObject)
        setCurrentChat(chatObject);
    }

    const Sidebar = () => {
        if (ShowFriends) {
            return (
                <FriendList onHandleReceiver = {onHandleReceiver}/>
            );
        } else {
            return (
                <SearchBar onHandleReceiver = {onHandleReceiver}/>
            );
        }
    }

    const handleLogOut = async () => {
        // set the authenticated user to empty
        setAuth({})
        await axiosInstance.get('/api/logout');
        return navigate("/", { replace: true }); // <-- issue imperative redirect
    }

    const handleAddConvo = async () => {
        try {
            const response = await axiosInstance.post(`/api/conversation/`, {
                name: currentChat.name, 
                members: currentChat.users
            })
            console.log(response)
            return response.data.chatId;
        } catch(err) {
            console.log(err)
            return null
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!chatInput || !currentChat.name) {
            return 
        }
        console.log(e)
        const message = chatInput;
        const date = new Date();
        const local = date.toLocaleTimeString('en-US')
        try {
            // check if its a userid or a chat id. Chat id requires 
            // 1. we have the current chat so it should be fine.
            // we create the conversation and get the id back.
            let chatId = 0;
            if (!ShowFriends) {
                // create conversation 
                console.log("REach")
                chatId = await handleAddConvo()
                console.log(chatId)
            } else {
                chatId = currentChat.chatId
            }
            // 2. post the message to the db
            console.log(currentChat.users)
            console.log(chatId)
            const response = await axiosInstance.post('/api/messages/', {
                sender: auth.userId,
                members: currentChat.users,
                time: local,
                message: message,
                chatId: chatId
            })

        } catch(err) {
            // this should handle the submission and if you submit while the
            // refresh token has expired then you logout
            return navigate("/", { replace: true }); // <-- issue imperative redirect
        }
    }

    return(
        <div>
            <div className="root">
                <div className="chat-portion">
                    <div className="navigation-bar">
                        <IconButton size="large">
                            <PersonIcon fontSize="inherit" onClick={()=> {
                                setCurrentChat({}) // set it to empty for when you show friends// removes the current chat object if you clicked during search
                                setShowFriends(true)}
                                }/>
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
                                <h2>
                                    {currentChat.name}
                                </h2>
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
                                <form id="chat-form" onSubmit={(e)=> {handleSendMessage(e)}}>
                                    <input type="text" id="message-form" name="message-form" placeholder="Aa"
                                        autoComplete="off" onChange = {(e) => {
                                            setChatInput(e.target.value)
                                        }}></input>
                                    <input type="submit" id="Submit-message" value="Send"></input>
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