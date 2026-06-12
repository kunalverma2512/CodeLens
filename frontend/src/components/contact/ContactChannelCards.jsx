import { Mail, Bug, Lightbulb, MessageCircle, ArrowUpRight } from "lucide-react";

const channels = [
  {
    icon: Mail,
    title: "Email",
    description: "Send us an email directly for inquiries and support.",
    href: "mailto:hello@codelens.dev",
  },
  {
    icon: Bug,
    title: "GitHub Issues",
    description: "Report bugs and track progress on existing issues.",
    href: "https://github.com/kunalverma2512/CodeLens/issues",
  },
  {
    icon: Lightbulb,
    title: "Feature Request",
    description: "Suggest new features and help shape the roadmap.",
    href: "https://github.com/kunalverma2512/CodeLens/discussions",
  },
  {
    icon: MessageCircle,
    title: "Discord Community",
    description: "Join our community for real-time discussions and help.",
    href: "#",
  },
];

export default function ContactChannelCards() {
  return (
    <section className="w-full px-6 sm:px-10 lg:px-16 pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.title}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition-colors duration-200 group-hover:bg-emerald-50 group-hover:text-emerald-600">
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
