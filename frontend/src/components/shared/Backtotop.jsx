import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    toggleVisibility();

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
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-50
        flex h-12 w-12 items-center justify-center
        rounded-full bg-black text-white
        shadow-lg shadow-cyan-500/30
        transition-all duration-300
        hover:scale-110 hover:bg-cyan-400
        ${
          visible
            ? 'opacity-100 translate-y-0'
            : 'pointer-events-none opacity-0 translate-y-4'
        }`}
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default BackToTop;
