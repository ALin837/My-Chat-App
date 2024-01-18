import axios from 'axios'
const baseURLinstance = process.env.REACT_APP_API_URL || "http://localhost:9000";

const axiosInstance = axios.create({
    baseURL: baseURLinstance,
    headers: { 
        'Content-Type': 'application/json' 
    },
    withCredentials: true
});
export default axiosInstance; 

