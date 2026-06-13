import React from 'react'
import { Target, CodeXml, ChartNoAxesCombined, Users } from "lucide-react";

const Growth = () => {
    return (
        <div className='w-full min-h-screen border-b-4 px-4 sm:px-6 py-16 sm:py-20 md:py-32 flex flex-col justify-center items-center gap-10 md:gap-40'>
            <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-8xl text-center">Our growth philosophy</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 max-w-7xl'>
                    <div className='flex flex-col justify-center items-center gap-1 lg:gap-3'>
                        <Target size={64} />
                        <h2 className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-black text-center'>Consistency Beats Intensity</h2>
                        <p className='text-2xl text-center max-w-[260px]'>Small, consistent actions compound into extraordinary results.</p>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-1 lg:gap-3'>
                        <CodeXml size={64} />
                        <h2 className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-black text-center'>Solve. Build. Ship.</h2>
                        <p className='text-2xl text-center max-w-[260px]'>Problems build skills. Projects build identity. We value both equally</p>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-1 lg:gap-3'>
                        <ChartNoAxesCombined size={64} />
                        <h2 className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-black text-center'>Data Should Drive Growth</h2>
                        <p className='text-2xl text-center max-w-[260px]'>We can't improve what you don't measure.</p>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-1 lg:gap-3'>
                        <Users size={64} />
                        <h2 className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-black text-center'>Learning is a Lifelong Game</h2>
                        <p className='text-2xl text-center max-w-[260px]'>The journey never ends, and neither does growth.</p>
                    </div>
            </div>
        </div>
    )
}

export default Growth
