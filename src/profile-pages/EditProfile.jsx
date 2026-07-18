import React, { useContext, useState, useEffect } from "react";
import { Camera, MoveLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { chatContext } from "../Context/ContextProvider";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function EditProfile({setisView}) {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const { userData, setuserData } = useContext(chatContext);
    const [ProfileImage, setProfileImage] = useState(null)
    const [name, setName] = useState("");
     const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (userData) {
            console.log(userData);
            setName(userData.name);
        }
    }, [userData]);


    // useEffect(() => {
    //     if (userData?.imgUrl) {
    //         setimage(`http://localhost:8080${userData.imgUrl}`);
    //     }
    // }, [userData]);

    useEffect(() => {
        if (userData && userData.imgUrl) {
            // Database se jo aa raha hai, use bina localhost jode seedha set kar do
            setimage(userData.imgUrl);
        }
    }, [userData]);
    const [image, setimage] = useState(userData?.imgUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png");
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setimage(URL.createObjectURL(file))
        }
    };

    const handleSubmit = async () => {

        let formdata = new FormData();
        formdata.append("name", name)
        formdata.append("image", ProfileImage)
        try {
            setloading(true)
            let response = await fetch(`${API_URL}/editprofile`, {
                credentials: 'include',
                method: "POST",
                body: formdata
            })
            if (response.ok) {
                response = await response.json();
                toast.success("Update successfully")
                setuserData(response)

            }

        } catch (error) {
            toast.error("Something went wrong..")
        } finally {
            setloading(false)
        }
    };

    return (
        // <div className="h-[calc(100vh-70px)] bg-[#0c121f] flex justify-center items-center p-4">
            <div className="w-100 bg-[rgb(48,55,68)] rounded-3xl shadow-2xl border border-gray-800 p-5">
                <div className="relative">
                    <MoveLeftIcon color="white" size={30} onClick={()=> setisView("details") } className="cursor-pointer absolute left-5 "/>
                    <h1 className="text-3xl font-bold text-center text-white mb-5">
                        Edit Profile
                    </h1>
                </div>
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <img
                            src={image}
                            alt=""
                            className="w-30 h-30 rounded-full object-cover border-4 border-cyan-500"
                        />
                        <label
                            htmlFor="profile"
                            className="absolute bottom-2 right-2 bg-cyan-500 p-2 rounded-full cursor-pointer hover:scale-110 transition-all"
                        >
                            <Camera size={18} color="white" />
                        </label>
                        <input
                            type="file"
                            id="profile"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <p className="text-gray-400 text-sm mt-3">
                        Change Profile Picture
                    </p>
                </div>
                <div className="mt-8 space-y-5">
                    <div>
                        <label className="block text-gray-300 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#0e131f] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-xl font-semibold text-white hover:scale-[1.02] transition-all duration-300 shadow-lg cursor-pointer" disabled={loading}
                    // onClick={() => navigate("profile/personal-detail")}
                    >
                        {loading ? <ClipLoader /> : "Save Changes"}
                    </button>
                </div>
            </div>
        // </div>
    );
}

export default EditProfile;

