import React,{useContext, useState} from 'react'
import messenger from '../assets/messenger-Icon.webp';
import { NavLink, useNavigate } from 'react-router';
import LogOut from './LogOut';
import { AwardIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { chatContext } from '../Context/ContextProvider';

const Navbar = () => {
    const [isOpen, setisOpen] = useState(false)
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()
    const {setisLoggedIn, setPrivateKey, setPvtKeyResponse} = useContext(chatContext)

    const logOutHandle=async()=>{
        try{
            setloading(true)
            let response = await fetch("http://localhost:8080/logoutt",{
                method:"POST",
                credentials:"include"
            })
            if(response.ok){
                const data = await response.text()
                toast.success(data)
                setisLoggedIn(false)
                setPrivateKey(null)
                setPvtKeyResponse(null)
                navigate("/login")
                setisOpen(false)
            }else{
                toast.error("error")
            }
        }catch(error){
            console.log("Some error occured..");
            
        }finally{
            setloading(false)
        }
    }
    return (
        <div className='bg-gradient-to-br from-black/80  via-amber-400 border-b to-black/80 px-5'>
            <div className='flex justify-between items-center'>
                <img src={messenger} alt="" className='h-17 w-17' />
                <div className='flex justify-between gap-7'>
                    <NavLink
                        to="/add-member"
                        className={({ isActive }) =>
                            `px-5 py-2 rounded-full font-bold border border-black transition-all duration-300
     hover:scale-105 active:scale-95
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
                            `px-5 py-2 rounded-full font-bold border border-black transition-all duration-300
     hover:scale-105 active:scale-95
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
                            `px-5 py-2 rounded-full font-bold border border-black transition-all duration-300
     hover:scale-105 active:scale-95
    ${isActive
                                ? "bg-white text-black"
                                : "text-black hover:bg-white hover:text-black"
                            }`
                        }
                    >
                        Home
                    </NavLink>

                </div>
                <p className='font-semibold bg-green-400 rounded p-1 cursor-pointer transition-all duration-150
             hover:scale-110
             active:scale-105' onClick={()=>setisOpen(true)}>LogOut</p>
             {isOpen && <LogOut mainText={"LogOut"} descText={"Are you sure you want to logout?"} cancelText={"Cancel"} confirmText={"LogOut"} isOpen={isOpen} setisOpen={setisOpen} logOutHandleAndDelete={logOutHandle} loading={loading}/>}
            </div>
        </div>
    )
}

export default Navbar