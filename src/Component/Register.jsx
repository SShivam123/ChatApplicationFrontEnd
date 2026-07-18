import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { ClipLoader, PulseLoader } from "react-spinners";
import { generateKeyPair } from "../Crypto/keymaMnager";
import { encryptPrivateKey } from "../Crypto/E2ee";
import OtpEnterPage from "./OtpEnterpage";
import NameAndPassword from "./NameAndPassword";
import { MoveLeft } from "lucide-react";

const Register = () => {
    const navigate = useNavigate()
    const inuptRef = useRef([]);
    const [isEmailSent, setisEmailSent] = useState(false)
    const [isOtpSubmitted, setisOtpSubmitted] = useState(false)
    const [OtpError, setOtpError] = useState(null)
    const [verifyOtpLoading, setverifyOtpLoading] = useState(false)
    const [loading, setloading] = useState(false)
    const [EmailSendLoading, setEmailSendLoading] = useState(false)
    const [errors, seterrors] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
     const API_URL = import.meta.env.VITE_API_URL;
     console.log(API_URL);

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
        if (formData.password.trim().length < 6) {
            error.password = "password must 6 character is required"
        }
        seterrors(error)
        if (Object.keys(error).length > 0) {
            return;
        }

        try {
            const { publicKeyB64, privateKeyBuffer } = await generateKeyPair();
            const { encryptedPrivateKey, salt, iv } = await encryptPrivateKey(privateKeyBuffer, formData.password)
            setloading(true)
            let response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...formData, publicKey: publicKeyB64, encryptedPrivateKey, salt, iv })
            })
            let data = await response.json()
            if (response.status == 201) {
                navigate('/login')
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
        } finally {
            setloading(false)
        }
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        try {
            setEmailSendLoading(true)
            let response = await fetch(`${API_URL}/send-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email
                })
            })
            if (response.status == 200) {
                setisEmailSent(true)
                toast.success("Otp send successfully")
            } else {
                let data = await response.json()
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setEmailSendLoading(false)
        }
    }

    const handleChangeOtp = (value, index) => {
        if (!/^[0-9]?$/.test(value)) {
            inuptRef.current[index].value = "";
            return;
        } // only numbers allowed

        const newValue = value.replace(/\D/, "")

        // move to next
        if (newValue && index < 5) {
            inuptRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key == "Backspace" && !e.target.value && index > 0) {
            inuptRef.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text");
        if (!/^\d+$/.test(data)) return;
        const digits = data.slice(0, 6).split("");
        digits.forEach((digit, index) => {
            if (inuptRef.current[index]) {
                inuptRef.current[index].value = digit
            }
        });
        const next = digits.length < 6 ? digits.length : 5;
        inuptRef.current[next].focus();
    }

    const handleVerify = async () => {
        const otp = inuptRef.current.map(input => input.value).join("")
        if (otp.length != 6) {
            setOtpError("Please Enter valid 6 digit otp")
            return;
        }
        try {
            setverifyOtpLoading(true)
            let response = await fetch(`${API_URL}/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp: otp
                })
            })
            if (response.status == 200) {
                setisOtpSubmitted(true)
                toast.success("Otp verified successfully")
            } else {
                let data = await response.json()
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setverifyOtpLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-cyan-500 via-blue-500 via-purple-500 to-pink-500 px-4 py-8">

            {!isEmailSent && (

                <form
                    onSubmit={handleSendEmail}
                    className="bg-white/25 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl
                w-full max-w-[420px] p-6 sm:p-8"
                >
                    <div className="flex 2px hover:text-blue-400 cursor-pointer" onClick={() => navigate("/home")} >
                        <MoveLeft color="white" size={25} />
                        <h1 className="text-white">Go To Home</h1>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
                        Register Form
                    </h1>


                    <div className="flex flex-col gap-2 mb-5">

                        <label className="text-white font-semibold">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-white/80 outline-none focus:ring-2 focus:ring-pink-400"
                        />

                        {errors?.email && (
                            <p className="text-red-300 text-sm">
                                {errors.email}
                            </p>
                        )}

                    </div>

                    <button
                        type="submit"
                        disabled={EmailSendLoading}
                        className="w-full p-3 rounded-lg font-bold text-white
                    bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500
                    hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer"
                    >
                        {EmailSendLoading ? (
                            <PulseLoader color="white" size={10} />
                        ) : (
                            "Send OTP"
                        )}
                    </button>

                    <p className="text-center text-white mt-5 text-sm sm:text-base">

                        Already have an account?

                        <span
                            className="font-bold ml-1 cursor-pointer hover:underline"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>

                    </p>

                </form>

            )}

            {isEmailSent && !isOtpSubmitted && (
                <OtpEnterPage
                    inuptRef={inuptRef}
                    handleChange={handleChangeOtp}
                    handleKeyDown={handleKeyDown}
                    handlePaste={handlePaste}
                    handleVerify={handleVerify}
                    OtpError={OtpError}
                    verifyOtpLoading={verifyOtpLoading}
                />
            )}

            {isOtpSubmitted && isEmailSent && (
                <NameAndPassword
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    newPassword={formData.password}
                    name={formData.name}
                />
            )}

        </div>
    );
};

export default Register;