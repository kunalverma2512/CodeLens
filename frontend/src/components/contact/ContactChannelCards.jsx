import { Mail, Bug, Lightbulb, ArrowUpRight } from "lucide-react";

const channels = [
  {
    icon: Mail,
    title: "Email",
    description: "Fire off an email and we&apos;ll get back to you — fast.",
    href: "mailto:hello@codelens.dev",
  },
  {
    icon: Bug,
    title: "GitHub Issues",
    description: "Found a bug? Report it and we&apos;ll squash it.",
    href: "https://github.com/kunalverma2512/CodeLens/issues",
  },
  {
    icon: Lightbulb,
    title: "Feature Request",
    description: "Got an idea? Drop it and help us shape the future.",
    href: "https://github.com/kunalverma2512/CodeLens/discussions",
  },
];

export default function ContactChannelCards() {
  return (
    <section className="w-full px-6 sm:px-10 lg:px-16 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.title}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center bg-neutral-100 text-neutral-600 transition-colors duration-200 group-hover:bg-neutral-200 group-hover:text-neutral-900">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-neutral-300 transition-all duration-200 group-hover:text-neutral-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="mt-4 font-semibold text-neutral-900">
                  {channel.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
                  {channel.description}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
