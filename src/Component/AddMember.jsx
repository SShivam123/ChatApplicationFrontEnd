import React, { useContext, useEffect, useState } from 'react'
import { chatContext } from '../Context/ContextProvider'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

const AddMember = () => {
    const [loading, setloading] = useState(false)
    const [selectedRoom, setselectedRoom] = useState("")
    const [errors, seterrors] = useState(null)
    const [Users, setUsers] = useState([])
    const [searchValue, setsearchValue] = useState("")
    const [debounceSearch, setdebounceSearch] = useState("")
    const [isOpen, setisOpen] = useState(false)
    const [selected, setselected] = useState(false)
    const { AllRoom, setRooms, getRoooms } = useContext(chatContext)
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (searchValue.trim() == "") {
            setUsers([])
            setdebounceSearch("")
            setisOpen(false)
            return;
        }
        let timer = setTimeout(() => {
            setdebounceSearch(searchValue)
        }, 500);
        return () => {
            clearTimeout(timer)
        }
    }, [searchValue])

    useEffect(() => {
        if (debounceSearch.trim() == "") {
            setUsers([])
            return
        }
        const searchByEmail = async () => {
            let response = await fetch(`${API_URL}/search?email=${debounceSearch}`, {
                credentials: "include"
            })
            let data = await response.json();
            if (response.status == 200) {
                setisOpen(true)
                setUsers(data)
                // console.log(data);
            }
        }
        if (!selected) {
            searchByEmail();
        }
    }, [debounceSearch])

    const handleSearch = (e) => {
        setisOpen(false)
        setselected(true)
        setsearchValue(e.target.innerText);
    }

    useEffect(() => {
        getRoooms()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        let error = {};
        if (searchValue.trim().length < 2 || !searchValue.includes(".")) {
            error.email = "email is required"
        }
        if (selectedRoom == "") {
            error.room = "Please select the room"
        }
        seterrors(error)
        if (Object.keys(error).length > 0) {
            return;
        }

        try {
            setloading(true)
            let response = await fetch(`${API_URL}/add-member`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: searchValue,
                    roomId: selectedRoom
                })
            })
            let data = await response.json()
            console.log("Hello");

            if (response.status == 201) {
                setsearchValue("");
                setselectedRoom("");
                toast.success("member added successfully")
                console.log(data);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setloading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-91px)] flex justify-center items-center bg-gradient-to-br from-amber-400 via-cyan-200 to-amber-400 px-4 py-8">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white/70 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-xl"
            >

                <h1 className="text-2xl sm:text-3xl font-bold text-center">
                    Add Member
                </h1>

                {/* Search */}

                <div className="relative">

                    <div className="flex flex-col gap-2">

                        <label className="font-semibold">
                            Search
                        </label>

                        <input
                            type="text"
                            placeholder="Search Member"
                            value={searchValue}
                            onChange={(e) => {
                                setsearchValue(e.target.value);
                                setselected(false);
                            }}
                            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-amber-400"
                        />

                        {errors?.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}

                    </div>

                    {isOpen && (

                        <div className="scrolll absolute z-20 mt-2 w-full h-36 rounded-lg bg-amber-300 overflow-y-auto shadow-lg">

                            <ul className="flex flex-col">

                                {Users.map((user, idx) => (

                                    <li
                                        key={idx}
                                        onClick={handleSearch}
                                        className="bg-slate-500 text-white p-3 cursor-pointer hover:bg-slate-600 transition"
                                    >
                                        {user?.email}
                                    </li>

                                ))}

                            </ul>

                        </div>

                    )}

                </div>

                {/* Select Room */}

                <div className="flex flex-col gap-2">

                    <label className="font-semibold">
                        Select Room
                    </label>

                    <select
                        value={selectedRoom}
                        onChange={(e) => setselectedRoom(e.target.value)}
                        className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-amber-400"
                    >

                        <option value="">
                            Select Room
                        </option>

                        {AllRoom.map((room, idx) => (

                            <option key={idx}>
                                {room.roomId}
                            </option>

                        ))}

                    </select>

                    {errors?.room && (
                        <p className="text-red-500 text-sm">
                            {errors.room}
                        </p>
                    )}

                </div>

                {/* Button */}

                <button
                    className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-900 transition cursor-pointer"
                >
                    {loading ? (
                        <ClipLoader color="white" size={22} />
                    ) : (
                        "Add Member"
                    )}
                </button>

            </form>

        </div>
    );
}

export default AddMember