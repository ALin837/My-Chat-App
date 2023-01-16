import {useContext} from "react"
import SocketProvider from "../context/authProvider"

const useSocket = ()=> {
    return useContext(SocketProvider)
}

export default useSocket;