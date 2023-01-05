import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { Fragment } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import useAuth from '../../hooks/useAuth';
import useRefreshToken from '../../hooks/useRefreshToken';
const searchBar = (props) => {
    const [users, setUsers] = useState();
    const {auth} = useAuth();
    const refresh = useRefreshToken();
    useEffect(()=> {
        const getUsers = async ()=> {
            try {
                const accessToken = auth.accessToken
                const response = await axios.get('/api/users/all',  { 
                     headers: {Authorization: `header ${accessToken}`}
                    });
                 setUsers(response.data.users);
            } catch (err) {
                console.log(err)
            }
        }
        getUsers();
    }, [])
    console.log(users)
    return (
        <Fragment>
            <div className="input-search-bar">
                <input type="text" id="search" name="search" placeholder='Search for People'></input>
            </div>

            { users &&
                users.map((item)=> (
                    <div className="user">
                        <PersonIcon fontSize="inherit" /> {item.username}
                    </div>
                ))
            }
            <button onClick = {()=>(refresh())}> BUTTON</button>
        </Fragment>
    );


}
export default searchBar