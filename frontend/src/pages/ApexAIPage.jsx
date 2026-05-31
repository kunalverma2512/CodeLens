import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Terminal, BrainCircuit, Code, GitBranch, Crosshair, ArrowRight, Activity, Cpu } from "lucide-react";

// --- Typewriter Hook ---
function useTypewriter(text, speed = 50, delay = 0) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let timeout;
    if (!started) {
      timeout = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(timeout);
    }

    if (displayedText.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
    }
    return () => clearTimeout(timeout);
  }, [displayedText, started, text, speed, delay]);

  return displayedText;
}

export default function ApexAIPage() {
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Animations
  const popIn = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  const slideRight = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const typedText = useTypewriter("Stop guessing. Start executing.", 40, 500);

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-hidden">
      
      {/* ───── SECTION 1: HERO (100vh) ───── */}
      <section className="relative min-h-[calc(100vh-80px)] pt-24 pb-16 px-6 sm:px-8 lg:px-12 flex flex-col items-center justify-center text-center border-b-4 border-black bg-white overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
        
        <motion.div 
          className="relative z-20 max-w-6xl w-full mx-auto flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={popIn} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 border-4 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-xs font-black uppercase tracking-[0.2em] text-black">
              <BrainCircuit className="w-5 h-5 text-black" />
              Advanced Performance Excellence eXecutive
            </div>
          </motion.div>
          
          <motion.h1 variants={popIn} className="text-6xl md:text-8xl lg:text-[130px] font-black tracking-tighter uppercase leading-[0.85] mb-6 relative">
            <span className="block text-black">APEX AI</span>
          </motion.h1>
          
          <motion.div variants={popIn} className="h-10 md:h-12 flex items-center justify-center mb-12">
            <p className="text-xl md:text-3xl font-bold tracking-widest uppercase text-gray-500">
              {typedText}<span className="animate-pulse bg-black w-3 md:w-4 h-6 md:h-8 inline-block ml-2 align-middle"></span>
            </p>
          </motion.div>
          
          <motion.p variants={popIn} className="text-base md:text-xl font-bold tracking-widest text-black max-w-3xl mx-auto leading-relaxed mb-16 border-l-4 border-black pl-6 text-left">
            Not a generic wrapper. Not a chatbot. APEX synthesizes your GitHub footprint, Codeforces velocity, and Data Structure proficiency to architect personalized, elite-tier growth strategies. 
          </motion.p>
          
          <motion.div variants={popIn} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            <Link to="/apex-ai/workspace" className="group w-full sm:w-auto px-10 py-6 bg-black text-white text-lg font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black border-4 border-black transition-colors shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] duration-200 flex items-center justify-center gap-4">
              Initialize Workspace <ArrowRight className="w-6 h-6 group-hover:rotate-[-45deg] transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── SECTION 2: THE WHY (100vh) ───── */}
      <section className="relative min-h-screen py-32 px-6 sm:px-8 lg:px-12 flex flex-col justify-center max-w-[1400px] mx-auto bg-white border-b-4 border-black">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8"
        >
          <div className="max-w-4xl">
            <motion.h2 variants={slideRight} className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
              Why developers <br /> <span className="text-gray-400">stagnate.</span>
            </motion.h2>
            <motion.p variants={slideRight} className="text-xl font-bold tracking-widest text-black uppercase leading-relaxed border-l-4 border-black pl-6">
              General-purpose AI gives general-purpose advice. If it doesn't know your commit history or your recent contest ratings, it's guessing. APEX doesn't guess.
            </motion.p>
          </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { title: "Context Blindness", desc: "ChatGPT doesn't know your code. It gives boilerplate answers to complex architectural problems." },
            { title: "The Tutorial Trap", desc: "Following generic roadmaps keeps you building to-do apps instead of enterprise systems." },
            { title: "Skill Imbalance", desc: "You might be a Grandmaster at algorithms but write terrible, unmaintainable monolithic code." },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              variants={popIn}
              whileHover={{ y: -10 }}
              className="bg-white border-4 border-black p-10 flex flex-col h-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
            >
              <div className="text-6xl font-black text-gray-200 mb-6 border-b-4 border-black pb-4">0{idx + 1}</div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{item.title}</h3>
              <p className="text-base font-bold tracking-widest text-gray-600 uppercase leading-relaxed mt-auto">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───── SECTION 3: DATA INTEGRATION (100vh) ───── */}
      <section className="relative min-h-screen py-32 px-6 sm:px-8 lg:px-12 bg-black text-white flex flex-col justify-center overflow-hidden border-b-4 border-black">
        {/* Abstract code background */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 opacity-[0.05] text-[10vw] font-black leading-none break-words overflow-hidden select-none pointer-events-none w-[150%] -left-[25%] top-[-20%]">
          GITHUB CODEFORCES LEETCODE ALGO DATA API SYNC GITHUB CODEFORCES LEETCODE ALGO DATA API SYNC
        </motion.div>

        <div className="max-w-[1400px] mx-auto relative z-10 w-full">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="flex flex-col lg:flex-row gap-20 items-center"
          >
            <motion.div className="flex-1 w-full" variants={staggerContainer}>
              <motion.div variants={slideRight} className="inline-block px-4 py-2 border-2 border-white text-xs font-black uppercase tracking-[0.2em] mb-8 bg-white text-black shadow-[4px_4px_0_0_rgba(255,255,255,0.3)]">
                Omniscient Context
              </motion.div>
              <motion.h2 variants={slideRight} className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                Absolute <br /> Data Fusion
              </motion.h2>
              <motion.p variants={slideRight} className="text-lg font-bold tracking-widest text-gray-400 uppercase leading-relaxed max-w-xl border-l-4 border-white pl-6">
                APEX continuously synchronizes your live data streams. It analyzes your latest commits, calculates your competitive rating volatility, and cross-references your algorithmic weaknesses.
              </motion.p>
            </motion.div>

            <motion.div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6" variants={staggerContainer}>
              {[
                { icon: <GitBranch className="w-8 h-8"/>, label: "GitHub Commits", val: "Live" },
                { icon: <Activity className="w-8 h-8"/>, label: "Codeforces Rating", val: "Synced" },
                { icon: <Code className="w-8 h-8"/>, label: "Tech Stack", val: "Analyzed" },
                { icon: <Crosshair className="w-8 h-8"/>, label: "DSA Proficiency", val: "Mapped" },
              ].map((stat, idx) => (
                <motion.div key={idx} variants={popIn} className="border-4 border-white p-8 bg-black hover:bg-white hover:text-black transition-colors duration-300 group">
                  <div className="mb-6">{stat.icon}</div>
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-2">{stat.label}</h4>
                  <p className="text-2xl font-black uppercase tracking-tighter text-gray-500 group-hover:text-black transition-colors">{stat.val}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───── SECTION 4: PROJECT ARCHITECTURE (100vh) ───── */}
      <section className="relative min-h-screen py-32 px-6 sm:px-8 lg:px-12 flex flex-col justify-center max-w-[1400px] mx-auto bg-white border-b-4 border-black">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="flex flex-col lg:flex-row-reverse gap-20 items-center"
        >
          <motion.div className="flex-1 w-full" variants={staggerContainer}>
            <motion.h2 variants={slideRight} className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
              Enterprise <br /> Architecture
            </motion.h2>
            <motion.p variants={slideRight} className="text-lg font-bold tracking-widest text-black uppercase leading-relaxed max-w-xl border-l-4 border-black pl-6 mb-8">
              APEX doesn't tell you to build another to-do list. Ask it for a project idea, and it will architect a system based on your exact skill level, demanding microservices, CI/CD pipelines, and caching layers if you are ready.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-6">
              {["System Design Schematics", "Database Scaling Strategies", "Modern Tech Stack Selection"].map((item, idx) => (
                <motion.li key={idx} variants={popIn} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest">
                  <div className="w-6 h-6 border-2 border-black flex items-center justify-center bg-black text-white shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div className="flex-1 w-full relative" variants={popIn}>
            <div className="border-4 border-black bg-gray-50 p-6 shadow-[16px_16px_0_0_rgba(0,0,0,1)] relative z-10">
              <div className="flex gap-2 mb-4 border-b-4 border-black pb-4">
                <div className="w-3 h-3 bg-black"></div>
                <div className="w-3 h-3 border-2 border-black"></div>
                <div className="w-3 h-3 border-2 border-black"></div>
              </div>
              <div className="space-y-4 font-mono text-sm font-bold">
                <div className="text-gray-500">APEX_RESPONSE_ROUTING</div>
                <div><span className="text-blue-600">User Level:</span> Advanced</div>
                <div><span className="text-blue-600">Recommended Pattern:</span> Event-Driven</div>
                <div><span className="text-blue-600">Infrastructure:</span> Redis Queue + WebSockets</div>
                <div className="mt-6 border-l-4 border-black pl-4 py-2 bg-white">
                  "Based on your recent 1800 rating push, you can handle the algorithmic complexity. Let's wrap it in a distributed system."
                </div>
              </div>
            </div>
            {/* Decorative block behind */}
            <div className="absolute top-10 -left-10 w-full h-full border-4 border-black bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] opacity-10 z-0"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── SECTION 5: FINAL CTA (100vh) ───── */}
      <section className="relative min-h-[80vh] px-6 sm:px-8 lg:px-12 py-32 bg-white overflow-hidden flex flex-col justify-center border-t-4 border-black">
        {/* Large decorative floating elements */}
        <motion.div 
          animate={{ y: [-20, 20, -20], rotate: [0, 15, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20"
        >
          <Cpu className="w-40 h-40 text-black/5" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [20, -20, 20], rotate: [0, -15, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20"
        >
          <BrainCircuit className="w-56 h-56 text-black/5" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10"
        >
          <motion.div variants={popIn} className="relative mb-12 group">
            <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 shadow-xl transition-transform duration-300 group-hover:translate-x-5 group-hover:translate-y-5"></div>
            <div className="relative w-32 h-32 bg-white border-4 border-black flex items-center justify-center z-10 transition-all duration-300">
              <Terminal className="w-16 h-16 text-black" />
            </div>
          </motion.div>
          
          <motion.h2 variants={popIn} className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
            Engage <br /> APEX Protocol
          </motion.h2>
          
          <motion.p variants={popIn} className="text-xl font-bold tracking-widest text-black uppercase leading-relaxed mb-16 max-w-2xl mx-auto border-t-4 border-black pt-8">
            The workspace is secure. Your data is synced. Enter the command interface and begin the transformation.
          </motion.p>
          
          <motion.div variants={popIn}>
            <Link 
              to="/apex-ai/workspace" 
              className="group relative inline-flex items-center gap-6 bg-black text-white px-10 py-6 text-xl font-black tracking-[0.2em] uppercase transition-all duration-300 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)]"
            >
              <span className="relative z-10">Access Workspace</span>
              <span className="relative z-10 w-14 h-14 bg-white border-4 border-black text-black flex items-center justify-center group-hover:bg-black group-hover:border-white group-hover:text-white transition-colors duration-300">
                <ArrowRight className="w-8 h-8 group-hover:rotate-[-45deg] transition-transform duration-300" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
