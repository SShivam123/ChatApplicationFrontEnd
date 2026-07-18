import React from 'react'
import { PulseLoader } from 'react-spinners'

const OtpEnterPage = ({inuptRef, handleChange, handleKeyDown, handlePaste, OtpError, verifyOtpLoading, handleVerify}) => {
    return (
        <div className='bg-white/25 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-4'>
            <div>
                <h1 className='text-2xl text-center font-bold mb-2'>Email Verify Otp</h1>
                <p className='text-md text-center font-semibold mb-2'>Enter the 6-digit code sent to your email.</p>
            </div>
            <div className='flex justify-between gap-3 flex-nowrap items-center w-full mb-3'>
                {[...Array(6)].map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        ref={(el) => (inuptRef.current[index] = el)}
                        onChange={(e) => handleChange(e.target.value, index)}
                        className='outline-none w-12 h-11 text-2xl text-center border-zinc-300 border font-semibold rounded-lg'
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                    />
                ))}
            </div>
            {OtpError && <p className='text-red-500'>{OtpError}</p>}
            <div className='flex w-full'>
                <button className='border bg-blue-700 w-full text-white font-bold cursor-pointer px-3 py-1 rounded-md' disabled={verifyOtpLoading} onClick={handleVerify}>{verifyOtpLoading ? <PulseLoader size={10} color="#ffffff" /> : "Verify Email"}</button>
            </div>
        </div>
    )
}

export default OtpEnterPage
