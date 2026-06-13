import React from 'react'
import { GitFork, Star, UserRoundPlus, GitPullRequest  } from "lucide-react";

const Community = () => {
    return (
        <div className='w-full min-h-screen border-b-4 px-4 sm:px-6 py-16 sm:py-20 md:py-32 flex flex-col lg:flex-row justify-center items-center gap-20'>
            <div className='flex flex-col gap-10 justify-center items-center lg:items-start'>
                    <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-8xl text-center lg:text-start max-w-3xl">A community that builds together</h1>
                    <p className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-black text-center lg:text-start max-w-2xl'>CodeLens is more than a platform - it's a community of builders, learners, and problem solvers.</p>
                <button onClick={() => { const win = window.open("https://github.com/...", "_blank"); if (win) win.opener = null;}} className='cursor-pointer w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-3 bg-white text-black text-lg font-black uppercase hover:bg-gray-300 transition-colors border-4 border-black rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-none sm:hover:-translate-y-1 sm:hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]'>Join Community ➜</button>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 w-full max-w-[420px] aspect-square border border-black">
                <div className="p-6 border-r border-b flex flex-col justify-between">
                    <UserRoundPlus size={56} />
                    <div>
                        <p className="font-extrabold text-4xl">20+</p>
                        <p className="font-bold text-xl">Contributors</p>
                    </div>
                </div>

                <div className="p-6 border-b flex flex-col justify-between">
                    <Star size={56} />
                    <div>
                        <p className="font-extrabold text-4xl">20+</p>
                        <p className="font-bold text-xl">Stars</p>
                    </div>
                </div>

                <div className="p-6 border-r flex flex-col justify-between">
                    <GitFork size={56} />
                    <div>
                        <p className="font-extrabold text-4xl">45+</p>
                        <p className="font-bold text-xl">Forks</p>
                    </div>
                </div>

                <div className="p-6 flex flex-col justify-between">
                    <GitPullRequest  size={56} />
                    <div>
                        <p className="font-extrabold text-4xl">50+</p>
                        <p className="font-bold text-xl">Pull Requests</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Community
