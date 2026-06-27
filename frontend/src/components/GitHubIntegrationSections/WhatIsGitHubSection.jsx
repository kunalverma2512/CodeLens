export default function WhatIsGitHubSection() {
  return (
    <>
      <section className="bg-white border-b-[4px] border-black px-6 sm:px-12 lg:px-24 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <span className="inline-block text-[10px] font-black tracking-widest border-2 border-black px-3 py-1 mb-8 uppercase">
            What Is GitHub
          </span>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                GitHub,<br />Explained Simply
              </h2>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-6">
                GitHub was founded in 2008 by Tom Preston-Werner, Chris Wanstrath,
                and PJ Hyett. It hosts code using Git, the version control system
                that tracks every change made to a project over time.
              </p>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-6">
                Developers use GitHub to store repositories, propose changes
                through pull requests, review each other's code, and collaborate
                on projects ranging from solo experiments to massive open-source
                software used by millions.
              </p>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                It is not affiliated with CodeLens. CodeLens uses GitHub's public
                API to read your repository and contribution data — with your
                permission — to provide analytics inside the CodeLens platform.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black pb-3 mb-4">
                Core Concepts
              </h3>
              {[
                {
                  title: "Repository",
                  desc: "A project's folder — containing all its code, files, and full version history.",
                },
                {
                  title: "Commit",
                  desc: "A saved snapshot of changes, with a message describing what was done and why.",
                },
                {
                  title: "Branch",
                  desc: "An independent line of work, allowing changes to be made without affecting the main codebase.",
                },
                {
                  title: "Pull Request",
                  desc: "A proposal to merge changes from one branch into another, usually reviewed before merging.",
                },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  className="border-[3px] border-gray-700 p-6 hover:border-black transition-colors mb-4"
                >
                  <h4 className="text-sm font-black uppercase tracking-widest mb-2">
                    {title}
                  </h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b-[4px] border-black px-6 sm:px-12 lg:px-24 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <span className="inline-block text-[10px] font-black tracking-widest border-2 border-black px-3 py-1 mb-8 uppercase">
            Real Benefits
          </span>
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-12">
            Why GitHub Matters<br />For Developers
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black pb-3 mb-6">
                For Students
              </h3>
              <div className="flex flex-col gap-6">
                {[
                  {
                    title: "Build a Real Portfolio",
                    desc: "Unlike grades or certificates, a GitHub profile shows actual working code — projects recruiters and professors can open and inspect directly.",
                  },
                  {
                    title: "Learn Real Collaboration",
                    desc: "Pull requests, code review, and merge conflicts teach how professional software is actually built — skills no classroom assignment can fully replicate.",
                  },
                  {
                    title: "Stand Out in Applications",
                    desc: "A consistent commit history and a few well-documented projects are a concrete signal of initiative — far stronger than a generic resume bullet point.",
                  },
                  {
                    title: "Contribute to Open Source",
                    desc: "Fixing real bugs in real projects exposes you to production-quality codebases far larger and messier than anything in a course.",
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <span className="w-2 h-2 bg-black flex-shrink-0 mt-2" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest mb-1">
                        {title}
                      </h4>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black pb-3 mb-6">
                For Working Developers
              </h3>
              <div className="flex flex-col gap-6">
                {[
                  {
                    title: "Track Your Real Output",
                    desc: "Day job repositories are often private — your public GitHub activity is what actually proves your skills to the outside world.",
                  },
                  {
                    title: "Switch Roles or Companies",
                    desc: "A strong public profile with relevant projects speaks louder in interviews than a resume line, especially for senior or specialised roles.",
                  },
                  {
                    title: "Build Credibility in the Community",
                    desc: "Maintaining or contributing to respected open-source projects builds a reputation that follows you independently of any single employer.",
                  },
                  {
                    title: "Document Your Growth",
                    desc: "Years of commits and projects create a visible record of how your skills have evolved — useful for yourself as much as for others.",
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <span className="w-2 h-2 bg-black flex-shrink-0 mt-2" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest mb-1">
                        {title}
                      </h4>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}