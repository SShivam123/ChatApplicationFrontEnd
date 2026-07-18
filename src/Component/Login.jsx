import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
import { chatContext } from "../Context/ContextProvider";
import { MoveLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate()
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [errors, seterrors] = useState(null)
  const [loading, setloading] = useState(false)
  const { getProfile, setisLoggedIn, fetchEncryptedPrivateKey, decryptPrivateKeyFnc, privateKey, setPrivateKey, pvtKeyResponse } = useContext(chatContext)
   const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = {};
    if (email.trim().length < 2) {
      error.email = "email is required"
    }
    if (password.trim().length < 6) {
      error.password = "password must 6 character is required"
    }

    seterrors(error)
    if (Object.keys(error).length > 0) {
      return;
    }

    try {
      setloading(true)
      let response = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })
      let data = await response.json()
      if (response.status == 200) {
        setisLoggedIn(true)
        navigate("/")
        toast.success("User login successfully")
        await getProfile()
        let data = await fetchEncryptedPrivateKey()
        if (data) {
          await decryptPrivateKeyFnc(data, password)
        }
        console.log(data);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setloading(false)
      setemail("");
      setpassword("");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-cyan-500 via-blue-500 via-purple-500 to-pink-500 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl rounded-2xl
      w-full max-w-[400px] p-6 sm:p-8"
      >
        <div className="flex 2px hover:text-blue-400 cursor-pointer" onClick={() => navigate("/home")} >
          <MoveLeft color="white"  size={25} />
            <h1 className="text-white">Go To Home</h1>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
          Login Form
        </h1>

        {/* Email */}

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-white font-semibold">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/70 outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {errors?.email && (
            <p className="text-red-300 text-sm">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}

        <div className="flex flex-col gap-2 mb-6">

          <label className="text-white font-semibold">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/70 outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <Link
            to="/forgotPassword"
            className="text-white text-sm hover:underline w-fit"
          >
            Forgot Password?
          </Link>

          {errors?.password && (
            <p className="text-red-300 text-sm">
              {errors.password}
            </p>
          )}

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 rounded-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer"
        >
          {loading ? <ClipLoader color="white" size={22} /> : "Login"}
        </button>

        <p className="text-center text-white mt-5 text-sm sm:text-base">
          Don't have an account?{" "}
          <span
            className="font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;