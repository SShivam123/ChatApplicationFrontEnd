import React, { useContext } from 'react'
import { chatContext } from '../Context/ContextProvider'
import JoinRoom from './JoinRoom';
import Home from './Home';
import Navbar from './Navbar';

const HomePage = () => {
    const { isLoggedIn, loadingProfile } = useContext(chatContext);
    if (loadingProfile) {
        return <div className='text-center text-3xl'>Loading..........</div>
    }
    return isLoggedIn ? <><Navbar/><JoinRoom /></> : <Home />
}

export default HomePage