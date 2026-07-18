import React from "react";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router";

const Warning = ({setisWarning}) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex justify-center items-center">

            <div className="w-full max-w-lg bg-[#1b202b] border border-gray-600 rounded-2xl shadow-3xl p-4">

                {/* Icon */}

                <div className="flex justify-center">

                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex justify-center items-center">

                        <ShieldAlert
                            size={36}
                            className="text-red-500"
                        />

                    </div>

                </div>

                {/* Heading */}

                <h1 className="text-2xl font-bold text-center text-white mt-5">
                    Password Reset Warning
                </h1>

                <p className="text-center text-gray-400 text-sm mt-2">
                    Please read the following information carefully.
                </p>

                {/* Warning Box */}

                <div className="mt-6 bg-red-500/10 border border-red-500 rounded-xl p-4">

                    <ul className="text-gray-300 text-sm space-y-3 list-disc pl-5">

                        <li>Your encryption key will be replaced.</li>

                        <li>Previously encrypted chats and media will no longer be accessible.</li>

                        <li>This action cannot be undone.</li>

                        <li>Only new messages will be available after resetting your password.</li>

                    </ul>

                </div>

                {/* Buttons */}

                <div className="flex gap-4 mt-7">

                    <button
                        onClick={() => navigate("/login")}
                        className="flex-1 py-3 rounded-xl border border-gray-600 text-white hover:bg-gray-700 transition cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() =>setisWarning(false)}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold hover:scale-[1.03] transition cursor-pointer"
                    >
                        Continue
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Warning;