import AboutCarousel from "../components/about/AboutCarousel";

export default function AboutCodeLensPage() {
  const problems = [
    {
      title: "Learning Inconsistency",
      desc: "Learners often struggle to maintain a consistent learning routine.",
    },
    {
      title: "Lack of Structured Growth",
      desc: "Without clear roadmaps, progress becomes difficult to measure.",
    },
    {
      title: "Progress Tracking",
      desc: "Tracking growth across multiple platforms is challenging.",
    },
    {
      title: "Fragmented Resources",
      desc: "Learning materials are scattered across countless websites.",
    },
  ];

  const values = [
    "Consistency",
    "Growth",
    "Simplicity",
    "Accessibility",
    "Community",
  ];

  const features = [
    {
      title: "Learning Analytics",
      desc: "Track your learning journey and understand your growth.",
    },
    {
      title: "Structured Roadmaps",
      desc: "Follow clear pathways to master skills effectively.",
    },
    {
      title: "GitHub Intelligence",
      desc: "Analyze repositories and improve development workflows.",
    },
    {
      title: "Competitive Programming",
      desc: "Monitor coding progress and contest performance.",
    },
    {
      title: "AI Assistance",
      desc: "Get intelligent support throughout your learning journey.",
    },
    {
      title: "Community Driven",
      desc: "Grow together through collaboration and contributions.",
    },
  ];

  return (
    <div className="w-full overflow-hidden">

      {/* HERO */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <p className="uppercase tracking-[0.4em] text-zinc-400 text-sm mb-4">
              About CodeLens
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-8">
              Empowering
              <br />
              Consistent Learning
              <br />
              & Growth
            </h1>

            <p className="text-zinc-300 text-lg leading-8 max-w-xl">
              CodeLens helps learners stay consistent, track progress,
              build meaningful skills, and discover opportunities through
              a structured ecosystem designed for long-term growth.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-10 border border-zinc-800 shadow-2xl">
            <div className="font-mono text-sm space-y-4">
              <p>{">"} Learn consistently</p>
              <p>{">"} Build real skills</p>
              <p>{">"} Measure growth</p>
              <p>{">"} Discover opportunities</p>
              <p>{">"} Join a thriving community</p>
            </div>
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 border-b border-zinc-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">

          <div>
            <h3 className="text-4xl font-black">All-in-One</h3>
            <p className="text-zinc-500 mt-2">Learning Platform</p>
          </div>

          <div>
            <h3 className="text-4xl font-black">Growth</h3>
            <p className="text-zinc-500 mt-2">Focused Ecosystem</p>
          </div>

          <div>
            <h3 className="text-4xl font-black">Community</h3>
            <p className="text-zinc-500 mt-2">Driven Development</p>
          </div>

          <div>
            <h3 className="text-4xl font-black">Future</h3>
            <p className="text-zinc-500 mt-2">Ready Learning</p>
          </div>

        </div>
      </section>

      {/* STORY */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-5xl font-black mb-14">
            Our Story
          </h2>

          <div className="grid lg:grid-cols-2 gap-10">

            <div className="bg-zinc-50 rounded-3xl p-10 border">
              <span className="text-6xl font-black text-zinc-300">
                01
              </span>

              <h3 className="text-2xl font-bold mt-6 mb-4">
                The Challenge
              </h3>

              <p className="text-zinc-600 leading-8">
                Learning often feels fragmented. Resources are scattered,
                progress is difficult to track, and consistency becomes
                challenging.
              </p>
            </div>

            <div className="bg-black text-white rounded-3xl p-10">
              <span className="text-6xl font-black text-zinc-700">
                02
              </span>

              <h3 className="text-2xl font-bold mt-6 mb-4">
                The Solution
              </h3>

              <p className="text-zinc-300 leading-8">
                CodeLens brings learning, practice, analytics, and
                opportunities into one unified experience.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* PROBLEMS */}
      <section className="bg-zinc-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-black text-center mb-16">
            Problems We Solve
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {problems.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border p-8 hover:shadow-xl transition"
              >
                <h3 className="font-bold text-xl mb-4">
                  {item.title}
                </h3>

                <p className="text-zinc-600">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* MISSION VISION */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

          <div className="border rounded-3xl p-10">
            <h2 className="text-4xl font-black mb-6">
              Our Mission
            </h2>

            <p className="text-zinc-600 leading-8">
              To create an accessible, structured, and engaging learning
              environment that enables learners to achieve consistent growth.
            </p>
          </div>

          <div className="bg-black text-white rounded-3xl p-10">
            <h2 className="text-4xl font-black mb-6">
              Our Vision
            </h2>

            <p className="text-zinc-300 leading-8">
              To build a global ecosystem where every learner can track
              progress, unlock opportunities, and achieve their potential.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-zinc-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-black text-center mb-16">
            Platform Highlights
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border rounded-3xl p-8 hover:-translate-y-1 transition"
              >
                <div className="h-1 w-16 bg-black mb-6"></div>

                <h3 className="text-xl font-bold mb-4">
                  {feature.title}
                </h3>

                <p className="text-zinc-600">
                  {feature.desc}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CAROUSEL */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-5xl font-black text-center mb-12">
            Explore CodeLens
          </h2>

          <AboutCarousel />

        </div>
      </section>

      {/* VALUES */}
      <section className="bg-zinc-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-black text-center mb-16">
            Core Values
          </h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">

            {values.map((value) => (
              <div
                key={value}
                className="bg-white border rounded-2xl p-8 text-center font-bold hover:bg-black hover:text-white transition"
              >
                {value}
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* COMMUNITY */}
      <section className="bg-black text-white py-20 px-6">

        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-5xl font-black mb-8">
            Community Driven Development
          </h2>

          <p className="text-zinc-300 text-lg leading-8 max-w-3xl mx-auto mb-16">
            CodeLens evolves through feedback, collaboration, and
            contributions from learners and developers around the world.
          </p>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="border border-zinc-700 rounded-2xl p-8">
              Open Source
            </div>

            <div className="border border-zinc-700 rounded-2xl p-8">
              Collaboration
            </div>

            <div className="border border-zinc-700 rounded-2xl p-8">
              Innovation
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">

        <h2 className="text-5xl font-black mb-6">
          Start Your Learning Journey
        </h2>

        <p className="text-zinc-600 text-lg mb-10">
          Explore CodeLens and unlock consistent growth.
        </p>

        <a
          href="/explore"
          className="inline-block px-10 py-4 bg-black text-white rounded-xl font-semibold hover:opacity-90"
        >
          Explore Platform
        </a>

      </section>

    </div>
  );
}