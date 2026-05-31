import { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Code, BrainCircuit, Activity, Layers } from "lucide-react";

// --- Typewriter Hook for cycling words ---
function useWordCycle(words) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1500);
      return () => clearTimeout(timeout);
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return `${words[index].substring(0, subIndex)}${subIndex === words[index].length + 1 ? "" : "|"}`;
}

export default function LandingPage() {
  const location = useLocation();
  const containerRef = useRef(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // --- Animation Variants ---
  const popIn = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const cycleWords = ["CODER", "ENGINEER", "HACKER", "ARCHITECT"];
  const currentWord = useWordCycle(cycleWords);

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-hidden font-sans">
      
      {/* ───── 1. HERO SECTION ───── */}
      <section className="relative min-h-[calc(100vh-64px)] pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-24 flex items-start border-b-4 border-black bg-white">
        {/* Subtle dot background for breathing room texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:48px_48px] opacity-[0.05]"></div>
        
        <motion.div 
          className="relative z-10 w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 lg:gap-24 items-start"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Left Text Block */}
          <div className="lg:col-span-7 pt-0 sm:pt-4">
            <motion.h1 variants={popIn} className="text-5xl sm:text-7xl md:text-7xl lg:text-8xl xl:text-[110px] font-black tracking-tighter uppercase leading-[0.85] mb-6 sm:mb-8 text-black">
              <span className="block mb-2 sm:mb-4">Unify Your</span>
              <span className="inline-block bg-black text-white px-4 sm:px-6 py-1 sm:py-2 min-w-[200px] sm:min-w-[280px] lg:min-w-[380px]">
                {currentWord.replace("|", "")}<span className="animate-pulse">|</span>
              </span>
              <span className="block mt-2 sm:mt-4">Journey</span>
            </motion.h1>
            
            <motion.p variants={popIn} className="text-base sm:text-lg md:text-xl font-bold tracking-widest text-gray-600 max-w-2xl leading-relaxed mb-8 sm:mb-10 border-l-4 sm:border-l-8 border-black pl-4 sm:pl-8">
              Stop scattering your progress across platforms. CodeLens aggregates your raw data and delivers AI-driven, actionable roadmaps to shatter stagnation.
            </motion.p>
            
            <motion.div variants={popIn} className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full sm:w-auto">
              <Link to="/dashboard" className="group w-full sm:w-auto px-6 sm:px-12 py-4 sm:py-6 bg-black text-white text-lg sm:text-xl font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black border-4 border-black transition-colors shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-[16px_16px_0_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] duration-300 flex items-center justify-center gap-4 sm:gap-6">
                Start Building <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-rotate-45 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>

          {/* Right Abstract Graphic Block to break vertical stacking */}
          <motion.div variants={popIn} className="lg:col-span-5 hidden lg:flex justify-center relative h-[450px] xl:h-[550px] w-full">
            <div className="absolute top-0 right-10 w-56 h-56 xl:w-72 xl:h-72 border-8 border-black shadow-[24px_24px_0_0_rgba(0,0,0,1)] bg-white z-20 flex items-center justify-center">
              <Code className="w-24 h-24 xl:w-32 xl:h-32 text-black" />
            </div>
            <div className="absolute top-24 xl:top-32 left-0 xl:left-10 w-64 xl:w-80 h-72 xl:h-96 bg-gray-100 border-4 border-black shadow-[16px_16px_0_0_rgba(0,0,0,1)] z-10 p-8 flex flex-col justify-end">
              <div className="w-full h-4 bg-black mb-4"></div>
              <div className="w-3/4 h-4 bg-black mb-4"></div>
              <div className="w-1/2 h-4 bg-black"></div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── 2. THEORETICAL SECTION ───── */}
      <section className="relative py-24 sm:py-32 lg:py-48 px-4 sm:px-8 lg:px-24 bg-gray-50 border-b-4 border-black">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center"
        >
          {/* Left Abstract Graphic */}
          <motion.div variants={popIn} className="lg:col-span-5 relative hidden lg:block h-[400px] xl:h-[500px]">
            <div className="absolute inset-0 border-4 xl:border-8 border-black bg-white shadow-[16px_16px_0_0_rgba(0,0,0,1)] xl:shadow-[32px_32px_0_0_rgba(0,0,0,1)] p-8 xl:p-12 flex flex-col justify-between hover:-translate-y-4 hover:-translate-x-4 hover:shadow-[24px_24px_0_0_rgba(0,0,0,1)] xl:hover:shadow-[48px_48px_0_0_rgba(0,0,0,1)] transition-all duration-500 z-10">
              <div className="flex justify-between items-start border-b-4 xl:border-b-8 border-black pb-6 xl:pb-8">
                <BrainCircuit className="w-16 h-16 xl:w-24 xl:h-24 text-black" />
              </div>
              <div>
                <h3 className="text-3xl xl:text-5xl font-black uppercase tracking-tighter mb-4 xl:mb-6 leading-none">Central <br/> Intelligence</h3>
                <p className="text-xs xl:text-base font-bold tracking-widest uppercase text-gray-500">All your competitive programming and development data, unified in one highly-opinionated engine.</p>
              </div>
            </div>
            <div className="absolute -inset-6 xl:-inset-12 border-4 border-black opacity-10 -z-10 rotate-3 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] bg-[length:40px_40px] bg-[position:0_0,20px_20px]"></div>
          </motion.div>

          {/* Right Text Block */}
          <div className="lg:col-span-7">
            <motion.h2 variants={popIn} className="text-4xl sm:text-6xl md:text-8xl lg:text-[80px] xl:text-[100px] font-black tracking-tighter uppercase leading-[0.85] mb-10 sm:mb-16">
              The Problem with <br/> <span className="text-gray-300">Fragmentation.</span>
            </motion.h2>
            <motion.div variants={popIn} className="space-y-8 sm:space-y-12">
              <p className="text-base sm:text-xl md:text-2xl font-bold tracking-widest uppercase leading-relaxed text-black">
                You solve <span className="text-green-600 bg-green-50 px-2 sm:px-3 py-1 border-2 sm:border-4 border-green-600 inline-block -rotate-1 shadow-[2px_2px_0_0_rgba(22,163,74,1)] sm:shadow-[4px_4px_0_0_rgba(22,163,74,1)] my-1 sm:my-2">500 problems on LeetCode</span>, but your <span className="text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 border-2 sm:border-4 border-blue-600 inline-block rotate-1 shadow-[2px_2px_0_0_rgba(37,99,235,1)] sm:shadow-[4px_4px_0_0_rgba(37,99,235,1)] my-1 sm:my-2">GitHub graph is empty</span>.
              </p>
              <p className="text-base sm:text-xl md:text-2xl font-bold tracking-widest uppercase leading-relaxed text-black">
                You have a <span className="text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 border-2 sm:border-4 border-blue-600 inline-block -rotate-2 shadow-[2px_2px_0_0_rgba(37,99,235,1)] sm:shadow-[4px_4px_0_0_rgba(37,99,235,1)] my-1 sm:my-2">High Codeforces Rating</span>, but you can't build a <span className="text-green-600 bg-green-50 px-2 sm:px-3 py-1 border-2 sm:border-4 border-green-600 inline-block rotate-2 shadow-[2px_2px_0_0_rgba(22,163,74,1)] sm:shadow-[4px_4px_0_0_rgba(22,163,74,1)] my-1 sm:my-2">Full-Stack App</span>.
              </p>
              <p className="text-sm sm:text-lg md:text-xl font-bold tracking-widest uppercase leading-relaxed text-gray-500 border-l-4 sm:border-l-8 border-black pl-4 sm:pl-8 py-2 sm:py-4 mt-6 sm:mt-8 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                CodeLens eliminates this gap. By continuously analyzing your entire developer footprint, we identify exactly what you need to learn next to become a complete engineer.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ───── 3. FEATURE CAROUSEL (THE ARSENAL) ───── */}
      <section className="relative py-24 sm:py-32 lg:py-48 px-4 sm:px-8 lg:px-24 bg-white border-b-4 border-black">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="max-w-[1800px] mx-auto"
        >
          <motion.div variants={popIn} className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 sm:mb-32 border-b-4 sm:border-b-8 border-black pb-6 sm:pb-8">
            <h2 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">
              The Arsenal
            </h2>
            <div className="hidden md:flex gap-4 mb-2">
              <div className="w-16 sm:w-24 h-4 sm:h-6 bg-black"></div>
              <div className="w-4 sm:w-6 h-4 sm:h-6 bg-black"></div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16">
            {[
              { title: "Command Dashboard", desc: "Your command center. Live metrics, global rankings, and immediate action items. No fluff, just your raw velocity.", icon: <Activity className="w-10 h-10 sm:w-16 sm:h-16"/>, to: "/dashboard" },
              { title: "Targeted Practice", desc: "Curated problem sets targeting your specific weaknesses. Stop grinding blindly and start engineering your growth.", icon: <Code className="w-10 h-10 sm:w-16 sm:h-16"/>, to: "/practice" },
              { title: "Algorithm Universe", desc: "Master complex algorithms through interactive, step-by-step visualizers. Build intuition, not just memorization.", icon: <Layers className="w-10 h-10 sm:w-16 sm:h-16"/>, to: "/algoverse" },
              { title: "APEX Intelligence", desc: "An advanced intelligence that architects projects based on your exact skill level. Real engineering, no to-do apps.", icon: <BrainCircuit className="w-10 h-10 sm:w-16 sm:h-16"/>, to: "/apex-ai" },
            ].map((feat, idx) => (
              <motion.div key={idx} variants={popIn}>
                <Link to={feat.to} className="group block h-full bg-white border-4 sm:border-8 border-black p-6 sm:p-12 shadow-[12px_12px_0_0_rgba(0,0,0,1)] sm:shadow-[24px_24px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 sm:hover:-translate-y-4 hover:-translate-x-2 sm:hover:-translate-x-4 hover:shadow-[16px_16px_0_0_rgba(0,0,0,1)] sm:hover:shadow-[32px_32px_0_0_rgba(0,0,0,1)] transition-all duration-300 flex flex-col">
                  <div className="flex justify-between items-start mb-8 sm:mb-12">
                    <div className="w-20 h-20 sm:w-32 sm:h-32 bg-black text-white flex items-center justify-center border-4 border-black group-hover:bg-white group-hover:text-black transition-colors duration-500">
                      {feat.icon}
                    </div>
                    <div className="text-4xl sm:text-6xl font-black text-gray-200">0{idx + 1}</div>
                  </div>
                  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-widest mb-4 sm:mb-6 group-hover:text-blue-600 transition-colors leading-[1] sm:leading-[0.9]">{feat.title}</h3>
                  <p className="text-sm sm:text-lg font-bold tracking-widest uppercase text-gray-500 mt-auto leading-relaxed border-t-2 sm:border-t-4 border-black pt-4 sm:pt-6">
                    {feat.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ───── 4. FINAL MASSIVE CTA ───── */}
      <section className="relative min-h-[70vh] sm:min-h-[90vh] px-4 sm:px-8 lg:px-24 py-24 sm:py-40 bg-black text-white flex flex-col justify-center items-center text-center overflow-hidden w-full">
        
        {/* Background typographic noise */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 opacity-[0.03] text-[15vw] font-black leading-none break-words overflow-hidden select-none pointer-events-none w-[150%] -left-[25%] top-[-20%]">
          BUILD DEPLOY SCALE OPTIMIZE LEARN GROW BUILD DEPLOY SCALE OPTIMIZE
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
          className="relative z-10 w-full max-w-5xl px-4"
        >
          <motion.div variants={popIn} className="mb-10 sm:mb-16 flex justify-center">
            <div className="w-24 h-24 sm:w-40 sm:h-40 bg-white border-4 sm:border-8 border-black flex items-center justify-center shadow-[12px_12px_0_0_rgba(255,255,255,0.2)] sm:shadow-[24px_24px_0_0_rgba(255,255,255,0.2)]">
              <Code className="w-12 h-12 sm:w-20 sm:h-20 text-black" />
            </div>
          </motion.div>
          
          <motion.h2 variants={popIn} className="text-5xl sm:text-7xl md:text-8xl lg:text-[120px] xl:text-[150px] font-black tracking-tighter uppercase mb-8 sm:mb-12 leading-[0.85] sm:leading-[0.8] w-full break-words">
            Stop <br/> Waiting
          </motion.h2>
          
          <motion.p variants={popIn} className="text-sm sm:text-lg md:text-2xl font-bold tracking-widest uppercase text-gray-400 mb-12 sm:mb-20 max-w-3xl mx-auto border-t-2 sm:border-t-4 border-white pt-6 sm:pt-10 px-4">
            The era of fragmented learning is over. Connect your accounts and let CodeLens construct your optimal path forward.
          </motion.p>
          
          <motion.div variants={popIn} className="w-full sm:w-auto flex justify-center">
            <Link 
              to="/dashboard" 
              className="group inline-flex w-full sm:w-auto justify-center items-center gap-4 sm:gap-8 bg-white text-black px-6 sm:px-16 py-5 sm:py-8 text-lg sm:text-2xl md:text-3xl font-black tracking-[0.2em] uppercase transition-all duration-300 shadow-[12px_12px_0_0_rgba(59,130,246,0.6)] sm:shadow-[24px_24px_0_0_rgba(59,130,246,0.6)] hover:-translate-y-1 sm:hover:-translate-y-2 hover:-translate-x-1 sm:hover:-translate-x-2 hover:shadow-[16px_16px_0_0_rgba(59,130,246,0.9)] sm:hover:shadow-[32px_32px_0_0_rgba(59,130,246,0.9)] border-4 border-white"
            >
              <span>Initialize System</span>
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-black text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors shrink-0">
                <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 group-hover:-rotate-45 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
