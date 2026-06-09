import React from 'react'

const About = () => {
  return (
    <main className="border-b-4 border-black px-6 sm:px-10 lg:px-16 lg:py-10">
      <title>About - CodeLens</title>
      <meta
        name="description"
        content="Learn about CodeLens, our mission, vision, and values. Discover how we're building developer-first tools that transform coding data into actionable insights and empower intelligent growth."
      />
      <section className="flex flex-col sm:flex-row gap-10 max-w-6xl mx-auto px-6 border-b-2 border-black p-10 ">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-7xl">
            About Codelens
          </h1>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-black">
            UNIFIED DEVELOPER TELEMETRY ENGINE
          </p>
          <p className="text-xs font-black tracking-[0.28em] text-black">
            Stop Guessing. Start Growing.
          </p>
          <p>Codelens aggregates your GitHub, Leetcode, and Codeforces data into a single AI-powered command center that tells you what to learn neext.</p>
        </div>
        <div className='border border-black'></div>
        <div className='flex flex-col gap-5 items-center justify-center'>
          <div>
            <span className='font-extrabold'>
              Codelens is the developer-first platform </span>
            that transforms complex data into clear, actionable insights.
          </div>
          <div>
            We believe best enginnering happens when developers have the right tool, the right data and the right context.
          </div>
          <div>
            From platform tracking to privacy by design, everthing we build is centered around clarity, control and performance.
          </div>
        </div>
      </section>
      <section className="flex flex-col sm:flex-row gap-10 max-w-6xl mx-auto px-6 p-10">
        <div className='flex flex-col gap-3 justify-center items-start'>
          <div className='bg-black p-2 inline-flex justify-center items-center'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="w-8 h-8"
            >
              <ellipse cx="12" cy="5" rx="7" ry="3" />
              <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
              <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
            </svg>
          </div>
          <h2 className="text-xs font-black uppercase tracking-[0.28em] text-black">
            What we do
          </h2>
          <p>Unify data from Github, LeetCode, and Codeforces to create a single comprehensive developer profile.</p>
        </div>
        <div className='border-1 border-black'></div>
        <div className='flex flex-col gap-3 justify-center items-start'>
          <div className='bg-black p-2 inline-flex justify-center items-center'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <path d="M12 2L13.8 10.2L22 12L13.8 13.8L12 22L10.2 13.8L2 12L10.2 10.2L12 2Z" />
            </svg>
          </div>
          <h2 className="text-xs font-black uppercase tracking-[0.28em] text-black">How it works
          </h2>
          <p>AI (Gemini) analyzes your data, identifies strengths and gaps, and builds a personalized learning roadmap.</p>
        </div>
        <div className='border-1 border-black'></div>
        <div className='flex flex-col gap-3 justify-center items-start'>
          <div className='bg-black p-2 inline-flex justify-center items-center'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="w-8 h-8"
            >
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="12" cy="12" r="1" />
            </svg>
          </div>
          <h2 className="text-xs font-black uppercase tracking-[0.28em] text-black">What you get
          </h2>
          <p>Actionable insights and a step-by-step path to improve, grow, and achieve your engineering goals faster. </p>
        </div>
      </section>
      <section className='max-w-6xl px-6 p-10 mx-auto flex justify-center items-center'>
        <div className="w-full border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase leading-none tracking-tight text-black sm:text-2xl lg:text-2xl">Build by developers, for developers</h2>
            <p className="text-base font-bold leading-relaxed text-black sm:text-lg">
              We're remote-first team of builders, thinkers, and problem solvers.
            </p>
          </div>
          <a
          href="https://github.com/kunalverma2512/CodeLens/issues" 
          className="w-full sm:w-auto px-8 sm:px-8 py-4 sm:py-3 bg-black text-white text-xl sm:text-xl md:text-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors border-4 border-black sm:border-l-[0px] rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-none sm:hover:-translate-y-1 sm:hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]">Join the community</a>
        </div>
      </section>
    </main>
  )
}

export default About
