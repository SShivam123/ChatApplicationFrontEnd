import React, { useState } from "react";
import { Mail } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Warning from "../Component/Warning";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isWarning, setisWarning] = useState(true)
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL;


    const handleSubmit = async () => {
        if (!email.trim()) {
            alert("Please enter your email");
            return;
        }
        try {
            setLoading(true);
            let response = await fetch(`${API_URL}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email
                })
            })
            if (response.status == 200) {
                toast.success("Password reset link send successfully")
                navigate('/login')
            } else {
                let data = await response.json()
                toast.error(data.message)
            }
            // console.log(email);

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-91px)] w-full flex justify-center items-center bg-gradient-to-br from-cyan-500 via-blue-500 via-purple-500 to-pink-500 px-4 py-8">
            {!isWarning ?
                <div className="w-full max-w-md border border-white/20 rounded-3xl shadow-2xl backdrop-blur-lg bg-white/10 p-4 sm:p-8">
                    <div className="flex justify-center mb-3">
                        <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex justify-center items-center">
                            <Mail size={40} className="text-cyan-400" />
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
                        Forgot Password
                    </h1>

                    <p className="text-gray-300 text-center mt-3 text-sm sm:text-base leading-6">
                        Enter your registered email address and we'll send you
                        instructions to reset your password.
                    </p>

                    <div className="mt-4">
                        <label className="text-gray-300 block mb-1">
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0e131f] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-cyan-500 transition"
                            />

                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-xl text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-70"
                        >
                            {loading ? (
                                <ClipLoader size={22} color="white" />
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>

                    </div>

                    <div className="mt-5 text-center">

                        <span className="text-gray-300 text-sm">
                            Remember your password?
                        </span>

                        <button
                            onClick={() => navigate("/login")}
                            className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer hover:underline"
                        >
                            Login
                        </button>

                    </div>

                </div>
                : <Warning setisWarning={setisWarning} />
            }
        </div>
    );
}

export default ForgotPassword;