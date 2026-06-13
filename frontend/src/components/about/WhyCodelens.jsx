import React from 'react'
import { CircleUserRound,Users,TrendingUp  } from "lucide-react";

const WhyCodelens = () => {
    return (
        <div className='w-full min-h-screen border-b-4 px-4 sm:px-6 py-16 sm:py-20 md:py-32'>
            <div className='flex flex-col justify-center items-center gap-5'>
                <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-8xl text-center">Why we built Codelens</h2>
                <p className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-black text-center  max-w-3xl'>We were developers who faced same problems. Multiple platforms, scattered progress, unclear next steps.</p>
                <div className='sm:flex sm:flex-col bg-black p-5 px-10 lg:px-32 justify-center items-center gap-3'>
                    <p className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-white text-center'>Codelens was created to unify everything and give developers a single source of clarity.</p>
                </div>
                <div className='flex flex-col lg:flex-row gap-5 sm:gap-15 lg:gap-20'>
                    <div className='flex flex-col justify-center items-center gap-1 lg:gap-3 w-64'>
                        <CircleUserRound size={64}/>
                        <h2 className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-black text-center'>One Profile</h2>
                        <p className='text-2xl text-center max-w-[220px]'>All your progress in one place.</p>
                    </div>
                    <div className='border hidden lg:block'></div>
                    <div className='flex flex-col justify-center items-center gap-1 lg:gap-3 w-64'>
                        <Users size={64}/>
                        <h2 className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-black text-center'>AI Guidance</h2>
                        <p className='text-2xl text-center max-w-[220px]'>Personalised roadmap based on your data.</p>
                    </div>
                    <div className='border hidden lg:block'></div>
                    <div className='flex flex-col justify-center items-center gap-1 lg:gap-3 w-64'>
                        <TrendingUp size={64}/>
                        <h2 className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-black text-center'>Actionable Growth</h2>
                        <p className='text-2xl text-center max-w-[220px]'>Focus on what matters for real improvement.</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default WhyCodelens
