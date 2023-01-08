import React, {useEffect, useState} from 'react'
import { Fragment } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import useAuth from '../../hooks/useAuth';
import useRefreshToken from '../../hooks/useRefreshToken';
import useAPI from '../../hooks/useApi'
const MAX_USERS_SHOWN = 8;


const searchBar = (props) => {
    const [users, setUsers] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const {auth} = useAuth();
    const axiosInstance = useAPI()

    // fetch all the users
    useEffect(()=> {
        const getUsers = async ()=> {
            try {
                const response = await axiosInstance.get('/api/users/all');
                const result = response.data.users.filter(item => item.username != auth.username)
                console.log(result)
                setUsers(result);
            } catch (err) {
                console.log(err)
            }
        }
        getUsers();
    }, [])

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
                        fullName.startsWith(searchKeyword) &&
                        fullName !== searchKeyword
                    )
                })
                .slice(0,MAX_USERS_SHOWN)
                .map((item)=> (
                    <div className="user">
                        <PersonIcon fontSize="inherit" /> {item.username}
                    </div>
                ))
            }
        </Fragment>
    );


}
export default searchBar