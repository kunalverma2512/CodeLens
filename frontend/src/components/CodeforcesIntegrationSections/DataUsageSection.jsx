export default function DataUsageSection() {
  return (
    <section className="bg-gray-50 border-b-[4px] border-black px-6 sm:px-12 lg:px-24 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <span className="inline-block text-[10px] font-black tracking-widest border-2 border-black px-3 py-1 mb-8 uppercase">
          Data Usage
        </span>

        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-12">
          How CodeLens Uses<br />Your Codeforces Data
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* What we fetch */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black pb-3 mb-6">
              What We Fetch
            </h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  item: "Public Profile",
                  detail: "Handle, rating, max rating, rank, country, and avatar — all publicly visible on Codeforces.",
                },
                {
                  item: "Rating History",
                  detail: "Your rating changes after each rated contest — used to plot your progression chart.",
                },
                {
                  item: "Submission History",
                  detail: "Recent submissions including problem name, verdict, language, and timestamp.",
                },
                {
                  item: "Contest Participation",
                  detail: "Contests you have participated in, your rank, and rating delta per contest.",
                },
              ].map(({ item, detail }) => (
                <div
                  key={item}
                  className="border-[3px] border-black bg-white p-5"
                >
                  <h4 className="text-xs font-black uppercase tracking-widest mb-2">
                    {item}
                  </h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* What we don't do */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black pb-3 mb-6">
              What We Never Do
            </h3>
            <div className="flex flex-col gap-4">
              {[
                "Access your Codeforces password or login credentials",
                "Store your data beyond what is needed for analytics",
                "Share your data with third parties",
                "Post or submit anything on your behalf",
                "Access private submissions or locked problem editorials",
                "Use your data for advertising or profiling",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 border-[3px] border-black bg-white p-5"
                >
                  <span className="text-lg font-black flex-shrink-0">✕</span>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}