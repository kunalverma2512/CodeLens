import React from 'react'
import {
    ShieldCheck,
    Lock,
    EyeOff
} from "lucide-react";

const Privacy = () => {
    return (
        <div className=' w-full min-h-screen border-b-4 px-4 sm:px-6 py-16 sm:py-20 md:py-32 flex flex-col lg:flex-row justify-center items-center gap-16 lg:gap-24'>
            <div className='flex flex-col gap-20'>
                <div className='flex flex-col gap-10 justify-center items-center lg:items-start'>
                    <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-8xl text-center lg:text-start max-w-3xl">Your Privacy. Our Priority.</h2>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl'>
                    <div className='flex flex-col justify-center items-center gap-1 lg:gap-3'>
                        <ShieldCheck size={64} />
                        <p className='text-2xl text-center max-w-[260px]'>We never sell, rent, or share your personal data.</p>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-1 lg:gap-3'>
                        <Lock size={64} />
                        <p className='text-2xl text-center max-w-[260px]'>All account connections are encrypted and protected.</p>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-1 lg:gap-3'>
                        <EyeOff size={64} />
                        <p className='text-2xl text-center max-w-[260px]'>Your data is used solely to power insights and recommendations.</p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center border-4 border-black bg-white text-black p-10 gap-2 shadow-[10px_10px_0_0_rgba(0,0,0,1)]'>
                <div className='border-2 rounded-full inline-flex justify-center items-center p-5'>
                    <Lock size={48} />
                </div>
                <h2 className="font-bold text-xl">You Own Your Data</h2>
                <p className='max-w-[220px] text-center'>Disconnect accounts or delete your data whenever you choose.</p>
            </div>

        </div>
    )
}

export default Privacy
