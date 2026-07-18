import React from 'react'
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ClipLoader, PulseLoader } from 'react-spinners';

function AllMembers() {
    const [loading, setloading] = useState(null)
    const [AllUsers, setAllUsers] = useState([])
    // console.log(AllUsers);
     const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                let response = await fetch(`${API_URL}/getRoomUser`, {
                    credentials: "include",
                })

                if (response.status == 200) {
                    let data = await response.json()
                    setAllUsers(data)
                } else {
                    toast.error("Some thing went wrong")
                }
            } catch (error) {
                console.log(error);
            }
        }
        getAllUsers()
    }, [])

    const handleDelete = async (userId, roomId) => {
        try {
            setloading(userId)
            let response = await fetch(`${API_URL}/delete/room/${roomId}/Member/${userId}`, {
                credentials: "include",
                method: "DELETE"
            })

            if (response.status == 204) {
                setAllUsers(
                    prev =>
                        prev.filter(
                            user =>
                                !(user.userId === userId && user.roomId === roomId)
                        )
                );
                toast.success("Member delete successfully")
            } else {
                toast.error("Member not delete")
            }
        } catch (error) {
            console.log(error);
        } finally {
            setloading(null)
            // setDeletingUser(null);
        }
    }

    return (
        <div className="w-full min-h-[calc(100vh-91px)] bg-[#0e131f] text-white p-4 sm:p-6 lg:p-8 overflow-auto myuser">

            {/* Header */}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8 border-b border-gray-700 pb-6">

                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
                        Global Users Directory
                    </h2>

                    <p className="text-gray-400 text-sm mt-2">
                        Search users and add them to your multiple groups.
                    </p>
                </div>

                <div className="w-full lg:w-80">

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-[#161f30] border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />

                </div>

            </div>

            {/* ===================== Desktop Table ===================== */}

            <div className="hidden lg:block bg-[#2c333b] border border-gray-800 rounded-xl overflow-hidden shadow-lg">

                <table className="w-full text-left">

                    <thead>

                        <tr className="bg-[#161f30] text-gray-400 uppercase text-xs">

                            <th className="py-4 px-6">User</th>
                            <th className="py-4 px-6">Email</th>
                            <th className="py-4 px-6 text-center">Room</th>
                            <th className="py-4 px-6 text-right">Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {AllUsers.map((user, idx) => (

                            <tr
                                key={idx}
                                className="border-t border-gray-800 hover:bg-[#161f30]"
                            >

                                <td className="py-4 px-6">

                                    <div className="flex items-center gap-3">

                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.name}`}
                                            className="w-10 h-10 rounded-full"
                                        />

                                        <span>{user.name}</span>

                                    </div>

                                </td>

                                <td className="py-4 px-6 text-gray-400">
                                    {user.email}
                                </td>

                                <td className="py-4 px-6 text-center">
                                    {user.roomId}
                                </td>

                                <td className="py-4 px-6 text-right">

                                    <button
                                        disabled={loading === user.userId}
                                        onClick={() =>
                                            handleDelete(user.userId, user.roomId)
                                        }
                                        className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded-md text-sm cursor-pointer"
                                    >
                                        {loading === user.userId ? (
                                            <PulseLoader size={7} color="#fff" />
                                        ) : (
                                            "Remove Room"
                                        )}
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* ===================== Mobile Card ===================== */}

            <div className="lg:hidden flex flex-col gap-4">

                {AllUsers.map((user, idx) => (

                    <div
                        key={idx}
                        className="bg-[#2c333b] rounded-xl p-4 border border-gray-700 shadow-lg"
                    >

                        <div className="flex items-center gap-3">

                            <img
                                src={`https://ui-avatars.com/api/?name=${user.name}`}
                                className="w-12 h-12 rounded-full"
                            />

                            <div>

                                <h3 className="font-semibold">
                                    {user.name}
                                </h3>

                                <p className="text-sm text-gray-400 break-all">
                                    {user.email}
                                </p>

                            </div>

                        </div>

                        <div className="mt-4 space-y-2 text-sm">

                            <p>
                                <span className="font-semibold text-gray-300">
                                    Room :
                                </span>{" "}
                                {user.roomId}
                            </p>

                        </div>

                        <button
                            disabled={loading === user.userId}
                            onClick={() =>
                                handleDelete(user.userId, user.roomId)
                            }
                            className="w-full mt-4 bg-green-600 hover:bg-green-500 py-3 rounded-lg font-semibold cursor-pointer"
                        >
                            {loading === user.userId ? (
                                <PulseLoader size={7} color="#fff" />
                            ) : (
                                "Remove Room"
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllMembers