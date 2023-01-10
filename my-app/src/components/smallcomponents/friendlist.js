import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { Fragment } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useAuth from '../../hooks/useAuth';
import '../../styles/chat-page.css'
import useAPI from '../../hooks/useApi'
function getChatName(username,members) {
    if (members.length == 2) {
        console.log(members)
        const result = members.filter(item => (item.username != username))
        return result[0].username
    }
}
const FriendList = (props) => {
    const [chatList, setChatList] = useState([])
    const {auth} = useAuth();
    const axiosInstance = useAPI()
    // fetch all the users
    useEffect(()=> {
        const getUsers = async ()=> {
            try {
                const response = await axiosInstance.get(`/api/conversation/${auth.userId}`);
                setChatList(response.data.conversations);
            } catch (err) {
                console.log(err)
            }
        }
        getUsers();
    }, [auth])
        // have btoh the sender and reciever id
    const handleUserClick = (chatId, chatName, members) => {
        console.log(chatName)
        props.onHandleReceiver({chatId: chatId, name: chatName, users: members});
    }
    return (
        <Fragment>
            <div className="user-name">
                <AccountCircleIcon fontSize="inherit" />
                Welcome {auth.username} 
            </div>
            <div id="user-list">
            { chatList &&
                chatList
                .map((item)=> (  // (chat ID gets put in, along with the chat name) 
                    <div className="user" onClick= {() => {handleUserClick(item._id, getChatName(auth.username,item.members), item.members)}}>
                        <PersonIcon fontSize="inherit" /> {getChatName(auth.username,item.members)}
                    </div>
                ))
            }
            </div>
        </Fragment>
    );
}
export default FriendList