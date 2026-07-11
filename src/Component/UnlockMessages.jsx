import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

const UnlockMessages = ({handleUnlockChat,password,setPassword}) => {
  const [showPassword, setShowPassword] = useState(false);

 
  return (
    <div className="min-h-[calc(100vh-68px)] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <ShieldCheck className="text-indigo-400" size={42} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white text-center mt-6">
          Unlock Secure Chat
        </h1>

        <p className="text-gray-300 text-center mt-2 text-sm">
          Enter your password to decrypt and access your secure messages.
        </p>

        {/* Password */}
        <div className="mt-8 relative">
          <Lock
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 border border-gray-600 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Button */}
        <button
          onClick={handleUnlockChat}
          className="mt-8 w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-indigo-500/40"
        >
          🔓 Unlock Messages
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Your messages remain end-to-end encrypted and secure.
        </p>
      </div>
    </div>
  );
};

export default UnlockMessages;