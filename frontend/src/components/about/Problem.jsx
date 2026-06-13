import React from 'react';
import { LeetCodeIcon, CodeforcesIcon, GitHubIcon } from '../icons/PlatformIcons';

const Problem = () => {
    return (
        <div className='w-full min-h-screen border-b-4 px-4 sm:px-6 py-16 sm:py-20 md:py-32 flex flex-col justify-center items-center gap-5' >
            <div className='flex flex-col lg:flex-row justify-center items-center [@media(min-width:1000px)_and_(max-width:1100px)]:flex-col'>
                <div className='flex flex-col max-w-4xl px-7 py-20 gap-10'>
                    <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-8xl text-center sm:text-start">The problem with fragmentation</h2>
                    <p className='text-2xl sm:text-3xl font-bold leading-none tracking-tight text-black'>  Developers track progress across multiple platforms but get an incomplete
  picture of their overall growth.</p>
                </div>
                <div className='border border-black '>
                    <div className='border-b p-3 px-10 flex items-center gap-5'>
                        <LeetCodeIcon/>
                        <div>
                            <h2 className='font-bold text-2xl'>LeetCode</h2>
                            <p className='max-w-[220px]'>Shows interview preparation but not real-world building.</p>
                        </div>
                    </div>
                    <div className='border-b p-3 px-10 flex items-center gap-5'>
                        <CodeforcesIcon/>
                        <div>
                            <h2 className='font-bold text-2xl'>Codeforces</h2>
                            <p className='max-w-[220px]'>Shows competitive programming but not for development skills.</p>
                        </div>
                    </div>
                    <div className='p-3 px-10 flex items-center gap-5'>
                        <GitHubIcon/>
                        <div>
                            <h2 className='font-bold text-2xl'>GitHub</h2>
                            <p className='max-w-[220px]'>Shows building ability but no problem-solving skills.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-2 border-dashed border-gray-500 p-5">
                <h2 className="text-xl uppercase leading-none tracking-tight text-black sm:text-2xl lg:text-2xl">
                    No single platform tells the complete story.
                </h2>
            </div>
        </div>
    )
}

export default Problem
