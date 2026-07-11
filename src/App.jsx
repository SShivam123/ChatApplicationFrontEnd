import React, { useContext } from 'react'
import { Route ,Routes} from 'react-router'
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

const App = () => {
  const{connected,isLoggedIn}= useContext(chatContext)
  return (
    <div>
      <Toaster/>
      {!connected && isLoggedIn && <Navbar />}
      <Routes>
        <Route path='/' element={<JoinRoom/>}/>
        <Route path='/chat' element={<ChatBox/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/navbar' element={<Navbar/>}/>
        <Route path='/add-member' element={<AddMember/>}/>
        <Route path='/profile' element={<Profile/>}>
          <Route index element={<PersonalDetail/>}/>
          <Route path='all-member' element={<Allmembers/>}/>
          <Route path='my-room' element={<MyRooms/>}/>
          <Route path='editProfile' element={<EditProfile/>}/>
          <Route path='change-password' element={<ChangePassword/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App