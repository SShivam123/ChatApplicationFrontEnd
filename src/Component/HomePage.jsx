import React, { useContext } from 'react'
import { chatContext } from '../Context/ContextProvider'
import JoinRoom from './JoinRoom';
import Home from './Home';

const HomePage = () => {
    const { isLoggedIn, loadingProfile } = useContext(chatContext);
    if (loadingProfile) {
        return <div className='text-center text-3xl'>Loading..........</div>
    }
    return isLoggedIn ? <JoinRoom /> : <Home />
}

export default HomePage