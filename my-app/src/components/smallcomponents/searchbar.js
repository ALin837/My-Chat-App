import React, {useEffect, useState} from 'react'
import { Fragment } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import useAuth from '../../hooks/useAuth';
import useRefreshToken from '../../hooks/useRefreshToken';
import useAPI from '../../hooks/useApi'
const searchBar = (props) => {
    const [users, setUsers] = useState();
    const {auth} = useAuth();
    const refresh = useRefreshToken();
    const axiosInstance = useAPI()
    useEffect(()=> {
        const getUsers = async ()=> {
            try {
                const response = await axiosInstance.get('/api/users/all');
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