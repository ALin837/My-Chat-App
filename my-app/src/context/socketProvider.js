import React, {createContext, useState, useEffect} from 'react'
import { io } from "socket.io-client";
import useAuth from '../hooks/useAuth';
const SocketContext = createContext(null)

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null)
    const {auth} = useAuth();
    useEffect(() => {
        const newSocket = io(
          'http://localhost:3000'
        )
        setSocket(newSocket)
    
        return () => newSocket.close()
      }, [auth.username])
    return (
        <SocketContext.Provider value = {{socket,setSocket}}>
            {children}
        </SocketContext.Provider>
    )

}

export default SocketContext