const Spinner = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen flex flex-col items-center justify-center bg-white"
    >
      <span className="sr-only">Loading, please wait...</span>

      {/* CodeLens Logo */}
      <img
        src="/favicon.png"
        alt="CodeLens"
        className="h-12 w-12 mb-8"
      />

      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-10 h-10 ${
              i % 2 === 0 ? "bg-black" : "border-4 border-black"
            } animate-grid`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes grid {
            0%,100% {
              transform: scale(1);
              opacity: 1;
            }

            50% {
              transform: scale(0.45);
              opacity: 0.3;
            }
          }

          .animate-grid {
            animation: grid 1s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;