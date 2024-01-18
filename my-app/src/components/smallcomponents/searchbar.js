import React, {useEffect, useState} from 'react'
import { Fragment } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import useAuth from '../../hooks/useAuth';
import useAPI from '../../hooks/useApi'
import axios from 'axios';
import '../../styles/chat-page.css'
const MAX_USERS_SHOWN = 8;
const baseURLinstance = process.env.REACT_APP_API_URL || "http://localhost:9000";

const searchBar = (props) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const {auth} = useAuth();
    const axiosInstance = useAPI()
    //axios.defaults.withCredentials = true;
    // fetch all the users
    useEffect(()=> {
        const getUsers = async ()=> {
            try {
                const response = await axiosInstance.get(baseURLinstance+'/api/users/all');
                const result = response.data.users.filter(item => item.username != auth.username)
                setUsers(result);
            } catch (err) {
                console.log(err)
            }
        }
        getUsers();
    }, [auth.username])

    // have btoh the sender and reciever id
    const handleUserClick = async (userId, username) => {
        // set the current conversation to the userID
        //console.log(userId)
        const user = {userId, username}
        const selfname = auth.userId
        const selfusername = auth.username

        let chatId = 0;
        // find the id of the conversation
        try {
            const response = await axiosInstance.get(baseURLinstance+`/api/conversation/${selfname}/${userId}`);
            chatId = response.data.chatId;
        } catch (err) {
            console.log(err);

        }
        const selfUser = {userId: selfname, username: selfusername}
        const arrayOfUsers = [user, selfUser]
        props.onHandleReceiver({chatId: chatId, name: username, users: arrayOfUsers});
    }

    return (
        <Fragment>
            <div className="input-search-bar">
                <input type="text" id="search" name="search"  onChange= {(e) => setSearchTerm(e.target.value)} placeholder='Search for People'></input>
            </div>
            { users &&
                users
                .filter((item) => {
                    const searchKeyword = searchTerm.toLowerCase();
                    const fullName = item.username.toLowerCase();
                    return (
                        searchKeyword &&
                        fullName.startsWith(searchKeyword)
                    )
                })
                .slice(0,MAX_USERS_SHOWN)
                .map((item, index)=> (  // the userID along with the username // the userid will be used for creating the future conversation object
                    <div key = {index} className="user" onClick= {() => {handleUserClick(item._id, item.username)}}>
                        <PersonIcon fontSize="inherit" /> {item.username}
                    </div>
                ))
            }
        </Fragment>
    );


}
export default searchBar