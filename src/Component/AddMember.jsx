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
            let response = await fetch(`http://localhost:8080/search?email=${debounceSearch}`, {
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

    const handleSubmit = async(e) => {
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
            let response = await fetch("http://localhost:8080/add-member", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email:searchValue,
                    roomId : selectedRoom
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
        <div className='flex justify-center items-center bg-gradient-to-br from-amber-400  via-cyan-200 to-amber-400 min-h-[calc(100vh-68px)]'>
            <form className='flex flex-col gap-3 w-100 p-4 rounded-2xl bg-white/70' onSubmit={handleSubmit}>
                <h1 className='font-bold text-center text-2xl'>Add-Member</h1>
                <div className='relative'>
                    <div className='flex flex-col gap-1'>
                        <label className='font-semibold'>Search:-</label>
                        <input type="text" placeholder='Search Member' className='rounded p-1 border' value={searchValue} onChange={(e) => {
                            setsearchValue(e.target.value)
                            setselected(false)
                        }} />
                        {errors && <p className="text-red-400">{errors.email}</p>}
                    </div>
                    {isOpen && <div className='scrolll absolute w-full h-32 rounded bg-amber-300 overflow-y-auto'>
                        <ul className='flex flex-col gap-1'>
                            {Users.map((user, idx) => (
                                <li key={idx} className='bg-slate-500 p-2 font-semibold cursor-pointer' onClick={handleSearch}>{user?.email}</li>
                            ))}
                        </ul>
                    </div>}

                </div>
                <div className='flex flex-col gap-2'>
                    <label className='font-semibold'>Select-Room:-</label>
                    <select className='w-full p-1 border rounded' onChange={(e) => setselectedRoom(e.target.value)} value={selectedRoom}>
                        <option value="">Select Room</option>
                        {AllRoom.map((room, idx) => (
                            <option key={idx}>{room.roomId}</option>
                        ))}
                    </select>
                    {errors && <p className="text-red-400">{errors.room}</p>}
                </div>
                <button className='bg-black text-white rounded p-1 cursor-pointer' > {loading ? <ClipLoader/>:"Add-Member"}</button>
            </form>
        </div>
    )
}

export default AddMember