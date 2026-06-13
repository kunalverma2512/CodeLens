import React from 'react'
import { BadgeCheck, ChartNoAxesCombined, Route, Lightbulb, MoveRight, Zap } from "lucide-react";

const Ecosystem = () => {
    return (
        <div className='w-full min-h-screen border-b-4 px-4 sm:px-6 py-16 sm:py-20 md:py-32 flex flex-col justify-center items-center gap-10'>
            <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-8xl text-center">One ecosystem. Complete visibility.</h1>
            <div className='flex flex-col min-[1250px]:flex-row justify-center items-center gap-5'>
                <div className='border-2 border-black '>
                    <div className='border-b p-3 px-10 flex items-center gap-5'>
                        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="Leetcode--Streamline-Simple-Icons" height="50" width="50">
                            <desc>
                                Leetcode Streamline Icon: https://streamlinehq.com
                            </desc>
                            <title>LeetCode</title>
                            <path d="M13.483 0a1.374 1.374 0 0 0 -0.961 0.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0 -1.209 2.104 5.35 5.35 0 0 0 -0.125 0.513 5.527 5.527 0 0 0 0.062 2.362 5.83 5.83 0 0 0 0.349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193 0.039 0.038c2.248 2.165 5.852 2.133 8.063 -0.074l2.396 -2.392c0.54 -0.54 0.54 -1.414 0.003 -1.955a1.378 1.378 0 0 0 -1.951 -0.003l-2.396 2.392a3.021 3.021 0 0 1 -4.205 0.038l-0.02 -0.019 -4.276 -4.193c-0.652 -0.64 -0.972 -1.469 -0.948 -2.263a2.68 2.68 0 0 1 0.066 -0.523 2.545 2.545 0 0 1 0.619 -1.164L9.13 8.114c1.058 -1.134 3.204 -1.27 4.43 -0.278l3.501 2.831c0.593 0.48 1.461 0.387 1.94 -0.207a1.384 1.384 0 0 0 -0.207 -1.943l-3.5 -2.831c-0.8 -0.647 -1.766 -1.045 -2.774 -1.202l2.015 -2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0 -1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38 -1.382 1.38 1.38 0 0 0 -1.38 -1.382z" fill="#000000" stroke-width="1"></path>
                        </svg>
                        <div>
                            <h1 className='font-bold text-2xl'>LeetCode</h1>
                            <p>Your Practice</p>
                        </div>
                    </div>
                    <div className='border-b p-3 px-10 flex items-center gap-5'>
                        <svg height="50" width="50" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><title>Codeforces icon</title><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" /></svg>
                        <div>
                            <h1 className='font-bold text-2xl'>Codeforces</h1>
                            <p>Your competitions</p>
                        </div>
                    </div>
                    <div className='p-3 px-10 flex items-center gap-5'>
                        <svg height="50" width="50" fill="#000000" viewBox="0 -0.5 25 25" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="m12.301 0h.093c2.242 0 4.34.613 6.137 1.68l-.055-.031c1.871 1.094 3.386 2.609 4.449 4.422l.031.058c1.04 1.769 1.654 3.896 1.654 6.166 0 5.406-3.483 10-8.327 11.658l-.087.026c-.063.02-.135.031-.209.031-.162 0-.312-.054-.433-.144l.002.001c-.128-.115-.208-.281-.208-.466 0-.005 0-.01 0-.014v.001q0-.048.008-1.226t.008-2.154c.007-.075.011-.161.011-.249 0-.792-.323-1.508-.844-2.025.618-.061 1.176-.163 1.718-.305l-.076.017c.573-.16 1.073-.373 1.537-.642l-.031.017c.508-.28.938-.636 1.292-1.058l.006-.007c.372-.476.663-1.036.84-1.645l.009-.035c.209-.683.329-1.468.329-2.281 0-.045 0-.091-.001-.136v.007c0-.022.001-.047.001-.072 0-1.248-.482-2.383-1.269-3.23l.003.003c.168-.44.265-.948.265-1.479 0-.649-.145-1.263-.404-1.814l.011.026c-.115-.022-.246-.035-.381-.035-.334 0-.649.078-.929.216l.012-.005c-.568.21-1.054.448-1.512.726l.038-.022-.609.384c-.922-.264-1.981-.416-3.075-.416s-2.153.152-3.157.436l.081-.02q-.256-.176-.681-.433c-.373-.214-.814-.421-1.272-.595l-.066-.022c-.293-.154-.64-.244-1.009-.244-.124 0-.246.01-.364.03l.013-.002c-.248.524-.393 1.139-.393 1.788 0 .531.097 1.04.275 1.509l-.01-.029c-.785.844-1.266 1.979-1.266 3.227 0 .025 0 .051.001.076v-.004c-.001.039-.001.084-.001.13 0 .809.12 1.591.344 2.327l-.015-.057c.189.643.476 1.202.85 1.693l-.009-.013c.354.435.782.793 1.267 1.062l.022.011c.432.252.933.465 1.46.614l.046.011c.466.125 1.024.227 1.595.284l.046.004c-.431.428-.718 1-.784 1.638l-.001.012c-.207.101-.448.183-.699.236l-.021.004c-.256.051-.549.08-.85.08-.022 0-.044 0-.066 0h.003c-.394-.008-.756-.136-1.055-.348l.006.004c-.371-.259-.671-.595-.881-.986l-.007-.015c-.198-.336-.459-.614-.768-.827l-.009-.006c-.225-.169-.49-.301-.776-.38l-.016-.004-.32-.048c-.023-.002-.05-.003-.077-.003-.14 0-.273.028-.394.077l.007-.003q-.128.072-.08.184c.039.086.087.16.145.225l-.001-.001c.061.072.13.135.205.19l.003.002.112.08c.283.148.516.354.693.603l.004.006c.191.237.359.505.494.792l.01.024.16.368c.135.402.38.738.7.981l.005.004c.3.234.662.402 1.057.478l.016.002c.33.064.714.104 1.106.112h.007c.045.002.097.002.15.002.261 0 .517-.021.767-.062l-.027.004.368-.064q0 .609.008 1.418t.008.873v.014c0 .185-.08.351-.208.466h-.001c-.119.089-.268.143-.431.143-.075 0-.147-.011-.214-.032l.005.001c-4.929-1.689-8.409-6.283-8.409-11.69 0-2.268.612-4.393 1.681-6.219l-.032.058c1.094-1.871 2.609-3.386 4.422-4.449l.058-.031c1.739-1.034 3.835-1.645 6.073-1.645h.098-.005zm-7.64 17.666q.048-.112-.112-.192-.16-.048-.208.032-.048.112.112.192.144.096.208-.032zm.497.545q.112-.08-.032-.256-.16-.144-.256-.048-.112.08.032.256.159.157.256.047zm.48.72q.144-.112 0-.304-.128-.208-.272-.096-.144.08 0 .288t.272.112zm.672.673q.128-.128-.064-.304-.192-.192-.32-.048-.144.128.064.304.192.192.32.044zm.913.4q.048-.176-.208-.256-.24-.064-.304.112t.208.24q.24.097.304-.096zm1.009.08q0-.208-.272-.176-.256 0-.256.176 0 .208.272.176.256.001.256-.175zm.929-.16q-.032-.176-.288-.144-.256.048-.224.24t.288.128.225-.224z"></path></g></svg>
                        <div>
                            <h1 className='font-bold text-2xl'>GitHub</h1>
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
                        stroke-width="4"
                        stroke-dasharray="8 8"
                        stroke-linecap="round"
                    />
                    <path
                        d="M10 50L20 60L30 50"
                        stroke="black"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
                            font-size="38"
                            font-family="Inter, Arial, sans-serif"
                            font-weight="800"
                            text-anchor="middle"
                            dominant-baseline="middle"
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
                        stroke-width="4"
                        stroke-dasharray="8 8"
                        stroke-linecap="round"
                    />
                    <path
                        d="M10 50L20 60L30 50"
                        stroke="black"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
