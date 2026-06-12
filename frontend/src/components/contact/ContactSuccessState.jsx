// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const RESPONSE_TIME = {
  General: "Within 24 hours",
  "Bug Report": "Within 48 hours",
  "Feature Request": "Within 1 week",
  Partnership: "Within 72 hours",
};

export default function ContactSuccessState({ category, onReset }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-start">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 mb-6"
      >
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-600"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.div>

      <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
        Thank you!
      </h3>
      <p className="mt-2 text-neutral-500 leading-relaxed max-w-sm">
        Your message has been submitted successfully. We&apos;ll review it and
        get back to you as soon as possible.
      </p>

      <div className="mt-6 flex flex-wrap gap-6">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400 mb-1">
            Category
          </p>
          <p className="text-sm font-medium text-neutral-900">{category}</p>
        </div>
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400 mb-1">
            Estimated response
          </p>
          <p className="text-sm font-medium text-neutral-900">
            {RESPONSE_TIME[category]}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Explore Dashboard
          <ArrowRight className="h-4 w-4" />
        </button>

        <a
          href="https://github.com/kunalverma2512/CodeLens/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-200 hover:border-neutral-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Check GitHub Issues
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="text-neutral-400"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 shadow-sm transition-all duration-200 hover:border-neutral-300 hover:text-neutral-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Send Another Message
        </button>
      </div>
    </div>
  );
}
