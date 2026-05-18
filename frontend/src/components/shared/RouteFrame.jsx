import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";

export default function RouteFrame({ children }) {
  const location = useLocation();
  const { setLoading } = useLoading();
  const firstRender = useRef(true);

  useEffect(() => {
    setLoading(true);
    const timeoutMs = firstRender.current ? 180 : 280;
    const timer = setTimeout(() => {
      setLoading(false);
      firstRender.current = false;
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [location.pathname, setLoading]);

  return (
    <div key={location.key || location.pathname} className="page-fade-in w-full flex-1 flex flex-col">
      {children}
    </div>
  );
}
