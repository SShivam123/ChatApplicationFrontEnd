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
    const { roomData, setroomData, currentUser, setcurrentUser, connected, setconnected, privateKey, pvtKeyResponse, decryptPrivateKeyFnc, isLoggedIn } = useContext(chatContext)
     const API_URL = import.meta.env.VITE_API_URL;

    const validateForm = () => {
        let errors = {};
        if (roomId.trim() === "") {
            errors.roomId = "RoomId is required"
        }
        return errors;
    }

    // useEffect(() => {
    //     getProfile();
    // }, [])

    const joinRoom = async () => {
        let errors = validateForm();
        seterror(errors)
        if (Object.keys(errors).length > 0) {
            return;
        }
        try {
            setloadingjoin(true)
            let response = await fetch(`${API_URL}/api/v1/room/${roomId}`, {
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
            let response = await fetch(`${API_URL}/api/v1/create-room`, {
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

    const handleUnlockChat = () => {
        if (!password) {
            toast.error("Password is Required")
            return;
        }
        console.log(pvtKeyResponse);
        decryptPrivateKeyFnc(pvtKeyResponse, password)
    }

    if (!privateKey && isLoggedIn) {
        return <UnlockMessages handleUnlockChat={handleUnlockChat} password={password} setPassword={setPassword} />
    }

    return (
        <div className="min-h-[calc(100vh-91px)] w-full flex justify-center items-center px-4 py-8 bg-gradient-to-br from-amber-400 via-black to-amber-400">

            <div className="w-full max-w-lg backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-6 sm:p-8 text-white">

                <h1 className="text-center text-lg sm:text-xl font-semibold break-words">
                    Welcome :- {userData && userData.name}
                </h1>

                {/* Heading */}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">

                    <h1 className="font-bold text-xl sm:text-2xl">
                        JOIN ROOM
                    </h1>

                    <img
                        src={chatIcon}
                        alt=""
                        className="h-12 w-12"
                    />

                    <h1 className="font-bold text-xl sm:text-2xl">
                        CREATE ROOM
                    </h1>

                </div>

                {/* Input */}

                <div className="flex flex-col gap-2 mt-8">

                    <label className="font-semibold">
                        ROOM ID / NEW ROOM ID
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your room Id"
                        value={roomId}
                        onChange={(e) => setroomId(e.target.value)}
                        className="w-full border p-3 rounded bg-white/70 text-black outline-none focus:ring-2 focus:ring-amber-400"
                    />

                    {error?.roomId && (
                        <p className="text-red-300 text-sm">
                            {error.roomId}
                        </p>
                    )}

                </div>

                {/* Buttons */}

                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">

                    <button
                        onClick={joinRoom}
                        disabled={loadingjoin}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-400 rounded-full hover:bg-blue-500 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl"
                    >
                        {loadingjoin ? (
                            <PulseLoader color="white" size={8} />
                        ) : (
                            "Join Room"
                        )}
                    </button>
                    <button
                        onClick={createRoom}
                        disabled={loadingCreate}
                        className="w-full sm:w-auto px-6 py-3 bg-green-400 hover:bg-green-600 rounded-full cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl"
                    >
                        {loadingCreate ? (
                            <PulseLoader color="white" size={8} />
                        ) : (
                            "Create Room"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JoinRoom