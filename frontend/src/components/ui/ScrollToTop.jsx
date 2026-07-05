
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [showButton, setShowButton] = useState(false);

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      setShowButton(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full 
                     bg-black text-white 
                     flex items-center justify-center 
                     shadow-lg hover:shadow-2xl 
                     hover:bg-white hover:text-black 
                     transition-all duration-300 
                     transform hover:scale-110 active:scale-95
                     z-[99999]"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  );
}