import React from "react";
import { useNavigate } from "react-router";
import { PulseLoader } from "react-spinners";

const LogOut = ({mainText,descText,cancelText,confirmText ,isOpen, setisOpen, logOutHandleAndDelete, loading }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-[350px] shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-3">
                    {mainText}
                </h2>

                <p className="text-gray-600 text-center mb-6">
                   {descText}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer" onClick={() => setisOpen(false)}
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={logOutHandleAndDelete}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                    >
                        {loading ? <PulseLoader /> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogOut;