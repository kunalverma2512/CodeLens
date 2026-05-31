import { motion, useScroll, useTransform } from "framer-motion";
import { Bug, MonitorSmartphone, Zap, AlertTriangle, CheckCircle, FileText, ArrowRight, Code, Terminal, Server, ShieldCheck } from "lucide-react";
import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
const BugReportsPage = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const popIn = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
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

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-hidden">
      
      {/* ───── Dynamic Hero Section ───── */}
      <section className="relative pt-16 pb-20 px-6 sm:px-8 lg:px-12 flex flex-col items-center text-center border-b-4 border-black bg-white overflow-hidden">
        
        {/* Professional, Colorful Dynamic Aurora Background */}
        <motion.div
          animate={{
            background: [
              "radial-gradient(120% 120% at 0% 0%, #e0f2fe 0%, #ffffff 100%)", // Sky Blue 100
              "radial-gradient(120% 120% at 100% 0%, #f3e8ff 0%, #ffffff 100%)", // Purple 100
              "radial-gradient(120% 120% at 50% 100%, #ccfbf1 0%, #ffffff 100%)", // Teal 100
              "radial-gradient(120% 120% at 0% 0%, #e0f2fe 0%, #ffffff 100%)"
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none z-0"
        />

        {/* Extremely faint, professional dot matrix overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.15] pointer-events-none z-0"></div>

        <motion.div 
          className="relative z-20 max-w-5xl w-full mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={popIn} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/10 bg-white/60 backdrop-blur-xl shadow-sm text-xs font-black uppercase tracking-[0.2em] text-gray-800">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              Quality Assurance
            </div>
          </motion.div>
          
          <motion.h1 variants={popIn} className="text-6xl md:text-8xl lg:text-[100px] font-black tracking-tighter uppercase leading-[0.9] mb-8 relative">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-700 to-black">Help Us Build</span>
            <span className="block relative inline-block mt-2">
              Perfection
              <motion.svg 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 left-0 w-full h-6 text-blue-500 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="transparent" />
              </motion.svg>
            </span>
          </motion.h1>
          
          <motion.p variants={popIn} className="text-lg md:text-xl font-bold tracking-widest uppercase text-gray-600 max-w-3xl mx-auto leading-relaxed mt-16 mb-10 bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm">
            Found a glitch in the matrix? Let us know. Your detailed reports directly empower our engineering team to ship a flawless experience.
          </motion.p>
          
          {/* Organized Stats Row with Animations */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12">
            <motion.div variants={popIn} whileHover={{ y: -5, scale: 1.05 }} className="flex items-center gap-4 px-6 py-2.5 bg-green-50/90 backdrop-blur-xl border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-default">
              <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-black flex items-center justify-center shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-800" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-green-800/60 leading-none mb-1">System Status</p>
                <p className="text-sm font-black uppercase leading-none text-green-950">All Nominal</p>
              </div>
            </motion.div>

            <motion.div variants={popIn} whileHover={{ y: -5, scale: 1.05 }} className="flex items-center gap-4 px-6 py-2.5 bg-red-50/90 backdrop-blur-xl border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-default">
              <div className="w-8 h-8 rounded-full bg-red-200 border-2 border-black flex items-center justify-center shadow-sm">
                <Bug className="w-4 h-4 text-red-800" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-red-800/60 leading-none mb-1">Avg Resolution</p>
                <p className="text-sm font-black uppercase leading-none text-red-950">&lt; 24 Hours</p>
              </div>
            </motion.div>

            <motion.div variants={popIn} whileHover={{ y: -5, scale: 1.05 }} className="flex items-center gap-4 px-6 py-2.5 bg-blue-50/90 backdrop-blur-xl border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-default">
              <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-black flex items-center justify-center shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-800/60 leading-none mb-1">Project Type</p>
                <p className="text-sm font-black uppercase leading-none text-blue-950">Open Source</p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={popIn} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#report-guide" className="px-8 py-4 bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-[8px_8px_0px_0px_rgba(200,200,200,1)] hover:shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:translate-x-[4px] hover:translate-y-[4px] duration-200">
              Read The Guide
            </a>
            <a href="https://github.com/kunalverma2512/CodeLens/issues" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white border-4 border-black text-black text-sm font-black uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center gap-3 group shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-[4px] hover:translate-y-[4px] duration-200">
              <Bug className="w-5 h-5 group-hover:-rotate-12 transition-transform text-red-500" /> View Issues Page
            </a>
          </motion.div>
        </motion.div>
      </section>


      {/* ───── What Can Be Reported (Rich Grid) ───── */}
      <section className="relative py-32 px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto bg-white">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8"
        >
          <div className="max-w-2xl">
            <motion.h2 variants={slideRight} className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-6">
              What we track
            </motion.h2>
            <motion.p variants={slideRight} className="text-base font-bold tracking-widest text-gray-500 uppercase leading-relaxed">
              Not all issues are created equal. We categorize feedback into distinct pipelines to ensure swift resolution by the right maintainers.
            </motion.p>
          </div>
          <motion.div variants={popIn} className="w-24 h-2 bg-black flex-shrink-0"></motion.div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { icon: <MonitorSmartphone />, title: "Interface", desc: "Layout breaks, responsive issues, or typography errors on any device.", color: "bg-blue-300" },
            { icon: <Zap />, title: "Performance", desc: "Slow load times, rendering lag, or memory leaks impacting usability.", color: "bg-yellow-300" },
            { icon: <Terminal />, title: "Functionality", desc: "Broken buttons, form submission failures, or routing 404s.", color: "bg-green-300" },
            { icon: <Server />, title: "Backend API", desc: "Syncing issues with GitHub/Codeforces, timeouts, or data mismatches.", color: "bg-red-300" },
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={popIn}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-gray-50 border-4 border-black p-8 transition-all duration-300 flex flex-col h-full overflow-hidden"
            >
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
              
              <div className={`relative z-10 w-16 h-16 rounded-none border-4 border-black flex items-center justify-center mb-8 ${feature.color} text-black group-hover:bg-white group-hover:-rotate-6 transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
                <div className="w-8 h-8">{feature.icon}</div>
              </div>
              <h3 className="relative z-10 text-2xl font-black uppercase tracking-widest mb-4 group-hover:text-white transition-colors duration-300">{feature.title}</h3>
              <p className="relative z-10 text-sm font-bold tracking-widest text-gray-500 leading-relaxed uppercase mt-auto group-hover:text-gray-300 transition-colors duration-300">
                {feature.desc}
              </p>
              
              <div className="absolute top-0 right-0 w-8 h-8 border-l-4 border-b-4 border-black opacity-0 group-hover:border-white group-hover:opacity-100 transition-opacity z-10"></div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───── How to Write a Good Bug Report (Split Layout) ───── */}
      <section id="report-guide" className="relative bg-black text-white py-32 border-y-4 border-black overflow-hidden">
        {/* Background typographic noise with parallax */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 opacity-[0.03] text-[12vw] font-black leading-none break-words overflow-hidden select-none pointer-events-none w-[150%] -left-[25%] top-[-20%]">
          BUG REPORT FIX DEBUG ERROR TRACE EXCEPTION FAIL LOG PATCH ISSUE BUG REPORT FIX DEBUG ERROR
        </motion.div>
        
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            
            <motion.div 
              className="flex-1 w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.div variants={slideRight} className="inline-block px-4 py-1 border-2 border-white/20 text-xs font-black uppercase tracking-widest mb-8">
                The Gold Standard
              </motion.div>
              <motion.h2 variants={slideRight} className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                Anatomy of a <br /> Perfect Report
              </motion.h2>

              <div className="space-y-12 mt-16">
                {[
                  { step: "01", title: "Reproducible Steps", desc: "List the exact sequence of actions that triggered the bug. If we can't reproduce it, we can't fix it." },
                  { step: "02", title: "Expected Context", desc: "Explain what you thought should happen versus what actually broke." },
                  { step: "03", title: "Environment Data", desc: "Include your browser version, OS, and device. Bugs often hide in specific environments." }
                ].map((item, idx) => (
                  <motion.div key={idx} variants={popIn} className="flex gap-8 group">
                    <div className="text-4xl font-black text-white/20 group-hover:text-blue-400 group-hover:-translate-y-2 transition-all duration-300">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-widest mb-3 group-hover:text-blue-400 transition-colors duration-300">{item.title}</h4>
                      <p className="text-sm font-bold tracking-widest text-gray-400 uppercase leading-relaxed max-w-md">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Interactive Preview Card */}
            <motion.div 
              className="flex-1 w-full max-w-xl"
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="bg-white text-black border-4 border-white p-8 shadow-[20px_20px_0px_0px_rgba(59,130,246,0.6)] hover:shadow-[10px_10px_0px_0px_rgba(59,130,246,0.8)] hover:translate-x-2 hover:translate-y-2 transition-all duration-300">
                <div className="flex items-center gap-3 mb-8 border-b-4 border-black pb-4">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm font-black tracking-widest uppercase">Issue Template.md</span>
                  <div className="ml-auto flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">## Description</div>
                    <div className="h-4 bg-gray-200 w-full mb-2 overflow-hidden relative">
                      <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"></motion.div>
                    </div>
                    <div className="h-4 bg-gray-200 w-3/4"></div>
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">## Steps to Reproduce</div>
                    <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-black"></div><div className="h-3 bg-gray-200 w-1/2"></div></div>
                    <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-black"></div><div className="h-3 bg-gray-200 w-2/3"></div></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-black"></div><div className="h-3 bg-gray-200 w-1/3"></div></div>
                  </div>
                  <div className="pt-4 border-t-2 border-black/10 flex justify-end mt-8">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black cursor-pointer"
                    >
                      Submit issue
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── Giant CTA Section ───── */}
      <section className="relative px-6 sm:px-8 lg:px-12 py-40 bg-[#fffbcc] overflow-hidden">
        {/* Large decorative floating elements */}
        <motion.div 
          animate={{ y: [-20, 20, -20], rotate: [0, 15, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20"
        >
          <Code className="w-40 h-40 text-black/5" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [20, -20, 20], rotate: [0, -15, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20"
        >
          <Bug className="w-56 h-56 text-black/5" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10"
        >
          {/* Enhanced Checkbox background */}
          <motion.div variants={popIn} className="relative mb-12 group">
            {/* Multi-layered staggered shapes */}
            <div className="absolute inset-0 bg-blue-500 rounded-[30%] rotate-[15deg] group-hover:rotate-[45deg] group-hover:scale-110 transition-transform duration-500 shadow-xl"></div>
            <div className="absolute inset-0 bg-purple-500 rounded-[30%] -rotate-[15deg] group-hover:-rotate-[45deg] group-hover:scale-110 transition-transform duration-500 shadow-xl mix-blend-multiply"></div>
            
            <div className="relative w-28 h-28 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-full flex items-center justify-center z-10 group-hover:-translate-y-2 group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <CheckCircle className="w-14 h-14 text-black" />
            </div>
          </motion.div>
          
          <motion.h2 variants={popIn} className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
            Ready to squash <br /> some bugs?
          </motion.h2>
          
          <motion.p variants={popIn} className="text-lg font-bold tracking-widest text-black/60 uppercase leading-relaxed mb-12 max-w-2xl mx-auto">
            Your contributions keep the CodeLens engine running smoothly for thousands of developers. Head to our GitHub repository and open an issue today.
          </motion.p>
          
          <motion.div variants={popIn}>
            <a 
              href="https://github.com/kunalverma2512/CodeLens/issues" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-6 bg-black text-white px-10 py-6 text-lg font-black tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:-translate-x-2"
            >
              <span className="relative z-10 group-hover:text-blue-300 transition-colors">View GitHub Issues</span>
              <span className="relative z-10 w-12 h-12 bg-white border-2 border-black text-black flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                <ArrowRight className="w-6 h-6 group-hover:rotate-[-45deg] transition-transform duration-300" />
              </span>
            </a>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
};

export default BugReportsPage;
