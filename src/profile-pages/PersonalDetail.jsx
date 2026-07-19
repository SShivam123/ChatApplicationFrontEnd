import React, { useContext, useEffect, useState } from 'react'
import { chatContext } from '../Context/ContextProvider'
import { useNavigate } from 'react-router'
import EditProfile from '../profile-pages/EditProfile'
import ChangePassword from './ChangePassword'

const PersonalDetail = () => {
    const navigate = useNavigate()
    const [isView, setisView] = useState("details")
    const [isProfile, setisProfile] = useState(true)
    const { userData } = useContext(chatContext);
    useEffect(() => {
        console.log(userData);
    }, [userData])
    // return (
    //     <div className="min-h-[calc(100vh-91px)] bg-gray-100 flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-amber-900">
    //         {isView=="details" &&
    //             <div className="bg-white shadow-xl rounded-2xl p-4 w-100">

    //                 <div className="flex flex-col items-center">
    //                     <img

    //                         src={userData?.imgUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
    //                         alt=""
    //                         className="h-28 w-28 rounded-full border-4 border-amber-400"
    //                     />

    //                     <h1 className="text-2xl font-bold mt-3">
    //                         {userData?.name}
    //                     </h1>

    //                     <p className="text-gray-500">
    //                         {userData?.email}
    //                     </p>
    //                 </div>

    //                 <div className="mt-6 space-y-3">

    //                     <div className="bg-gray-100 p-3 rounded-lg">
    //                         <span className="font-semibold">User ID:-</span>
    //                         <p>{userData?.userId}</p>

    //                     </div>

    //                     <div className="bg-gray-100 p-3 rounded-lg flex">
    //                         <span className="font-semibold">Joined:-</span>
    //                         <p>
    //                             {new Date(userData?.createdAt).toLocaleDateString()}

    //                         </p>
    //                     </div>

    //                 </div>

    //                 <div className="mt-6 flex flex-col gap-3">

    //                     <button className="bg-blue-500 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-600 font-bold" onClick={() => setisView("edit")}>
    //                         Edit Profile
    //                     </button>
    //                     <button className="bg-amber-400 cursor-pointer text-white py-2 rounded-lg hover:bg-amber-500 font-bold" onClick={() => setisView("change")}>
    //                         Change Password
    //                     </button>
    //                 </div>

    //             </div>}
    //         {isView=="edit" && <EditProfile setisView={setisView}/>}{isView=="change" && <ChangePassword setisView={setisView}/>}
    //     </div>
    // )

    return (
        <div className="min-h-[calc(100vh-91px)] bg-gradient-to-br from-black via-gray-900 to-amber-900 flex justify-center items-center px-2 py-3">

            {isView === "details" && (

                <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-3">

                    {/* Profile */}
                    <div className="flex flex-col items-center">

                        <img
                            src={
                                userData?.imgUrl ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-400 object-cover"
                        />

                        <h1 className="text-xl sm:text-2xl font-bold mt-4 text-center break-words">
                            {userData?.name}
                        </h1>

                        <p className="text-gray-500 text-sm text-center break-all">
                            {userData?.email}
                        </p>

                    </div>

                    {/* Details */}
                    <div className="mt-6 space-y-4">

                        <div className="bg-gray-100 rounded-xl p-2">

                            <h3 className="font-semibold text-gray-700 mb-1">
                                User ID
                            </h3>

                            <p className="text-sm break-all text-gray-600">
                                {userData?.userId}
                            </p>

                        </div>

                        <div className="bg-gray-100 rounded-xl p-2">
                            <h3 className="font-semibold text-gray-700 mb-1">
                                Joined
                            </h3>

                            <p className="text-sm text-gray-600">
                                {new Date(userData?.createdAt).toLocaleDateString()}
                            </p>

                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="mt-4 flex flex-col gap-2">

                        <button
                            onClick={() => setisView("edit")}
                            className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition cursor-pointer"
                        >
                            Edit Profile
                        </button>

                        <button
                            onClick={() => setisView("change")}
                            className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-white font-semibold transition cursor-pointer"
                        >
                            Change Password
                        </button>

                    </div>

                </div>

            )}

            {isView === "edit" && (
                <EditProfile setisView={setisView} />
            )}

            {isView === "change" && (
                <ChangePassword setisView={setisView} />
            )}

        </div>
    );
}

export default PersonalDetail