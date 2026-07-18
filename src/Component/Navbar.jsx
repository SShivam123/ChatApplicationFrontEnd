import React, { useContext, useState } from 'react'
import messenger from '../assets/messenger-Icon.webp';
import { NavLink, useNavigate } from 'react-router';
import LogOut from './LogOut';
import { AwardIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { chatContext } from '../Context/ContextProvider';
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isOpen, setisOpen] = useState(false)
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()
    const { setisLoggedIn, setPrivateKey, setPvtKeyResponse } = useContext(chatContext)
     const API_URL = import.meta.env.VITE_API_URL;

    const logOutHandle = async () => {
        try {
            setloading(true)
            let response = await fetch(`${API_URL}/logoutt`, {
                method: "POST",
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.text()
                toast.success(data)
                setisLoggedIn(false)
                setPrivateKey(null)
                setPvtKeyResponse(null)
                navigate("/login")
                setisOpen(false)
            } else {
                toast.error("error")
            }
        } catch (error) {
            console.log("Some error occured..");

        } finally {
            setloading(false)
        }
    }

    return (
        <div className="bg-gradient-to-br from-black/80 via-amber-400 to-black/80 px-4 sm:px-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
                {/* Logo */}

                <img
                    src={messenger}
                    alt=""
                    className="h-14 w-14 sm:h-16 sm:w-16 md:h-17 md:w-17"
                />

                {/* Desktop Menu */}

                <div className="hidden md:flex gap-5 lg:gap-7">

                    <NavLink
                        to="/add-member"
                        className={({ isActive }) =>
                            `px-5 py-2 rounded-full font-bold border border-black transition-all duration-300 hover:scale-105 active:scale-95
                        ${isActive
                                ? "bg-white text-black"
                                : "text-black hover:bg-white hover:text-black"
                            }`
                        }
                    >
                        Add-Member
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `px-5 py-2 rounded-full font-bold border border-black transition-all duration-300 hover:scale-105 active:scale-95
                        ${isActive
                                ? "bg-white text-black"
                                : "text-black hover:bg-white hover:text-black"
                            }`
                        }
                    >
                        Profile
                    </NavLink>

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `px-5 py-2 rounded-full font-bold border border-black transition-all duration-300 hover:scale-105 active:scale-95
                        ${isActive
                                ? "bg-white text-black"
                                : "text-black hover:bg-white hover:text-black"
                            }`
                        }
                    >
                        Home
                    </NavLink>

                </div>

                {/* Desktop Logout */}

                <div className="hidden md:block">
                    <p
                        className="font-semibold bg-green-400 rounded px-3 py-2 cursor-pointer transition-all duration-150 hover:scale-110 active:scale-105"
                        onClick={() => setisOpen(true)}
                    >
                        LogOut
                    </p>
                </div>

                {/* Mobile Menu Button */}

                <button
                    className="md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={30} /> : <Menu size={30} />}
                </button>

            </div>

            {/* Mobile Menu */}

            {menuOpen && (

                <div className="md:hidden pb-4">

                    <div className="flex flex-col gap-4">

                        <NavLink
                            to="/"
                            onClick={() => setMenuOpen(false)}
                            className="text-center py-3 rounded-xl border border-black font-bold hover:bg-white"
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/profile"
                            onClick={() => setMenuOpen(false)}
                            className="text-center py-3 rounded-xl border border-black font-bold hover:bg-white"
                        >
                            Profile
                        </NavLink>

                        <NavLink
                            to="/add-member"
                            onClick={() => setMenuOpen(false)}
                            className="text-center py-3 rounded-xl border border-black font-bold hover:bg-white"
                        >
                            Add-Member
                        </NavLink>

                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                setisOpen(true);
                            }}
                            className="bg-green-400 rounded-xl py-3 font-bold cursor-pointer"
                        >
                            LogOut
                        </button>

                    </div>

                </div>

            )}

            {isOpen && (
                <LogOut
                    mainText={"LogOut"}
                    descText={"Are you sure you want to logout?"}
                    cancelText={"Cancel"}
                    confirmText={"LogOut"}
                    isOpen={isOpen}
                    setisOpen={setisOpen}
                    logOutHandleAndDelete={logOutHandle}
                    loading={loading}
                />
            )}

        </div>
    );

}

export default Navbar