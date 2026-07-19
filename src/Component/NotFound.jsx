import React from "react";
import { SearchX } from "lucide-react";
import { useNavigate } from "react-router";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0c121f] flex items-center justify-center px-3">

            <div className="text-center max-w-lg">

                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 shadow-lg">
                        <SearchX size={40} className="text-cyan-400" />
                    </div>
                </div>

                {/* 404 */}
                <h1 className="text-8xl font-extrabold text-cyan-500 tracking-widest">
                    404
                </h1>

                {/* Heading */}
                <h2 className="text-3xl font-bold text-white mt-3">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="text-gray-400 mt-3 leading-7">
                    Oops! The page you're looking for doesn't exist,
                    has been moved, or the URL is incorrect.
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-4 mt-10">

                    <button
                        onClick={() => navigate("/")}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
                    >
                        Go Home
                    </button>

                    {/* <button
                        onClick={() => navigate(-1)}
                        className="border border-gray-600 text-gray-300 px-7 py-3 rounded-xl hover:bg-[#1b2435] transition-all cursor-pointer"
                    >
                        Go Back
                    </button> */}

                </div>

            </div>

        </div>
    );
}

export default NotFound;