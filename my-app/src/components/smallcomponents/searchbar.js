import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { Fragment } from 'react';
import PersonIcon from '@mui/icons-material/Person';
const searchBar = (props) => {
    const [users, setUsers] = useState();

    useEffect(()=> {
        let isMounted = true;
        const controller = new AbortController()
        const getUsers = async ()=> {
            try {
                const response = await axios.get('/api/users/all', {
                    signal: controller.signal
                });
                console.log(response.data.users);
                if (isMounted) {
                    setUsers(response.data.users);
                }

            } catch (err) {
                console.log(err)
            }
        }
        getUsers();
        return ()=>{
            isMounted = false;
            controller.abort();
        }
    }, [])
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
        </Fragment>
    );


}
export default searchBar