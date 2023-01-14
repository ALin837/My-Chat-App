import '../styles/chat-page.css'
import React, { useState, useEffect, useContext, useRef} from 'react';
import 'font-awesome/css/font-awesome.min.css';
import SearchBar from './smallcomponents/searchbar'
import FriendList from './smallcomponents/friendlist'
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import useAPI from '../hooks/useApi'
//chat messaging
import { io } from "socket.io-client";

function getChatName(username,members) {
    if (members.length == 2) {
        const result = members.filter(item => (item.username != username))
        return result[0].username
    }
}

function ChatPage(props) {
    const [socket, setSocket] = useState(null);
    // use the chat id. If the id is in the auth's conversations then default to that
    // else try to create a new chat
    const [currentChat, setCurrentChat] = useState({}); 
    const [currentUser, setCurrentUser] = useState("")

    const [ShowFriends, setShowFriends] = useState(true);
    const navigate = useNavigate();
    const axiosInstance = useAPI();
    const {auth,setAuth} = useAuth();

    const [activeUserList, setActiveUserList] = useState([])
    const messageContainer = useRef(null)
    useEffect(()=> {
        setSocket(io('http://localhost:3000'))
    }, [])
    useEffect(()=> {
        if (socket) {
            const username = auth.username
            socket.emit('joinRoom', {username});
            socket.on('message', (response)=> {
                DisplayMessage(response.name, response.message)
            })
            socket.on('userlist', (response) => {
                setActiveUserList(response)
            })
        }
        
    }, [socket])

    // userdisplay your own message and send message
    const userDisplayMessage = (message, name) => {
        const d = new Date();
        const event = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        //Emit message
        const senderID = socket.id
        // get the id of the person you want to send to
        const result = activeUserList.filter((item) => item.username == currentUser)
        let receiverID = 0;
        if (result.length == 1) {
            receiverID = result[0].id
        }
        socket.emit('chat message', {senderID, receiverID, message})
        const userdiv = document.createElement("div")
        userdiv.classList.add('user-message');
        userdiv.innerHTML = `<div class="user-messenger">
            ${name}&nbsp;<span>${event}</span>
            </div>
                <div class="user-messenge-box">
                <p class="user-message-content">
                    ${message}
                </p>
            </div>`
        messageContainer.current.appendChild(userdiv);
        messageContainer.current.scrollTop = messageContainer.current.scrollHeight
        messageContainer.current.scrollTop = messageContainer.current.scrollHeight
    }

    const DisplayMessage = (name, message) => {
        const current = document.getElementById("current-user").innerHTML;
        if (name != current) {return;}
        const d = new Date();
        const event = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const div = document.createElement("div")
        div.classList.add('message');
        div.innerHTML = `<div class="messenger">
            ${name} &nbsp;<span>${event}</span>
            </div>
            <div class="messenge-box">
                <p class="message-content">
                    ${message}
                </p>
            </div>`
        messageContainer.current.appendChild(div);
        messageContainer.current.scrollTop = messageContainer.current.scrollHeight
    }

    // chatObject has an ID or a username/name
    const onHandleReceiver = (chatObject) => {
        const tempName = currentUser
        // gets the chat name between a private conversation
        const name = getChatName(auth.username, chatObject.users)
        // if the name of the user you're talking to doesn't match the current user
        if (name != tempName) {
            messageContainer.current.innerHTML=''
        }
        setCurrentUser(name)
        // store name as empty if its private
        chatObject.name=""
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
            return response.data.chatId;
        } catch(err) {
            console.log(err)
            return null
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        const message = document.getElementById('message-form').value;
        if (message=="" || currentUser == "") {
            return 
        }
        //const message = chatInput;
        const date = new Date();
        const local = date.toLocaleTimeString('en-US')
        try {
            // check if its a userid or a chat id. Chat id requires 
            // 1. we have the current chat so it should be fine.
            // we create the conversation and get the id back.
            let chatId = await handleAddConvo()

            // 2. post the message to the db
            const response = await axiosInstance.post('/api/messages/', {
                sender: auth.userId,
                members: currentChat.users,
                time: local,
                message: message,
                chatId: chatId
            })

            // 3. websocket send/update
            // When 'you' the user sends a message
            userDisplayMessage(message, auth.username)
            document.getElementById('message-form').value = "";
        } catch(err) {
            // this should handle the submission and if you submit while the
            // refresh token has expired then you logout
            console.log(err)
            //return navigate("/", { replace: true }); // <-- issue imperative redirect
        }
    }

    return(
        <div>
            <div className="root">
                <div className="chat-portion">
                    <div className="navigation-bar">
                        <div className = "navigation-bar-button-wrap">
                            <IconButton className = "fontButton" size="large" onClick={()=> {setShowFriends(true)}}>
                                <PersonIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton className = "fontButton" size="large" onClick={()=>{setShowFriends(false)}}>
                                <ManageSearchIcon fontSize="inherit"  />
                            </IconButton>
                            <IconButton className = "fontButton" size="large"  onClick={()=>{handleLogOut()}}>
                                <LogoutIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                    </div>
                    <div className="side-bar">
                        <Sidebar/>
                        
                    </div>
                    <div className="Chat-Display">
                        <div className="chat-container">
                            <div id="Content-Name">
                                {/*Chat Name*/}
                                <h2 id="current-user">
                                    {currentUser}
                                </h2>
                            </div>
                            <div id="message-container" ref = {messageContainer}>
                                {/*handle your messages here*/}
                            </div>
                        </div>
                        <div className="input-area">
                            <div className="input-form">
                                <form id="chat-form" onSubmit={(e)=> {handleSendMessage(e)}}>
                                    <input type="text" id="message-form" name="message-form" placeholder="Aa"
                                        autoComplete="off"></input>
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