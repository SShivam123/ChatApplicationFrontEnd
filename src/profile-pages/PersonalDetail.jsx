import React, { useContext, useEffect, useState } from 'react'
import { chatContext } from '../Context/ContextProvider'
import { useNavigate } from 'react-router'
import EditProfile from '../profile-pages/EditProfile'
import ChangePassword from './ChangePassword'

const PersonalDetail = () => {
    const navigate = useNavigate()
    const [isView, setisView] = useState("details")
    const [isProfile, setisProfile] = useState(true)
    const{userData} = useContext(chatContext);
    useEffect(() => {
        console.log(userData);
    }, [userData])
    return (
        <div className="min-h-[calc(100vh-91px)] bg-gray-100 flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-amber-900">
            {isView=="details" &&
                <div className="bg-white shadow-xl rounded-2xl p-4 w-100">

                    <div className="flex flex-col items-center">
                        <img

                            src={userData?.imgUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt=""
                            className="h-28 w-28 rounded-full border-4 border-amber-400"
                        />

                        <h1 className="text-2xl font-bold mt-3">
                            {userData?.name}
                        </h1>

                        <p className="text-gray-500">
                            {userData?.email}
                        </p>
                    </div>

                    <div className="mt-6 space-y-3">

                        <div className="bg-gray-100 p-3 rounded-lg">
                            <span className="font-semibold">User ID:-</span>
                            <p>{userData?.userId}</p>

                        </div>

                        <div className="bg-gray-100 p-3 rounded-lg flex">
                            <span className="font-semibold">Joined:-</span>
                            <p>
                                {new Date(userData?.createdAt).toLocaleDateString()}

                            </p>
                        </div>

                    </div>

                    <div className="mt-6 flex flex-col gap-3">

                        <button className="bg-blue-500 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-600 font-bold" onClick={() => setisView("edit")}>
                            Edit Profile
                        </button>
                        <button className="bg-amber-400 cursor-pointer text-white py-2 rounded-lg hover:bg-amber-500 font-bold" onClick={() => setisView("change")}>
                            Change Password
                        </button>
                    </div>

                </div>}
            {isView=="edit" && <EditProfile setisView={setisView}/>}{isView=="change" && <ChangePassword setisView={setisView}/>}
        </div>
    )
}

export default PersonalDetail