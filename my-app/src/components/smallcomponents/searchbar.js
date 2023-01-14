import React, {useEffect, useState} from 'react'
import { Fragment } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import useAuth from '../../hooks/useAuth';
import useAPI from '../../hooks/useApi'
import '../../styles/chat-page.css'
const MAX_USERS_SHOWN = 8;


const searchBar = (props) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const {auth} = useAuth();
    const axiosInstance = useAPI()

    // fetch all the users
    useEffect(()=> {
        const getUsers = async ()=> {
            try {
                const response = await axiosInstance.get('/api/users/all');
                const result = response.data.users.filter(item => item.username != auth.username)
                setUsers(result);
            } catch (err) {
                console.log(err)
            }
        }
        getUsers();
    }, users)

    // have btoh the sender and reciever id
    const handleUserClick = (userId, username) => {
        // set the current conversation to the userID
        //console.log(userId)
        const user = {userId, username}

        const selfname = auth.userId
        const selfusername = auth.username

        const selfUser = {userId: selfname, username: selfusername}
        //console.log(selfUser)
        const arrayOfUsers = [user, selfUser]
        console.log(arrayOfUsers)
        props.onHandleReceiver({userId: userId, name: username, users: arrayOfUsers});
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