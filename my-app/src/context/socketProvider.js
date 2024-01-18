import React, {createContext, useState, useEffect, useContext} from 'react'
import { io } from "socket.io-client";
import useAuth from '../hooks/useAuth';
const SocketContext = createContext()
const socketServerUrl = process.env.SOCKET_SERVER || 'http://localhost:3000';
export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null)
    const {auth} = useAuth();
    useEffect(() => {
        const newSocket = io(
          socketServerUrl
        )
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