import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='w-full min-h-screen flex justify-center items-center border-b-4 px-4 sm:px-6 py-16 sm:py-20 md:py-32'>
      <div className='flex flex-col max-w-4xl px-7 py-20 gap-10'>
        <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-7xl text-center sm:text-start">Engineering growth should not be fragmented</h1>
        <p className='text-2xl font-bold leading-none tracking-tight text-black '>CodeLens unifies your competitive programming, projects, and learning journey into one intelligent platform  that shows you what to do next.</p>
        <div className='flex flex-col sm:flex-row gap-5'>
          <Link to="/explore" className='cursor-pointer w-full sm:w-auto px-8 sm:px-4 py-4 sm:py-3 bg-black text-white text-lg font-black uppercase hover:bg-gray-800 transition-colors border-4 border-black sm:border-l-[0px] rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-none sm:hover:-translate-y-1 sm:hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]'>Explore platform ➜</Link>
          <button onClick={() => { const win = window.open("https://github.com/kunalverma2512/CodeLens", "_blank"); if (win) win.opener = null; }} className='cursor-pointer w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-3 bg-white text-black text-lg font-black uppercase hover:bg-gray-300 transition-colors border-4 border-black rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-none sm:hover:-translate-y-1 sm:hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]'>View Github ➚</button>
        </div>
      </div>
      <div><img src="/about-component-image.png" alt="CodeLens ecosystem" className="hidden lg:block"/></div>
    </div>
  )
}

export default Hero
