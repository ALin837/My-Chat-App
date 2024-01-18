import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { Fragment } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useAuth from '../../hooks/useAuth';
import '../../styles/chat-page.css'
import useAPI from '../../hooks/useApi'
const baseURLinstance = process.env.API_URL //|| "http://localhost:9000";
function getChatName(username,members) {
    if (members.length == 2) {
        const result = members.filter(item => (item.username != username))
        return result[0].username
    }
}
const FriendList = (props) => {
    axios.defaults.withCredentials = true;
    const {auth} = useAuth();
    //const axiosInstance = useAPI()
    // fetch all the users
    useEffect(()=> {
        const getUsers = async ()=> {
            try {
                const response = await axios.get(baseURLinstance + `/api/conversation/${auth.userId}`);
                props.setChatList(response.data.conversations);
            } catch (err) {
                console.log(err)
            }
        }
        getUsers();
    }, [props.chatList])


    // have both the sender and reciever id
    const handleUserClick = (chatId, chatName, members) => {
        props.onHandleReceiver({chatId: chatId, name: chatName, users: members});
    }
    return (
        <Fragment>
            <div className="user-name">
                Chats
            </div>
            <div id="user-list">
            { props.chatList &&
                props.chatList
                .map((item, index)=> (  // (chat ID gets put in, along with the chat name) 
                    <div key = {index} className="user" onClick= {() => {handleUserClick(item._id, getChatName(auth.username,item.members), item.members)}}>
                        <PersonIcon fontSize="inherit" /> {getChatName(auth.username,item.members)}
                    </div>
                ))
            }
            </div>
        </Fragment>
    );
}
export default FriendList