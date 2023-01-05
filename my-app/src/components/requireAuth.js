import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from "../hooks/useAuth"
import React from 'react';

const RequireAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();
    
    return (
        auth.username
        ? <Outlet/> 
        : <Navigate to="/" state={{from:location}} replace/>
    )
}
export default RequireAuth;