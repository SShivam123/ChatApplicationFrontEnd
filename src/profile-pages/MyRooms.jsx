import React, { useContext, useEffect, useState } from 'react'
import { chatContext } from '../Context/ContextProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { PulseLoader } from 'react-spinners';
import { Trash } from 'lucide-react';

const MyRooms = () => {
    const [AllRooms, setAllRooms] = useState([])
    const [loadingJoin, setloadingJoin] = useState(false)
    const { userData, setconnected, setroomData, setcurrentUser, privateKey } = useContext(chatContext)
    const navigate = useNavigate()
    const [DeleteLoading, setDeleteLoading] = useState(false)
    const [deleteId, setdeleteId] = useState("")
     const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getAllRooms = async () => {
            try {
                let response = await fetch(`${API_URL}/api/v1/getAllRoomCreatedOrJoin`, {
                    credentials: "include",
                })

                if (response.status == 200) {
                    let data = await response.json()
                    setAllRooms(data)
                } else {
                    toast.error("Some thing went wrong")
                }
            } catch (error) {
                console.log(error);
            }
        }
        getAllRooms()
    }, [])

    const joinRoomApi = async (roomId) => {
        if (!privateKey) {
            navigate("/")
            return;
        }
        try {
            setloadingJoin(true)
            let response = await fetch(`${API_URL}/api/v1/room/${roomId}`, {
                credentials: "include"
            })
            let data = await response.json();
            if (response.status === 200) {
                setroomData(data);
                setcurrentUser(name)
                setconnected(true);
                navigate("/chat")
                toast.success("Room join successfully")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("some error occured on join room..")
        } finally {
            setloadingJoin(false)
        }
    }

    const handleDelete = async (roomId) => {
        setdeleteId(roomId)
        try {
            setDeleteLoading(true)
            let response = await fetch(`${API_URL}/api/v1/delete/room/${roomId}`, {
                credentials: "include",
                method: "DELETE"
            })
            if (response.ok) {
                toast.success("Room deleted successfully")
                setAllRooms((prev) => (prev.filter(room => room.roomId !== roomId)))
            } else {
                toast.error("Room Not Deleted Due to some error")
            }
        } catch (error) {
            toast.error("Some error occured")
        } finally {
            setDeleteLoading(false)
            setdeleteId("")
        }
    }

    return (
        <div className="min-h-[calc(100vh-91px)] bg-gradient-to-br from-black via-gray-900 to-amber-900 p-4 sm:p-6 overflow-auto myRoom">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
                🚀 Your Rooms
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {AllRooms.map((room, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-2xl
                    bg-white/10 backdrop-blur-lg border border-white/20
                    p-5 shadow-xl hover:shadow-amber-500/30
                    hover:-translate-y-2 transition-all duration-300"
                    >
                        {/* Glow */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-amber-400/20 to-orange-500/20"></div>
                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex justify-between items-start gap-3">
                                <h2 className="text-lg sm:text-xl font-bold text-white break-all">
                                    {room.roomId}
                                </h2>
                                {userData?.userId == room.userId && (
                                    <button
                                        onClick={() => handleDelete(room.roomId)}
                                        disabled={DeleteLoading}
                                        className="bg-gray-200/10 border border-gray-500/20 text-gray-300 p-2 rounded-full hover:bg-gray-500/30 transition cursor-pointer flex-shrink-0"
                                    >
                                        {deleteId == room.roomId ? (
                                            <PulseLoader size={6} />
                                        ) : (
                                            <Trash size={16} />
                                        )}
                                    </button>
                                )}
                            </div>
                            {/* Members */}
                            <div className="mt-4 flex justify-between items-center">
                                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                                    {room.members} Members
                                </span>
                                <span className="text-gray-300 text-sm">
                                    👤 {userData?.userId == room.userId ? "Admin" : "User"}
                                </span>

                            </div>

                            {/* Join */}
                            <button
                                onClick={() => joinRoomApi(room.roomId)}
                                disabled={loadingJoin}
                                className="w-full mt-6 py-3 rounded-xl
                            bg-gradient-to-r from-amber-300 to-orange-400
                            text-black font-bold
                            hover:scale-105 active:scale-95
                            transition-all duration-300 cursor-pointer"
                            >
                                {loadingJoin ? (
                                    <PulseLoader />
                                ) : (
                                    "Join Room"
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyRooms