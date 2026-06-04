const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Message sent!");
        e.target.reset();
    };

    return (
        <main>
            <title>Contact- CodeLens</title>
            <meta
                name="description"
                content="Get in touch with the CodeLens team. Have questions, feedback, or need support? Contact us and we'll be happy to help."
            />
            <section className="border-b-4 border-black px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                    <div className="flex flex-col gap-3">
                        <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-black">
                            Get in touch
                        </p>
                        <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-7xl lg:text-7xl">
                            Let's build the future together
                        </h1>
                        <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-black">Have questions, partnership inquiries, or feedback? We'd love to hear from you.</p>
                        <div className="flex flex-col gap-5">

                            {[
                                {
                                    name: "GitHub",
                                    desc: "Star us & contribute",
                                    href: "https://github.com/",
                                    icon: (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: "X / Twitter",
                                    desc: "Follow for updates",
                                    href: "https://twitter.com/",
                                    icon: (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: "LinkedIn",
                                    desc: "Connect with the team",
                                    href: "https://linkedin.com/",
                                    icon: (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: "Discord",
                                    desc: "Join the community",
                                    href: "#",
                                    icon: (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.042.031.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.075.075 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                        </svg>
                                    ),
                                },
                            ].map((s) => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 hover:opacity-60 transition-opacity"
                                >
                                    <span className="w-9 h-9 border-2 border-black flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors duration-150">
                                        {s.icon}
                                    </span>
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-sm font-black uppercase tracking-widest text-black">
                                            {s.name}
                                        </span>
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                            {s.desc}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] sm:p-8 sm:shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
                        <h2 className="text-2xl font-black uppercase leading-none tracking-tight text-black sm:text-2xl lg:text-2xl">Send us a message</h2>
                        <p className="text-base font-bold leading-relaxed text-black sm:text-lg">
                            Fill out the form below and we will get back to you soon
                        </p>
                        <form className="mt-8 flex flex-col gap-3" onSubmit={handleSubmit}>
                            <div className="flex flex-col min-[1200px]:flex-row justify-start items-stretch gap-3 w-full">
                                <input name="firstName" type="text" placeholder="First name" className="w-full border-2 border-black text-base font-bold leading-relaxed uppercase p-1" />
                                <input name="lastName" type="text" placeholder="Last name" className="w-full border-2 border-black text-base font-bold leading-relaxed uppercase p-1" />
                            </div>
                            <input name="email" type="email" placeholder="Email address" className="w-full border-2 border-black text-base font-bold leading-relaxed uppercase p-1" />
                            <input name="subject" type="text" placeholder="Subject" className="w-full border-2 border-black text-base font-bold leading-relaxed uppercase p-1" />
                            <textarea name="message" rows={6} type="text" placeholder="Your message" className="w-full border-2 border-black text-base font-bold leading-relaxed uppercase p-1" />
                            <button type="submit" className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 bg-black text-white text-xl sm:text-xl md:text-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors border-4 border-black sm:border-l-[0px] rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-none sm:hover:-translate-y-1 sm:hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]">Send message</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Contact
