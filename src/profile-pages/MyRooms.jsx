import React, { useContext, useEffect, useState } from 'react'
import { chatContext } from '../Context/ContextProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { PulseLoader } from 'react-spinners';
import { Trash } from 'lucide-react';

const MyRooms = () => {
    const [AllRooms, setAllRooms] = useState([])
    const [loadingJoin, setloadingJoin] = useState(false)
    const { userData, setconnected, setroomData, setcurrentUser,privateKey } = useContext(chatContext)
    const navigate = useNavigate()
    const [DeleteLoading, setDeleteLoading] = useState(false)
    const [deleteId, setdeleteId] = useState("")

    useEffect(() => {
        const getAllRooms = async () => {
            try {
                let response = await fetch("http://localhost:8080/api/v1/getAllRoomCreatedOrJoin", {
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
        if(!privateKey){
            navigate("/")
            return;
        }
        try {
            setloadingJoin(true)
            let response = await fetch(`http://localhost:8080/api/v1/room/${roomId}`, {
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
            let response = await fetch(`http://localhost:8080/api/v1/delete/room/${roomId}`, {
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
        <div className="h-[calc(100vh-70px)] bg-gradient-to-br from-black via-gray-900 to-amber-900 p-3 overflow-auto myRoom">

            <h1 className="text-3xl font-bold text-center text-white mb-4">
                🚀 Your Rooms
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {AllRooms.map((room, index) => (
                     console.log(room),
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-2xl
                bg-white/10 backdrop-blur-lg border border-white/20
                p-3 shadow-xl hover:shadow-amber-500/30
                hover:-translate-y-2 transition-all duration-300"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-amber-400/20 to-orange-500/20"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold text-white">
                                    {room.roomId}
                                </h2>

                                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                                    {room.members}:-members
                                </span>

                                {userData?.userId == room.userId && <button className={`bg-gray-200/10 border-gray-500/20 not-visited:text-[10px]  text-gray-400 border  font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider cursor-pointer hover:bg-gray-500/30`} onClick={() => handleDelete(room.roomId)} disabled={DeleteLoading}>
                                    {deleteId == room.roomId ? <PulseLoader size={7} /> : <Trash size={15} />}
                                </button>}
                            </div>

                            <p className="text-gray-300">
                                👤Role:- {userData?.userId == room.userId ? "Admin" : "User"}
                            </p>
                            

                            {/* <p className="text-gray-400 text-sm mt-2">
                                📅  {new Date(room.createdAt).toLocaleDateString("en-IN")} •{" "}
                                {new Date(room.createdAt).toLocaleTimeString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p> */}

                            <button
                                className="w-full mt-4 py-1.5 rounded-xl
                        bg-gradient-to-r from-amber-300 to-orange-400
                        text-black font-bold
                        hover:scale-105 active:scale-95
                        transition-all duration-300 cursor-pointer" onClick={() => joinRoomApi(room.roomId)} disabled={loadingJoin}
                            >
                                {loadingJoin ? <PulseLoader /> : "Join Room"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyRooms