import React, {createContext, useState, useEffect, useContext} from 'react'
import { io } from "socket.io-client";
import useAuth from '../hooks/useAuth';
const SocketContext = createContext()

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null)
    const {auth} = useAuth();
    useEffect(() => {
        const newSocket = io(
          'http://localhost:3000'
        )
        console.log('Socket created:', newSocket);
        setSocket(newSocket)
    
        return () => newSocket.close()
      }, [auth.username])
    return (
        <SocketContext.Provider value = {socket}>
            {children}
        </SocketContext.Provider>
    )

}

export const useWebSocket = () => {
  return useContext(SocketContext);
};