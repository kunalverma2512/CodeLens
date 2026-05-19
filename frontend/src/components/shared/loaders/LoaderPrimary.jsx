const Spinner = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen flex items-center justify-center bg-white overflow-hidden"
    >
      <span className="sr-only">Loading, please wait...</span>
      <div className="relative w-32 h-32 animate-rotate">
        {/* Outer Square */}
        <div className="absolute inset-0 border-[5px] border-black animate-scale-1" />

        {/* Middle Square */}
        <div className="absolute inset-4 border-[5px] border-black animate-scale-2" />

        {/* Inner Square */}
        <div className="absolute inset-8 border-[5px] border-black animate-scale-3" />

        {/* Center Block */}
        <div className="absolute inset-0 m-auto w-5 h-5 bg-black animate-core" />
      </div>

      <style>
        {`
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes scaleOne {
            0%,100% {
              transform: scale(1);
              opacity: 1;
            }

            50% {
              transform: scale(0.75);
              opacity: 0.4;
            }
          }

          @keyframes scaleTwo {
            0%,100% {
              transform: scale(0.9);
              opacity: 0.8;
            }

            50% {
              transform: scale(1.15);
              opacity: 0.3;
            }
          }

          @keyframes scaleThree {
            0%,100% {
              transform: scale(1);
              opacity: 1;
            }

            50% {
              transform: scale(0.6);
              opacity: 0.2;
            }
          }

          @keyframes core {
            0%,100% {
              transform: scale(1);
            }

            50% {
              transform: scale(2);
            }
          }

          .animate-rotate {
            animation: rotate 6s linear infinite;
          }

          .animate-scale-1 {
            animation: scaleOne 2s ease-in-out infinite;
          }

          .animate-scale-2 {
            animation: scaleTwo 2s ease-in-out infinite;
          }

          .animate-scale-3 {
            animation: scaleThree 2s ease-in-out infinite;
          }

          .animate-core {
            animation: core 1s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;