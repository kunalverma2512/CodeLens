import React from 'react'
import { Check } from "lucide-react";

const Commitment = () => {
    return (
        <div className='w-full min-h-screen border-b-4 px-4 sm:px-6 py-16 sm:py-20 md:py-32 flex justify-center items-center'>
            <div className='flex flex-col gap-10'>
                <div>
                    <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-8xl text-center sm:text-start ">Built in the open. For everyone.</h2>
                </div>
                <div>
                    <p className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-black text-center sm:text-start max-w-2xl'>CodeLens is 100% open source and will always remain so.</p>
                </div>
                <div className='text-2xl'>
                    <ul className='list-none'>
                        <li className='flex gap-2'><Check />MIT Licensed</li>
                        <li className='flex gap-2'><Check />Transparent Development</li>
                        <li className='flex gap-2'><Check />Community Driven</li>
                        <li className='flex gap-2'><Check />No Vendor Lock-in</li>
                        <li className='flex gap-2'><Check />Built by Developers, for Developers</li>
                    </ul>
                </div>
            </div>
            <div>
                <img src="/about-commitment-image.png" alt="CodeLens ecosystem" className="hidden lg:block" />
            </div>
        </div>
    )
}

export default Commitment
