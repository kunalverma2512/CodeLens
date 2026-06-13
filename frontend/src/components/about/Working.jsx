import { Database, RefreshCw, Brain, Rocket } from 'lucide-react'
import React from 'react'

const Working = () => {
    return (
        <div className=' w-full min-h-screen border-b-4 px-4 sm:px-6 py-16 sm:py-20 md:py-32 flex flex-col gap-20'>
            <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-8xl text-center">How Codelens Works</h1>
            <div className='lg:flex lg:justify-center lg:items-center grid grid-cols-1 sm:grid-cols-2 '>
                <div className='flex flex-col justify-center items-center border-4 border-black bg-white text-black p-10 gap-2 shadow-[10px_10px_0_0_rgba(0,0,0,1)]'>
                    <div className='border-2 rounded-full inline-flex justify-center items-center p-5'>
                        <RefreshCw size={48} />
                    </div>
                    <h2  className="font-bold text-xl">1. Connect</h2>
                    <p className='max-w-[220px] text-center'>Link your GitHub, LeetCode and Codeforces accounts securely.</p>
                </div>
                <svg className='hidden lg:block' width="120" height="10" viewBox="0 0 120 10">
                    <line
                        x1="0"
                        y1="5"
                        x2="120"
                        y2="5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />
                </svg>

                <div className='flex flex-col justify-center items-center border-4 border-black bg-white text-black p-10 gap-2 shadow-[10px_10px_0_0_rgba(0,0,0,1)]'>
                    <div className='border-2 rounded-full inline-flex justify-center items-center p-5'>
                        <Database size={48} />
                    </div>
                    <h2  className="font-bold text-xl">2. Sync</h2>
                    <p className='max-w-[220px] text-center'>We fetch and normalize your data in real-time.</p>
                </div>
                <svg className='hidden lg:block' width="120" height="10" viewBox="0 0 120 10">
                    <line
                        x1="0"
                        y1="5"
                        x2="120"
                        y2="5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />
                </svg>
                <div className='flex flex-col justify-center items-center border-4 border-black bg-white text-black p-10 gap-2 shadow-[10px_10px_0_0_rgba(0,0,0,1)]'>
                    <div className='border-2 rounded-full inline-flex justify-center items-center p-5'>
                        <Brain size={48} />
                    </div>
                    <h2 className="font-bold text-xl">3. Analyze</h2>
                    <p className='max-w-[220px] text-center'>Our AI engine analyzes your strengths, weaknesses, and growth patterns.</p>
                </div>
                <svg className='hidden lg:block' width="120" height="10" viewBox="0 0 120 10">
                    <line
                        x1="0"
                        y1="5"
                        x2="120"
                        y2="5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />
                </svg>
                <div className='flex flex-col justify-center items-center border-4 border-black bg-white text-black p-10 gap-2 shadow-[10px_10px_0_0_rgba(0,0,0,1)]'>
                    <div className='border-2 rounded-full inline-flex justify-center items-center p-5'>
                        <Rocket size={48} />
                    </div>
                    <h2  className="font-bold text-xl">4. Guide</h2>
                    <p className='max-w-[220px] text-center'>Get a personalised roadmap and actionable steps to improve.</p>
                </div>
            </div>
        </div>
    )
}

export default Working
