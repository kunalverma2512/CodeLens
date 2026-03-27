import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t-[4px] border-black pt-16 pb-8 px-8 flex-shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div className="flex flex-col max-w-sm">
          <Link to="/" className="text-4xl font-black tracking-tighter uppercase text-black mb-6 inline-block hover:text-gray-800">
            CodeLens
          </Link>
          <p className="text-black font-bold uppercase tracking-widest text-sm leading-relaxed">
            Shatter stagnation. Unify your coder journey across all platforms with AI-driven insights. No distractions.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-12 md:gap-24">
          <div className="flex flex-col space-y-5">
            <h3 className="font-black text-black uppercase tracking-tighter text-xl mb-2 border-b-[3px] border-black pb-2 inline-block">Platform</h3>
            <Link to="/dashboard" className="text-black font-black text-sm uppercase tracking-widest hover:underline underline-offset-8 decoration-[3px]">Dashboard</Link>
            <Link to="/features" className="text-black font-black text-sm uppercase tracking-widest hover:underline underline-offset-8 decoration-[3px]">Features</Link>
            <Link to="/pricing" className="text-black font-black text-sm uppercase tracking-widest hover:underline underline-offset-8 decoration-[3px]">Pricing</Link>
          </div>
          
          <div className="flex flex-col space-y-5">
            <h3 className="font-black text-black uppercase tracking-tighter text-xl mb-2 border-b-[3px] border-black pb-2 inline-block">Integrations</h3>
            <a href="#" className="text-black font-black text-sm uppercase tracking-widest hover:underline underline-offset-8 decoration-[3px]">GitHub Sync</a>
            <a href="#" className="text-black font-black text-sm uppercase tracking-widest hover:underline underline-offset-8 decoration-[3px]">LeetCode Auth</a>
            <a href="#" className="text-black font-black text-sm uppercase tracking-widest hover:underline underline-offset-8 decoration-[3px]">Codeforces API</a>
          </div>

          <div className="flex flex-col space-y-5">
            <h3 className="font-black text-black uppercase tracking-tighter text-xl mb-2 border-b-[3px] border-black pb-2 inline-block">Legal</h3>
            <Link to="/privacy" className="text-black font-black text-sm uppercase tracking-widest hover:underline underline-offset-8 decoration-[3px]">Privacy Policy</Link>
            <Link to="/terms" className="text-black font-black text-sm uppercase tracking-widest hover:underline underline-offset-8 decoration-[3px]">Terms of Service</Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t-[4px] border-black pt-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm font-black text-black uppercase tracking-widest">
          &copy; {new Date().getFullYear()} CodeLens. All Rights Reserved.
        </p>
        <div className="flex space-x-8 mt-6 md:mt-0">
          <a href="#" className="text-sm font-black text-black uppercase tracking-widest hover:underline underline-offset-8 decoration-[3px]">Twitter</a>
          <a href="#" className="text-sm font-black text-black uppercase tracking-widest hover:underline underline-offset-8 decoration-[3px]">LinkedIn</a>
          <a href="#" className="text-sm font-black text-black uppercase tracking-widest hover:underline underline-offset-8 decoration-[3px]">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
