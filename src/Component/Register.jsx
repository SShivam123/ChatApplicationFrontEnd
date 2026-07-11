import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
import { generateKeyPair } from "../Crypto/keymaMnager";
import { encryptPrivateKey } from "../Crypto/E2ee";

const Register = () => {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [errors, seterrors] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        let error = {};
        if (formData.name.trim().length == 0) {
            error.name = "name is required"
        }
        if (formData.email.trim().length < 2) {
            error.email = "email is required"
        }
        if (formData.password.trim().length < 6) {
            error.password = "password must 6 character is required"
        }
        seterrors(error)
        if (Object.keys(error).length > 0) {
            return;
        }

        try {
             const { publicKeyB64,privateKeyBuffer } = await generateKeyPair();
             const {encryptedPrivateKey,salt,iv} = await encryptPrivateKey(privateKeyBuffer,formData.password)
             setloading(true)
            let response = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...formData,publicKey:publicKeyB64,encryptedPrivateKey,salt,iv })
            })
            let data = await response.json()
            if (response.status == 201) {
                toast.success("User register successfully")
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                })
                console.log(data);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Something went wrong");
        }finally{
            setloading(false)
        }
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-cyan-500 via-blue-500 via-purple-500 to-pink-500">
            <form
                onSubmit={handleSubmit}
                className="bg-white/25 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 w-[400px]"
            >
                <h1 className="text-3xl font-bold text-center text-white ">
                    Register form
                </h1>

                <div className="flex flex-col gap-2 mb-1">
                    <label className="text-white font-semibold">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-white/80 outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    {errors && <p className="text-red-400">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-2 mb-1">
                    <label className="text-white font-semibold">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-white/80 outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    {errors && <p className="text-red-400">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-2 mb-6">
                    <label className="text-white font-semibold">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Create Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-white/80 outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    {errors && <p className="text-red-400">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full p-3 rounded-lg font-bold text-white bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer" disabled={loading}
                >
                    {loading ? <ClipLoader /> : "Create Account"}
                </button>

                <p className="text-center text-white mt-4">
                    Already have an account?
                    <span className="font-bold cursor-pointer ml-1 hover:underline" onClick={() => navigate("/login")}>
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Register;