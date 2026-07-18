import { UserKey } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'
import { PulseLoader } from 'react-spinners'

const NameAndPassword = ({ loading,handleChange,handleSubmit, newPassword ,name,password}) => {
    return (
        <div className='flex w-100 gap-2 bg-white/25 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-4 flex-col'>
            <div>
                <h1 className='text-md text-center font-bold text-2xl'>Enter the name and password</h1>
            </div>
            <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label className="text-black font-semibold mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={name}
                        onChange={handleChange}
                        className="w-full flex items-center rounded-full bg-zinc-200 p-2.5"
                    />
                    {/* {errors && <p className="text-red-400">{errors.name}</p>} */}
                </div>
                <div className='w-full flex items-center rounded-full bg-zinc-200'>
                    <UserKey className='ml-3 mr-2' />
                    <input type="password"
                        placeholder="**********"
                        className='outline-none w-full  px-2 pr-4 py-2 placeholder-black/80 rounded-r-full'
                        value={newPassword}
                        name='password'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='flex w-full'>
                    <button className='border bg-blue-700 w-full text-white font-bold cursor-pointer px-3 py-1 rounded-md' disabled={loading}>{loading ? <PulseLoader loading={true} size={10} color="#ffffff" /> : "Submit"}</button>
                </div>
            </form>
        </div>
    )
}

export default NameAndPassword
