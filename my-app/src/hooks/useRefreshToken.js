import axios from 'axios'
import useAuth from './useAuth'
// this will get a new refresh token and then change the current authtoken
const useRefreshToken = () => {
    const {auth,setAuth} = useAuth()
    const refresh = async ()=> {
        const response = await axios.get('/api/refresh', {
            withCredentials: true
        })
        console.log(response.data.token)
        if (response.data.token) {
            auth.accessToken = response.data.token;
            setAuth(auth)
            console.log(auth)
        }
        return response.data.accessToken;
    }
    return refresh
}

export default useRefreshToken