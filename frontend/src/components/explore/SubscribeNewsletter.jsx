export default function SubscribeNewsletter() {
  return (
    <div className="w-full px-4 sm:px-6 py-16 sm:py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-4 border-black bg-gray-50 text-black overflow-hidden">
      <div className="max-w-5xl mx-auto w-full text-center">
        <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 sm:mb-8 leading-none">
          Join the Elite Waitlist
        </h2>
        <p className="text-base sm:text-xl md:text-2xl font-bold uppercase tracking-widest max-w-3xl mx-auto mb-10 sm:mb-16 leading-relaxed text-black">
          Receive exclusive early access to the unified engine and a weekly systems design newsletter. No spam. Pure signal.
        </p>
        <form className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-0">
          <input 
            type="email" 
            placeholder="YOUR@EMAIL.COM" 
            required 
            className="flex-1 w-full bg-white text-black text-base sm:text-xl md:text-2xl font-black uppercase tracking-widest px-6 sm:px-8 py-4 sm:py-6 border-4 border-black focus:outline-none focus:ring-0 focus:bg-gray-100 transition-colors placeholder-gray-400 rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-none"
          />
          <button 
            type="submit" 
            className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 bg-black text-white text-lg sm:text-xl md:text-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors border-4 border-black sm:border-l-[0px] rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-none sm:hover:-translate-y-1 sm:hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
