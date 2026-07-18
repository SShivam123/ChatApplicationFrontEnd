import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useNavigate, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import { generateKeyPair } from "../Crypto/keymaMnager";
import { encryptPrivateKey } from "../Crypto/E2ee";

function ResetPassword() {
    const [searchParam] = useSearchParams()
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
     const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async () => {
        // console.log(newPassword);
        if (!newPassword || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        if(newPassword.includes(" ")){
            toast.error("Password does not contain space.")
            return;
        }else if(newPassword.length<6 || confirmPassword.length<6){
            toast.error("Password contains atleast 6 character..")
        }

        if (newPassword.trim() !== confirmPassword.trim()) {
            alert("Passwords do not match");
            return;
        }

       try {
            setLoading(true);
            const { publicKeyB64, privateKeyBuffer } = await generateKeyPair();
            const { encryptedPrivateKey, salt, iv } = await encryptPrivateKey(privateKeyBuffer, newPassword)
            let response = await fetch(`${API_URL}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password : newPassword,
                    token :searchParam.get("token"),
                    encryptedPrivateKey,
                    salt,
                    iv,
                    publicKey:publicKeyB64
                })
            })
            if (response.status == 200) {
                toast.success("Password reset successfully")
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
        <div className="min-h-screen bg-[#0c121f] flex justify-center items-center px-4">

            <div className="w-full max-w-md bg-[#303744] rounded-3xl shadow-2xl border border-gray-700 p-8">
            {/* <div>{searchParam.get("token")}</div> */}
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex justify-center items-center">
                        <Lock size={38} className="text-cyan-400" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-white">
                    Reset Password
                </h1>

                <p className="text-center text-gray-400 mt-3 text-sm leading-6">
                    Create a strong password to secure your account.
                </p>

                {/* New Password */}
                <div className="mt-8">
                    <label className="block text-gray-300 mb-2">
                        New Password
                    </label>

                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full bg-[#0e131f] border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-cyan-500"
                        />

                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="mt-5">
                    <label className="block text-gray-300 mb-2">
                        Confirm Password
                    </label>

                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full bg-[#0e131f] border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-cyan-500"
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showConfirm ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>

                    {confirmPassword &&
                        newPassword !== confirmPassword && (
                            <p className="text-red-500 text-sm mt-2">
                                Passwords do not match.
                            </p>
                        )}
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-xl text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-70"
                >
                    {loading ? (
                        <ClipLoader size={22} color="white" />
                    ) : (
                        "Update Password"
                    )}
                </button>

            </div>
        </div>
    );
}

export default ResetPassword;