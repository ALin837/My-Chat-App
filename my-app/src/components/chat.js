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
import { useWebSocket } from '../context/socketProvider';
//chat messaging
import axios from 'axios';

const baseURLinstance = process.env.REACT_APP_API_URL || "http://localhost:9000";

function getChatName(username,members) {
    if (members.length == 2) {
        const result = members.filter(item => (item.username != username))
        return result[0].username
    }
}

function ChatPage(props) {
    const socket = useWebSocket()
    // use the chat id. If the id is in the auth's conversations then default to that
    // else try to create a new chat
    const [chatList, setChatList] = useState([])
    // currentChat is an object with chatId, name : "", users [{userid: ssd, username},{userid: ssd, username}]
    const [currentChat, setCurrentChat] = useState({}); 
    const [currentUser, setCurrentUser] = useState("")
    const [ShowFriends, setShowFriends] = useState(true);
    const navigate = useNavigate();
    //const axiosInstance = useAPI();
    const {auth,setAuth} = useAuth();
    axios.defaults.withCredentials = true;
    const [activeUserList, setActiveUserList] = useState([])
    const messageContainer = useRef(null)

    useEffect(()=> {
        if (socket) {
            const username = auth.username
            socket.emit('joinRoom', {username});
            socket.on('message', (response)=> {
                 // recieve message
                DisplayMessage(response.name, response.message)
            })
            socket.on('userlist', (response) => {
                setActiveUserList(response)
            })
        }
    }, [socket])

    const printDataOnScreen = (arrOfMessages) => 
    {
        messageContainer.current.innerHTML=''
        const userId = auth.userId;
        const username = auth.username;
        const current = document.getElementById("current-user").innerHTML;
        for (let i = 0; i < arrOfMessages.length; ++i) {
            if (userId == arrOfMessages[i]["sender"]) {
                userDisplayMessage(username, arrOfMessages[i], false);
            } else {
                DisplayMessage(current,arrOfMessages[i]);
            }
        }
    }

    useEffect(()=> {
        const getMessages = async ()=> {
            if (currentChat.chatId) {
                try {
                    const chatId = currentChat.chatId;
                    const response = await axios.get(baseURLinstance + `/api/messages/${chatId}`);
                    printDataOnScreen(response.data.chat)
                } catch (err) {
                    console.log(err)
                }
            }
        }
        getMessages();
    }, [currentChat.chatId])

    // userdisplay your own message and send message
    const userDisplayMessage = (name, messageObj, doEmit) => {
        const message = messageObj["message"]
        const time = messageObj["time"]
        if (doEmit) {
            //Emit message
            const senderID = socket.id
            // get the id of the person you want to send to
            const result = activeUserList.filter((item) => item.username == currentUser)
            let receiverID = 0;
            if (result.length == 1) {
                receiverID = result[0].id
            }
            socket.emit('chat message', {senderID, receiverID, message})
        }
        const userdiv = document.createElement("div")
        userdiv.classList.add('user-message');
        userdiv.innerHTML = `<div class="user-messenger">
            ${name}&nbsp;<span>${time}</span>
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
        const time = message["time"]
        const current = document.getElementById("current-user").innerHTML;
        if (name != current) {
            return;
        }
        const div = document.createElement("div")
        div.classList.add('message');
        div.innerHTML = `<div class="messenger">
            ${name} &nbsp;<span>${time}</span>
            </div>
            <div class="messenge-box">
                <p class="message-content">
                    ${message["message"]}
                </p>
            </div>`
        messageContainer.current.appendChild(div);
        messageContainer.current.scrollTop = messageContainer.current.scrollHeight
    }

    const handleAddConvo = async () => {
        try {
            const response = await axios.post(baseURLinstance + `/api/conversation/`, {
                name: currentChat.name, 
                members: currentChat.users
            })
            return response.data.chatId;
        } catch(err) {
            return null
        }
    }

    // chatObject has an ID or a username/name
    const onHandleReceiver = (chatObject) => {
        if (chatObject.chatId) {
            const tempName = currentUser
            const name = getChatName(auth.username, chatObject.users)
            // if the name of the user you're talking to doesn't match the searched user
            if (name != tempName) {
                messageContainer.current.innerHTML=''
                setCurrentUser(name)
            }
        } else {
            // gets the chat name between a private conversation
            const name = getChatName(auth.username, chatObject.users)
            messageContainer.current.innerHTML=''
            setCurrentUser(name)
        }
        // store name as empty if its private
        chatObject.name = ""
        setCurrentChat(chatObject);
        setShowFriends(true);
    }

    const handleLogOut = async () => {
        // set the authenticated user to empty
        setAuth({})
        await axios.get(baseURLinstance + '/api/logout');
        return navigate("/", { replace: true }); // <-- issue imperative redirect
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        const message = document.getElementById('message-form').value;
        // no user to send to
        if (message=="" || currentUser == "") {
            return 
        }
        //const message = chatInput;
        const date = new Date();
        let formattedDate = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        try {
            // check if its a userid or a chat id. Chat id requires 
            // 1. we have the current chat so it should be fine.
            // we create the conversation and get the id back.
            let chatId = await handleAddConvo()

            const messageObj = {
                sender: auth.userId,
                members: currentChat.users,
                time: formattedDate,
                message: message,
                chatId: chatId
            }
            
            // 2. post the message to the db
            await axios.post(baseURLinstance + '/api/messages/', messageObj)
            currentChat.chatId = chatId;
            setCurrentChat(currentChat);

            setShowFriends(true)
            // 3. websocket send/update
            userDisplayMessage(auth.username, messageObj, true)
            document.getElementById('message-form').value = "";
        } catch(err) {
            console.log(err)
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
                        {ShowFriends
                            ? <FriendList onHandleReceiver = {onHandleReceiver} setChatList = {setChatList} chatList = {chatList} />
                            : <SearchBar onHandleReceiver = {onHandleReceiver}/>
                        }
                        
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