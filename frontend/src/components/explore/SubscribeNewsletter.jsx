export default function SubscribeNewsletter() {
  return (
    <div className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-[4px] border-black bg-gray-50 text-black">
      <div className="max-w-5xl mx-auto w-full text-center">
        <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
          Join the Elite Waitlist
        </h2>
        <p className="text-lg sm:text-2xl font-bold uppercase tracking-widest max-w-3xl mx-auto mb-16 leading-relaxed text-black">
          Receive exclusive early access to the unified engine and a weekly systems design newsletter. No spam. Pure signal.
        </p>
        <form className="w-full max-w-3xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-0">
          <input 
            type="email" 
            placeholder="YOUR@EMAIL.COM" 
            required 
            className="flex-1 w-full bg-white text-black text-lg sm:text-2xl font-black uppercase tracking-widest px-8 py-6 border-[4px] border-black focus:outline-none focus:ring-0 focus:bg-gray-100 transition-colors placeholder-gray-400 rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,1)] lg:shadow-none"
          />
          <button 
            type="submit" 
            className="w-full lg:w-auto px-12 py-6 bg-black text-white text-xl sm:text-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors border-[4px] border-black lg:border-l-[0px] rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,1)] lg:shadow-none lg:hover:-translate-y-1 lg:hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
