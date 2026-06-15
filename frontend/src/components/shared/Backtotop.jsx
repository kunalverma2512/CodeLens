import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa6';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50
        h-12 w-12 rounded-full
        bg-black text-white
        shadow-lg shadow-cyan-500/30
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110 hover:bg-cyan-400
        ${
          visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
    >
      <FaArrowUp />
    </button>
  );
};

export default BackToTop;