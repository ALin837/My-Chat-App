import axiosInstance from '../service/api'
import {useEffect, useState} from 'react'
import useAuth from '../hooks/useAuth'
import useRefreshToken from '../hooks/useRefreshToken'
const axiosPrivate = () => {
    const {auth} = useAuth();
    const refresh = useRefreshToken()
    useEffect(() => {
        const reqIntercept= axiosInstance.interceptors.request.use(
            (config) => {
                const token = auth.accessToken;
                if (token) {
                    // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
                    config.headers["authorization"] = `header ${token}`; // for Node.js Express back-end
                }
                return config;
            },
            (error) => {
              return Promise.reject(error);
            }
        );
       
        
        const resIntercept = axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (err) => {
                const originalConfig = err.config;
                if (err.response) {
                    if (err.response.status === 401 && !originalConfig._retry) {
                        originalConfig._retry = true;
                        try {
                            const rs = await refresh();
                            originalConfig.headers['Authorization'] = `header ${rs}`
                            return axiosInstance(originalConfig);
                        } catch (error){
                            return Promise.reject(error)
                        }
                    }
                }
                return Promise.reject(err);
            }
        )

        return () => {
            axiosInstance.interceptors.response.eject(reqIntercept);
            axiosInstance.interceptors.request.eject(resIntercept);
        }
    }, [auth, refresh])
    return axiosInstance
}


export default axiosPrivate; 

