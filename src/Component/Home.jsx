import React, { useState } from "react";
import {
    MessageCircle,
    ShieldCheck,
    User,
    Zap,
    ArrowRight,
    Menu,
    X,
    MessageSquareText
} from "lucide-react";
import { useNavigate } from "react-router";

const Home = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    // const [open, setOpen] = useState(false);
    return (
        <div>
            <nav className="sticky top-0 z-50 border-b border-gray-800 bg-[#0b1120]/95 backdrop-blur">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-5 sm:px-8 lg:px-8 py-5">
                    <div className="flex justify-center items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                            <MessageSquareText size={26} color="white" />
                        </div>
                        <h1
                            className="text-2xl md:text-3xl font-bold text-cyan-400 cursor-pointer"
                            onClick={() => navigate("/")}
                        >
                            ChatConnect
                        </h1>
                    </div>

                    {/* Desktop Menu */}

                    <div className="hidden lg:flex gap-8 text-gray-300">

                        <a href="#features" className="hover:text-cyan-400 text-xl">
                            Features
                        </a>

                        <a href="#tech" className="hover:text-cyan-400 text-xl">
                            Technology
                        </a>

                        <a href="#about" className="hover:text-cyan-400 text-xl">
                            About
                        </a>

                    </div>

                    {/* Desktop Buttons */}

                    <div className="hidden lg:flex gap-4">

                        <button
                            onClick={() => navigate("/login")}
                            className="px-5 py-2 border border-cyan-500 rounded-lg hover:bg-cyan-500 transition bg-white cursor-pointer"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="px-5 py-2 cursor-pointer bg-cyan-500 rounded-lg hover:bg-cyan-600 transition"
                        >
                            Register
                        </button>

                    </div>

                    {/* Mobile Menu Button */}

                    <button
                        className="lg:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
                    </button>

                </div>

                {/* Mobile Menu */}

                {menuOpen && (

                    <div className="lg:hidden bg-[#161f30] border-t text-white border-gray-700">

                        <div className="flex flex-col p-5 gap-5">

                            <a href="#features">Features</a>

                            <a href="#tech">Technology</a>

                            <a href="#about">About</a>

                            <button
                                onClick={() => navigate("/login")}
                                className="border border-cyan-500 rounded-lg py-3"
                            >
                                Login
                            </button>

                            <button
                                onClick={() => navigate("/register")}
                                className="bg-cyan-500 rounded-lg py-3"
                            >
                                Register
                            </button>

                        </div>

                    </div>

                )}

            </nav>
            {/* Hero Section */}

            <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 px-5 sm:px-8 lg:px-10 py-10 lg:py-14 bg-[#161f30]">

                {/* Left */}

                <div className="max-w-xl text-center lg:text-left">

                    <span className="inline-block bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm">
                        🚀 Real-Time Communication
                    </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-8 leading-tight text-white">
                        Connect,
                        <br />
                        Chat &
                        <span className="text-cyan-400"> Collaborate</span>
                    </h1>

                    <p className="mt-8 text-gray-400 leading-8 text-base sm:text-lg">
                        ChatConnect is a secure real-time messaging platform
                        where users can create rooms, chat instantly and
                        collaborate with their friends using WebSocket
                        technology.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 mt-10 justify-center lg:justify-start">

                        <button
                            onClick={() => navigate("/register")}
                            className="bg-cyan-500 px-4 py-2 rounded-xl hover:bg-cyan-600 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Get Started
                            <ArrowRight size={20} />
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="border border-gray-600 px-4 py-2 rounded-xl hover:bg-[#1b2435] text-cyan-400 transition cursor-pointer"
                        >
                            Login
                        </button>

                    </div>

                </div>

                {/* Right */}

                <div className="w-full flex justify-center">

                    <div className=" w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-700 bg-gray-500">

                        <div className="flex items-center gap-3 mb-6">

                            <img
                                src="https://ui-avatars.com/api/?name=Shivam"
                                className="w-12 h-12 rounded-full"
                                alt=""
                            />

                            <div>

                                <h2 className="font-semibold text-cyan-400">
                                    Shivam Sharma
                                </h2>

                                <p className="text-green-400 text-sm">
                                    ● Online
                                </p>

                            </div>

                        </div>

                        <div className="space-y-4">

                            <div className="bg-[#273449] text-white p-3 rounded-xl w-fit">
                                👋 Hello Everyone!
                            </div>

                            <div className="bg-cyan-500 text-black ml-auto p-3 rounded-xl w-fit">
                                Hi 👋
                            </div>

                            <div className="bg-[#273449] text-white p-3 rounded-xl w-fit">
                                Welcome to ChatConnect 🚀
                            </div>

                            <div className="bg-cyan-500 text-black ml-auto p-3 rounded-xl w-fit">
                                Amazing UI ❤️
                            </div>

                        </div>

                    </div>

                </div>

            </section>
            {/* Features */}

            <section
                id="features"
                className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-20 bg-[#1f2636]"
            >

                <div className="text-center">

                    <span className="text-cyan-400 uppercase tracking-widest text-sm">
                        Features
                    </span>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3 text-cyan-400">
                        Why Choose ChatConnect?
                    </h2>

                    <p className="text-gray-400 mt-5 max-w-2xl mx-auto leading-7">
                        Everything you need for fast, secure and real-time communication
                        in one modern chat application.
                    </p>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

                    {/* Card */}

                    <div className="bg-[#161f30] border border-gray-700 rounded-3xl p-8 text-center hover:-translate-y-2 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">

                        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex justify-center items-center mx-auto">

                            <MessageCircle
                                size={34}
                                className="text-cyan-400"
                            />

                        </div>

                        <h3 className="text-xl text-white font-semibold mt-6">
                            Real-Time Chat
                        </h3>

                        <p className="text-gray-400 mt-4 leading-7">
                            Instant messaging powered by WebSocket with
                            lightning-fast communication.
                        </p>

                    </div>

                    {/* Card */}

                    <div className="bg-[#161f30] border border-gray-700 rounded-3xl p-8 text-center hover:-translate-y-2 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">

                        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex justify-center items-center mx-auto">

                            <ShieldCheck
                                size={34}
                                className="text-cyan-400"
                            />

                        </div>

                        <h3 className="text-xl text-white font-semibold mt-6">
                            Secure Login
                        </h3>

                        <p className="text-gray-400 mt-4 leading-7">
                            JWT Authentication with encrypted passwords
                            using BCrypt.
                        </p>

                    </div>

                    {/* Card */}

                    <div className="bg-[#161f30] border border-gray-700 rounded-3xl p-8 text-center hover:-translate-y-2 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">

                        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex justify-center items-center mx-auto">

                            <User
                                size={34}
                                className="text-cyan-400"
                            />

                        </div>

                        <h3 className="text-xl text-white font-semibold mt-6">
                            Chat Rooms
                        </h3>

                        <p className="text-gray-400 mt-4 leading-7">
                            Create, manage and join multiple chat rooms
                            with your friends.
                        </p>

                    </div>

                    {/* Card */}

                    <div className="bg-[#161f30] border border-gray-700 rounded-3xl p-8 text-center hover:-translate-y-2 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">

                        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex justify-center items-center mx-auto">

                            <Zap
                                size={34}
                                className="text-cyan-400"
                            />

                        </div>

                        <h3 className="text-xl text-white font-semibold mt-6">
                            Lightning Fast
                        </h3>

                        <p className="text-gray-400 mt-4 leading-7">
                            Optimized backend APIs and smooth UI for
                            the best chatting experience.
                        </p>

                    </div>

                </div>

            </section>
            {/* Technology */}

            <section
                id="tech"
                className="bg-[#121a2b] py-20"
            >

                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">

                    <div className="text-center">

                        <span className="text-cyan-400 uppercase tracking-widest text-sm">
                            Tech Stack
                        </span>

                        <h2 className="text-3xl text-cyan-400 md:text-4xl lg:text-5xl font-bold mt-3">
                            Technologies We Used
                        </h2>

                        <p className="text-gray-400 mt-5 max-w-2xl mx-auto leading-7">
                            ChatConnect is built using modern technologies
                            for security, scalability and real-time communication.
                        </p>

                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mt-16">

                        <div className="bg-[#1d2940] rounded-2xl p-6 border border-gray-700 hover:border-cyan-500 hover:-translate-y-2 transition-all duration-300 text-center">
                            <img
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                                className="w-14 h-14 mx-auto"
                                alt=""
                            />
                            <h3 className="mt-5 text-white font-semibold">
                                React
                            </h3>
                        </div>

                        <div className="bg-[#1d2940] rounded-2xl p-6 border border-gray-700 hover:border-cyan-500 hover:-translate-y-2 transition-all duration-300 text-center">
                            <img
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"
                                className="w-14 h-14 mx-auto"
                                alt=""
                            />
                            <h3 className="mt-5 text-white font-semibold">
                                Spring Boot
                            </h3>
                        </div>

                        <div className="bg-[#1d2940] rounded-2xl p-6 border border-gray-700 hover:border-cyan-500 hover:-translate-y-2 transition-all duration-300 text-center">
                            <img
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
                                className="w-14 h-14 mx-auto"
                                alt=""
                            />
                            <h3 className="mt-5 text-white font-semibold">
                                MySQL
                            </h3>
                        </div>

                        <div className="bg-[#1d2940] rounded-2xl p-6 border border-gray-700 hover:border-cyan-500 hover:-translate-y-2 transition-all duration-300 text-center">
                            <img
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                                className="w-14 h-14 mx-auto"
                                alt=""
                            />
                            <h3 className="mt-5 text-white font-semibold">
                                JavaScript
                            </h3>
                        </div>

                        <div className="bg-[#1d2940] rounded-2xl p-6 border border-gray-700 hover:border-cyan-500 hover:-translate-y-2 transition-all duration-300 text-center">
                            <img
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
                                className="w-14 h-14 mx-auto"
                                alt=""
                            />
                            <h3 className="mt-5 text-white font-semibold">
                                Java
                            </h3>
                        </div>

                        <div className="bg-[#1d2940] rounded-2xl p-6 border border-gray-700 hover:border-cyan-500 hover:-translate-y-2 transition-all duration-300 text-center">
                            <div className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center mx-auto text-black font-bold text-xl">
                                WS
                            </div>

                            <h3 className="mt-5 text-white font-semibold">
                                WebSocket
                            </h3>
                        </div>

                    </div>

                </div>

            </section>

            {/* How It Works */}

            <section
                id="how"
                className="py-15 bg-[#1f2636]"
            >

                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">

                    <div className="text-center">

                        <span className="text-cyan-400 uppercase tracking-widest text-sm">
                            Process
                        </span>

                        <h2 className="text-3xl text-cyan-400 md:text-4xl lg:text-5xl font-bold mt-3">
                            How ChatConnect Works
                        </h2>

                        <p className="text-gray-400 mt-5 max-w-2xl mx-auto">
                            Get started in just a few simple steps and enjoy secure
                            real-time messaging.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mt-20">

                        {/* Step 1 */}

                        <div className="relative bg-[#0c131f] rounded-3xl p-8 text-center border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:-translate-y-2">

                            <div className="w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold text-xl mx-auto">
                                1
                            </div>

                            <h3 className="mt-6 text-white text-xl font-semibold">
                                Register
                            </h3>

                            <p className="text-gray-400 mt-3">
                                Create your account within seconds.
                            </p>

                        </div>

                        {/* Step 2 */}

                        <div className="relative bg-[#0c131f] rounded-3xl p-8 text-center border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:-translate-y-2">

                            <div className="w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold text-xl mx-auto">
                                2
                            </div>

                            <h3 className="mt-6 text-white text-xl font-semibold">
                                Login
                            </h3>

                            <p className="text-gray-400 mt-3">
                                Secure login using JWT Authentication.
                            </p>

                        </div>

                        {/* Step 3 */}

                        <div className="relative bg-[#0c131f] rounded-3xl p-8 text-center border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:-translate-y-2">

                            <div className="w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold text-xl mx-auto">
                                3
                            </div>

                            <h3 className="mt-6 text-white text-xl font-semibold">
                                Create Room
                            </h3>

                            <p className="text-gray-400 mt-3">
                                Generate your own private chat room.
                            </p>

                        </div>

                        {/* Step 4 */}

                        <div className="relative bg-[#0c131f] rounded-3xl p-8 text-center border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:-translate-y-2">

                            <div className="w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold text-xl mx-auto">
                                4
                            </div>

                            <h3 className="mt-6 text-white text-xl font-semibold">
                                Invite Friends
                            </h3>

                            <p className="text-gray-400 mt-3">
                                Share the room ID and start chatting.
                            </p>

                        </div>

                        {/* Step 5 */}

                        <div className="relative bg-[#0c131f] rounded-3xl p-8 text-center border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:-translate-y-2">

                            <div className="w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold text-xl mx-auto">
                                5
                            </div>

                            <h3 className="mt-6 text-white text-xl font-semibold">
                                Enjoy
                            </h3>

                            <p className="text-gray-400 mt-3">
                                Chat instantly with everyone in real time.
                            </p>

                        </div>

                    </div>

                </div>

            </section>
            {/* CTA */}

            <section
                id="about"
                className="py-10 bg-gradient-to-b "
            >

                <div className="max-w-5xl mx-auto px-5">

                    <div className="bg-[#161f30] border border-cyan-500/30 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-cyan-500/10">

                        <span className="inline-block bg-cyan-500/20 text-cyan-400 px-5 py-2 rounded-full text-sm tracking-wider">
                            🚀 JOIN TODAY
                        </span>

                        <h2 className="text-4xl text-white md:text-5xl lg:text-6xl font-bold mt-8 leading-tight">
                            Ready to Start
                            <span className="text-cyan-400">
                                {" "}Chatting?
                            </span>

                        </h2>

                        <p className="text-gray-400 mt-8 text-lg leading-8 max-w-2xl mx-auto">

                            Join thousands of users who are already using
                            ChatConnect for secure and lightning-fast
                            conversations.

                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-5 mt-12">

                            <button
                                onClick={() => navigate("/register")}
                                className="bg-cyan-500 hover:bg-cyan-600 px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
                            >
                                Create Free Account
                            </button>

                            <button
                                onClick={() => navigate("/login")}
                                className="border border-cyan-500 hover:bg-cyan-500 px-10 py-4 rounded-xl text-white text-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                            >
                                Login
                            </button>

                        </div>

                    </div>

                </div>

            </section>
            {/* Footer */}

            <footer className="bg-[#08101d] border-t border-gray-800">

                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-14">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                        <div>

                            <h2 className="text-3xl font-bold text-cyan-400">
                                ChatConnect
                            </h2>

                            <p className="text-gray-400 mt-5 leading-7">

                                A modern real-time chat application
                                built using React, Spring Boot,
                                WebSocket and JWT Authentication.

                            </p>

                        </div>

                        <div>

                            <h3 className="text-cyan-400 text-xl font-semibold mb-5">
                                Quick Links
                            </h3>

                            <div className="space-y-3 text-gray-400 flex flex-col gap-2">
                                 <a href="#home" className="hover:text-cyan-400 cursor-pointer">
                                    Home
                                </a>

                                <a href="#features" className="hover:text-cyan-400 cursor-pointer">
                                    Features
                                </a>

                                <a href="#Tech" className="hover:text-cyan-400 cursor-pointer">
                                    Technology
                                </a>

                                <a href="#about" className="hover:text-cyan-400 cursor-pointer">
                                    About
                                </a>

                            </div>

                        </div>

                        <div>

                            <h3 className="text-cyan-400 text-xl font-semibold mb-5">
                                Tech Stack
                            </h3>

                            <div className="flex flex-wrap gap-3">

                                <span className="bg-[#919296] px-4 py-2 rounded-lg">
                                    React
                                </span>

                                <span className="bg-[#919296] px-4 py-2 rounded-lg">
                                    Spring Boot
                                </span>

                                <span className="bg-[#919296] px-4 py-2 rounded-lg">
                                    WebSocket
                                </span>

                                <span className="bg-[#919296] px-4 py-2 rounded-lg">
                                    JWT
                                </span>

                                <span className="bg-[#919296] px-4 py-2 rounded-lg">
                                    MySQL
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-white">

                        © 2026 ChatConnect • Built with ❤️ using React & Spring Boot

                    </div>

                </div>

            </footer>
        </div>
    )
}

export default Home