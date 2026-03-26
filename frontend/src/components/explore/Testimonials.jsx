export default function Testimonials() {
  return (
    <div className="w-full px-6 py-20 md:py-32 min-h-screen flex flex-col justify-center items-center border-b-[4px] border-black bg-white">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black mb-16 sm:mb-20 text-center leading-none">Verified Impact</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 w-full">
          <div className="border-[4px] border-black p-8 sm:p-12 shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[16px_16px_0_0_rgba(0,0,0,1)] md:hover:-translate-y-2 transition-transform w-full">
            <p className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-tight mb-10 break-words">"I stopped guessing. CodeLens told me exactly what I was lacking in greedy algorithms. Two weeks later, I cleared my technical screen."</p>
            <p className="font-bold uppercase tracking-widest text-sm sm:text-base">— L3 Engineer, Big Tech</p>
          </div>
          <div className="border-[4px] border-black p-8 sm:p-12 bg-black text-white shadow-[8px_8px_0_0_rgba(200,200,200,1)] md:hover:-translate-y-2 transition-transform w-full">
            <p className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-tight mb-10 text-white break-words">"The consolidation of Codeforces and GitHub makes my imposter syndrome disappear. The data doesn't lie."</p>
            <p className="font-bold uppercase tracking-widest text-sm sm:text-base text-gray-300">— Open Source Maintainer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
