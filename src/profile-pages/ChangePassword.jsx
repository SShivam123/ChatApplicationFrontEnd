import React, { useContext, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { chatContext } from "../Context/ContextProvider";
import { encryptPrivateKey } from "../Crypto/E2ee";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, seterror] = useState(null)
    const {decryptPrivateKeyFnc,pvtKeyResponse,privateKey} = useContext(chatContext)

    const handleSubmit = async () => {
        

        let errors = {};
        if (!oldPassword || oldPassword.trim() == "") {
            errors.oldPassword = "Old password is required"
        }
        else if (/\s/.test(oldPassword)) {
            errors.oldPassword = "pasword can not contain space"
        }
        if (!newPassword || newPassword.trim() == "") {
            errors.newPassword = "New password is required"
        } else if (/\s/.test(newPassword)) {
            errors.newPassword = "pasword can not contain space"
        } else if (newPassword.length < 6) {
            errors.newPassword = "New password must be 6 character"
        }
        else if (!confirmPassword || confirmPassword.trim() == "") {
            errors.confirmPassword = "Confirm Password is required"
        }
        else if (newPassword !== confirmPassword) {
            errors.confirmPassword = "New Password and Confirm Password do not match";
        }
        seterror(errors)
        if (Object.keys(errors).length > 0) {
            return;
        }

        let keyDetails = {
            encryptedPrivateKey: null,
            salt: null,
            iv: null
        }

        if (!privateKey) {
            const DecryptedPrivateKey = await decryptPrivateKeyFnc(pvtKeyResponse, oldPassword);
            if (!DecryptedPrivateKey) {
                console.log("Key decryption failed. Stopping execution.");
                return;
            }
            console.log(DecryptedPrivateKey instanceof CryptoKey);
            const privateKeyBuffer = await crypto.subtle.exportKey(
                "pkcs8",
                DecryptedPrivateKey
            );
            let { encryptedPrivateKey, salt, iv } = await encryptPrivateKey(privateKeyBuffer,newPassword);
            keyDetails.encryptedPrivateKey = encryptedPrivateKey;
            keyDetails.salt = salt;
            keyDetails.iv = iv;
        } else {
            console.log("Hello");
            console.log(typeof privateKey);
            
            const privateKeyBuffer = await crypto.subtle.exportKey(
                "pkcs8",
                privateKey && privateKey
            );
           
            
            let { encryptedPrivateKey, salt, iv } = await encryptPrivateKey(privateKeyBuffer,newPassword);
            
            keyDetails.encryptedPrivateKey = encryptedPrivateKey;
            keyDetails.salt = salt;
            keyDetails.iv = iv;
        }

        try {
            let response = await fetch("http://localhost:8080/changePasword", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    encryptedKey:keyDetails.encryptedPrivateKey,
                    iv:keyDetails.iv,
                    salt:keyDetails.salt
                })
            })
            if (response.status == 200) {
                toast.success("Password update succesfully")
                setOldPassword(""),
                    setNewPassword(""),
                    setConfirmPassword("")
            } else {
                let data = await response.json();
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    };

    return (
        <div className="h-[calc(100vh-70px)] bg-[#0c121f] flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-[#303744] rounded-3xl shadow-2xl border border-gray-800 p-6">

                <h1 className="text-3xl font-bold text-center text-white mb-8">
                    Change Password
                </h1>

                <div className="space-y-5">

                    {/* Old Password */}
                    <div>
                        <label className="block text-gray-300 mb-1 font-bold">
                            Old Password
                        </label>

                        <div className="relative">
                            <input
                                type={showOld ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="**********"
                                className="w-full bg-[#0e131f] border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-cyan-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowOld(!showOld)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            >
                                {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {error && error.oldPassword && <p className="text-red-500 text-sm mt-2">{error.oldPassword}</p>}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-gray-300 mb-1 font-bold">
                            New Password
                        </label>

                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="**********"
                                className="w-full bg-[#0e131f] border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-cyan-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            >
                                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {error && error.newPassword && <p className="text-red-500 text-sm mt-2">{error.newPassword}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-gray-300 mb-1 font-bold">
                            Confirm Password
                        </label>

                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="**********"
                                className="w-full bg-[#0e131f] border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-cyan-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            >
                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {error && error.confirmPassword && <p className="text-red-500 text-sm mt-2">{error.confirmPassword}</p>}
                        {/* {confirmPassword &&
                            newPassword !== confirmPassword && (
                                <p className="text-red-500 text-sm mt-2">
                                    Passwords do not match
                                </p>
                            )} */}
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-xl font-semibold text-white hover:scale-[1.02] transition-all duration-300 shadow-lg cursor-pointer"
                    >
                        Save Changes
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ChangePassword;