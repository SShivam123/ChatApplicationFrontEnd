import React, { useContext } from 'react'
import { Route, Routes } from 'react-router'
import JoinRoom from './Component/JoinRoom'
import ChatBox from './Component/ChatBox'
import { Toaster } from 'react-hot-toast'
import Login from './Component/Login'
import Register from './Component/Register'
import Navbar from './Component/Navbar'
import AddMember from './Component/AddMember'
import { chatContext } from './Context/ContextProvider'
import Profile from './Component/Profile'
import PersonalDetail from './profile-pages/PersonalDetail'
import Allmembers from './profile-pages/Allmembers'
import MyRooms from './profile-pages/MyRooms'
import EditProfile from './profile-pages/EditProfile'
import ChangePassword from './profile-pages/ChangePassword'
import ForgotPassword from './Component/ForgotPassword'
import ResetPassword from './Component/ResetPassword'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute'
import NotFound from './Component/NotFound'
import Home from './Component/Home'
import HomePage from './Component/HomePage'
import Warning from './Component/Warning'

const App = () => {
  const { connected, isLoggedIn } = useContext(chatContext)
  return (
    <div>
      <Toaster />
      {!connected && isLoggedIn && <Navbar />}
      <Routes>
        <Route element={<ProtectedRoute />}>    
          <Route path='/chat' element={<ChatBox />} />
          <Route path='/add-member' element={<AddMember />} />
          <Route path='/profile' element={<Profile />}>
            <Route index element={<PersonalDetail />} />
            <Route path='all-member' element={<Allmembers />} />
            <Route path='my-room' element={<MyRooms />} />
          </Route>
        </Route>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        {/* <Route path='/navbar' element={<Navbar />} /> */}
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/Home' element={<Home/>} />
          <Route path='warning' element={<Warning />} />
      </Routes>
    </div>
  )
}

export default App