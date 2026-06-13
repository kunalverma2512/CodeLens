import React from 'react'
import { BadgeCheck, ChartNoAxesCombined, Route, Lightbulb, Zap } from "lucide-react";
import { LeetCodeIcon, CodeforcesIcon, GitHubIcon } from '../icons/PlatformIcons';

const Ecosystem = () => {
    return (
        <div className='w-full min-h-screen border-b-4 px-4 sm:px-6 py-16 sm:py-20 md:py-32 flex flex-col justify-center items-center gap-10'>
            <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-8xl text-center">One ecosystem. Complete visibility.</h2>
            <div className='flex flex-col min-[1250px]:flex-row justify-center items-center gap-5'>
                <div className='border-2 border-black '>
                    <div className='border-b p-3 px-10 flex items-center gap-5'>
                        <LeetCodeIcon/>
                        <div>
                            <h2 className='font-bold text-2xl'>LeetCode</h2>
                            <p>Your Practice</p>
                        </div>
                    </div>
                    <div className='border-b p-3 px-10 flex items-center gap-5'>
                        <CodeforcesIcon/>
                        <div>
                            <h2 className='font-bold text-2xl'>Codeforces</h2>
                            <p>Your competitions</p>
                        </div>
                    </div>
                    <div className='p-3 px-10 flex items-center gap-5'>
                        <GitHubIcon/>
                        <div>
                            <h2 className='font-bold text-2xl'>GitHub</h2>
                            <p>Your Projects</p>
                        </div>
                    </div>
                </div>
                <svg className='hidden min-[1250px]:block' width="180" height="80">
                    <path
                        d="M10 40 C60 40, 120 40, 170 40"
                        stroke="black"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="8 8"
                    />
                    <path
                        d="M160 25 L175 40 L160 55"
                        stroke="black"
                        strokeWidth="4"
                        fill="none"
                    />
                </svg>
                <svg className='min-[1250px]:hidden' width="40" height="80" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M20 10V60"
                        stroke="black"
                        strokeWidth="4"
                        strokeDasharray="8 8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 50L20 60L30 50"
                        stroke="black"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <div className='flex flex-col justify-center items-center border-4 border-black bg-black text-white p-10 gap-2 shadow-[10px_10px_0_0_rgba(0,0,0,1)]'>
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="1"
                            y="1"
                            width="78"
                            height="78"
                            rx="10"
                            fill="#000"
                        />

                        <text
                            x="40"
                            y="40"
                            fill="#FFF"
                            fontSize="38"
                            fontFamily="Inter, Arial, sans-serif"
                            fontWeight="800"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            CL
                        </text>
                    </svg>
                    <p className='font-bold'>
                        CodeLens
                    </p>
                    <p className='font-bold'>Intelligence Engine</p>
                    <p className='border-2 p-1 border-black flex font-bold justify-center items-center'><Zap />AI Powered</p>
                </div>
                <svg className='hidden min-[1250px]:block' width="180" height="80">
                    <path
                        d="M10 40 C60 40, 120 40, 170 40"
                        stroke="black"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="8 8"
                    />
                    <path
                        d="M160 25 L175 40 L160 55"
                        stroke="black"
                        strokeWidth="4"
                        fill="none"
                    />
                </svg>
                <svg className='min-[1250px]:hidden' width="40" height="80" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M20 10V60"
                        stroke="black"
                        strokeWidth="4"
                        strokeDasharray="8 8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 50L20 60L30 50"
                        stroke="black"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <div className='border-2 border-black p-5 flex flex-col gap-5'>
                    <p className='flex gap-3 font-bold'><BadgeCheck />Unified Profile</p>
                    <p className='flex gap-3 font-bold'><ChartNoAxesCombined />Complete Analysis</p>
                    <p className='flex gap-3 font-bold'><Route />AI Roadmap</p>
                    <p className='flex gap-3 font-bold'><Lightbulb />Actionable insights</p>
                </div>
            </div>
        </div>
    )
}

export default Ecosystem
