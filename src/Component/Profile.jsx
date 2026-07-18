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
     const API_URL = import.meta.env.VITE_API_URL;

    const handleDelete = async () => {
        try {
            setDeleteLoading(true)
            let response = await fetch(`${API_URL}/deleteAccount/user`, {
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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-90px)]">

        {/* Sidebar */}

        <div className="w-full lg:w-1/5 bg-gradient-to-br from-slate-300 via-amber-400">

            <div className="flex lg:flex-col gap-3 p-4 overflow-x-auto lg:overflow-visible">

                <NavLink
                    end
                    to=""
                    className={({ isActive }) =>
                        `min-w-fit lg:w-full px-5 py-3 rounded-full font-bold border border-black transition-all duration-300 hover:scale-105 active:scale-95 flex justify-between items-center
                        ${isActive
                            ? "bg-white text-black"
                            : "text-black hover:bg-white hover:text-black"}`
                    }
                >
                    <span>Personal Detail</span>
                    <ChevronRight className="hidden lg:block" />
                </NavLink>

                <NavLink
                    to="my-room"
                    className={({ isActive }) =>
                        `min-w-fit lg:w-full px-5 py-3 rounded-full font-bold border border-black transition-all duration-300 hover:scale-105 active:scale-95 flex justify-between items-center
                        ${isActive
                            ? "bg-white text-black"
                            : "text-black hover:bg-white hover:text-black"}`
                    }
                >
                    <span>My Rooms</span>
                    <ChevronRight className="hidden lg:block" />
                </NavLink>

                <NavLink
                    to="all-member"
                    className={({ isActive }) =>
                        `min-w-fit lg:w-full px-5 py-3 rounded-full font-bold border border-black transition-all duration-300 hover:scale-105 active:scale-95 flex justify-between items-center
                        ${isActive
                            ? "bg-white text-black"
                            : "text-black hover:bg-white hover:text-black"}`
                    }
                >
                    <span>All Members</span>
                    <ChevronRight className="hidden lg:block" />
                </NavLink>

                <p
                    onClick={() => setdeleteModelOpen(true)}
                    className="min-w-fit lg:w-full px-5 py-3 rounded-full font-bold border border-black transition-all duration-300 hover:scale-105 active:scale-95 flex justify-between items-center cursor-pointer hover:bg-white"
                >
                    <span>Delete Account</span>
                    <ChevronRight className="hidden lg:block" />
                </p>

            </div>

        </div>

        {/* Content */}

        <div className="flex-1 bg-gray-200 overflow-auto">
            <Outlet />
        </div>

        {deleteModelOpen && (
            <LogOut
                mainText={"Delete-Account"}
                descText={"Are you sure you want to delete-Account?"}
                cancelText={"Cancel"}
                confirmText={"Delete-Account"}
                isOpen={deleteModelOpen}
                setisOpen={setdeleteModelOpen}
                logOutHandleAndDelete={handleDelete}
                loading={DeleteLoading}
            />
        )}

    </div>
);
}

export default Profile