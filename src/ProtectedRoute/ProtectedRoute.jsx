import React, { useContext } from 'react'
import { chatContext } from '../Context/ContextProvider'
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
    const {loadingProfile,isLoggedIn} = useContext(chatContext);
    if(loadingProfile){
        return <div className='text-center text-3xl mt-4'>Loading...</div>
    }
  return isLoggedIn ? <Outlet/>: <Navigate to="/login" replace />
}

export default ProtectedRoute