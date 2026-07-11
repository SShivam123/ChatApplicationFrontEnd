import { ChevronRight } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { NavLink } from 'react-router';
import LogOut from './LogOut';
import toast from 'react-hot-toast';
import { chatContext } from '../Context/ContextProvider';

const Profile = () => {
    const [deleteModelOpen, setdeleteModelOpen] = useState(false)
    const [DeleteLoading, setDeleteLoading] = useState(false)
    const { setisLoggedIn, setuserData } = useContext(chatContext)
    const navigate = useNavigate()

    const handleDelete = async () => {
        try {
            setDeleteLoading(true)
            let response = await fetch("http://localhost:8080/deleteAccount/user", {
                method: "DELETE",
                credentials: "include"
            });
            if (response.status == 204) {
                toast.success("Account deleted permanenet");
                navigate("/login")
                setisLoggedIn(false)
                setuserData(null)
            }
        } catch (error) {
            toast.error("Account not deleted..")
        } finally {
            setDeleteLoading(false)
        }
    }
    return (
        <div className='flex h-[calc(100vh-70px)]'>
            <div className='w-1/5 h-full bg-gradient-to-br from-slate-300  via-amber-400 border-b from-slate-300 '>
                <div className='flex flex-col gap-4 p-4'>
                    <NavLink end
                        to=""
                        className={({ isActive }) =>
                            `px-5 py-2 rounded-full font-bold border border-black transition-all duration-300
     hover:scale-105 active:scale-95 flex justify-between
    ${isActive
                                ? "bg-white text-black"
                                : "text-black hover:bg-white hover:text-black"
                            }`
                        }
                    >
                        Personal-Detail
                        <span><ChevronRight /></span>
                    </NavLink>
                    <NavLink
                        to="my-room"
                        className={({ isActive }) =>
                            `px-5 py-2 rounded-full font-bold border border-black transition-all duration-300
     hover:scale-105 active:scale-95  flex justify-between
    ${isActive
                                ? "bg-white text-black"
                                : "text-black hover:bg-white hover:text-black"
                            }`
                        }
                    >
                        My-Rooms
                        <span><ChevronRight /></span>
                    </NavLink>
                    <NavLink
                        to="all-member"
                        className={({ isActive }) =>
                            `px-5 py-2 rounded-full font-bold border border-black transition-all duration-300
     hover:scale-105 active:scale-95 flex justify-between
    ${isActive
                                ? "bg-white text-black"
                                : "text-black hover:bg-white hover:text-black"
                            }`
                        }
                    >
                        All-Members
                        <span><ChevronRight /></span>
                    </NavLink>

                    <p className='px-5 py-2 rounded-full font-bold border border-black transition-all duration-300
     hover:scale-105 active:scale-95 flex justify-between' onClick={() => setdeleteModelOpen(true)}>
                        <span >Delete-Account</span>
                        <span><ChevronRight /></span>
                    </p>
                </div>
            </div>
            <div className='w-4/5 h-full bg-gray-200'>
                <Outlet />
            </div>
            {deleteModelOpen && <LogOut mainText={"Delete-Account"} descText={"Are you sure you want to delete-Account?"} cancelText={"Cancel"} confirmText={"Delete-Account"} isOpen={deleteModelOpen} setisOpen={setdeleteModelOpen} logOutHandleAndDelete={handleDelete} loading={DeleteLoading} />}
        </div>
    )
}

export default Profile