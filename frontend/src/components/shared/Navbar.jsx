import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-6 bg-white border-b-[3px] border-black flex-shrink-0">
      <Link to="/" className="text-3xl font-black tracking-tighter uppercase text-black hover:text-gray-800">
        CodeLens
      </Link>
      <div className="flex items-center space-x-8">
        <Link to="/login" className="text-sm font-black uppercase tracking-widest text-black hover:underline underline-offset-8 decoration-[3px]">
          Login
        </Link>
        <Link to="/signup" className="px-8 py-4 bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-gray-900 transition-colors border-[3px] border-black rounded-none">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
