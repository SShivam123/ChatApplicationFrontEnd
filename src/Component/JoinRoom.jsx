import React, { useContext, useEffect, useState } from 'react'
import chatIcon from '../assets/chatIcon.png'
import toast from 'react-hot-toast'
import { chatContext } from '../Context/ContextProvider'
import { useNavigate } from 'react-router'
import { PulseLoader } from 'react-spinners'
import Navbar from './Navbar'
import { LucideFileBracesCorner } from 'lucide-react'
import UnlockMessages from './UnlockMessages'

const JoinRoom = () => {
    const { userData, setuserData, getProfile } = useContext(chatContext);
    const [loadingjoin, setloadingjoin] = useState(false)
    const [loadingCreate, setloadingCreate] = useState(false)
    const navigate = useNavigate();
    const [roomId, setroomId] = useState("")
    const [password, setPassword] = useState("");
    const [error, seterror] = useState(null)
    const { roomData, setroomData, currentUser, setcurrentUser, connected, setconnected,privateKey ,pvtKeyResponse,decryptPrivateKeyFnc, isLoggedIn} = useContext(chatContext)

    const validateForm = () => {
        let errors = {};
        if (roomId.trim() === "") {
            errors.roomId = "RoomId is required"
        }
        return errors;
    }

    useEffect(() => {
        getProfile();
    }, [])

    const joinRoom = async () => {
        let errors = validateForm();
        seterror(errors)
        if (Object.keys(errors).length > 0) {
            return;
        }
        try {
            setloadingjoin(true)
            let response = await fetch(`http://localhost:8080/api/v1/room/${roomId}`, {
                credentials: "include"
            })
            let data = await response.json();
            if (response.status === 200) {
                console.log(data);
                
                setcurrentUser(data.userId);
                setroomData(data);
                setconnected(true);
                navigate("/chat")
                console.log(data);
                toast.success("Room join successfully")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("some error occured on join room..")
        } finally {
            setloadingjoin(false)
        }

    }

    const createRoom = async () => {
        let errors = validateForm();
        seterror(errors)
        if (Object.keys(errors).length > 0) {
            return;
        }
        try {
            setloadingCreate(true)
            let response = await fetch("http://localhost:8080/api/v1/create-room", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    roomId
                })
            })

            let data = await response.json();
            if (response.status === 201) {
                setroomData(data);
                setcurrentUser(data.userId)
                setconnected(true);
                navigate("/chat")
                joinRoom();
                toast.success("Room created successfully")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("some error occured on create room..")
        } finally {
            setloadingCreate(false)
        }
    }

   const handleUnlockChat = ()=>{
        if(!password){
            toast.error("Password is Required")
            return;
        }
        console.log(pvtKeyResponse);
        decryptPrivateKeyFnc(pvtKeyResponse, password)
    }

    if(!privateKey && isLoggedIn){
        return <UnlockMessages handleUnlockChat = {handleUnlockChat} password = {password} setPassword = {setPassword}/>
    }

    return (
            <div className='min-h-[calc(100vh-68px)] w-full flex justify-center items-center bg-white text-black  dark:bg-black dark:text-white bg-gradient-to-br from-amber-400  via-black to-amber-400'>
                <div className='flex flex-col gap-5 p-6 w-110  text-white dark:bg-white dark:text-black backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl rounded-2xl'>
                    <h1 className='text-center text-xl font-semibold'>Welcome:-{userData && userData.name}</h1>
                    <div className='flex justify-between'>
                        <h1 className='font-bold text-2xl'>JOIN ROOM</h1>
                        <img src={chatIcon} className='h-10 w-10' />
                        <h1 className='font-bold text-2xl'>CREATE ROOM</h1>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='font-semibold'>ROOM ID / NEW ROOM ID</label>
                        <input type="text" placeholder='Enter your room Id' className='border p-2 rounded bg-white/70 text-black outline-none focus:ring-2 focus:ring-amber-400' value={roomId} onChange={(e) => setroomId(e.target.value)} />
                        {error && error.roomId && <p className='text-red-500'>{error.roomId}</p>}
                    </div>
                    <div className='flex justify-between items-center'>
                        <button className='px-6 py-2 bg-blue-400 rounded-full hover:bg-blue-500 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl' onClick={joinRoom} disabled={loadingjoin}>{loadingjoin ? <PulseLoader /> : "Join Room"}</button>
                        <button className='px-6 py-2 bg-green-400 hover:bg-green-600 rounded-full cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl' onClick={createRoom} disabled={loadingCreate} >{loadingCreate ? <PulseLoader /> : "Create Room"}</button>
                    </div>
                </div>
            </div>
    )
}

export default JoinRoom