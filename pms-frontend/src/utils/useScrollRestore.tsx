import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function useScrollRestore() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const key = location.pathname + location.search; // Include query params
  const ticking = useRef(false);
  const isRestoringRef = useRef(false);

  // ✅ Restore scroll on POP (Back/Forward)
  useLayoutEffect(() => {
    if (navigationType === "POP") {
      isRestoringRef.current = true;
      const saved = sessionStorage.getItem(key);
      const scrollPosition = saved ? Number(saved) : 0;
      
      // Delay to let framer-motion animation complete
      const timeoutId = setTimeout(() => {
        window.scrollTo(0, scrollPosition);
        isRestoringRef.current = false;
      }, 100); // Adjust timing to match your PageTransition duration (400ms)
      
      return () => clearTimeout(timeoutId);
    } else {
      // For PUSH/REPLACE, scroll to top immediately
      window.scrollTo(0, 0);
      isRestoringRef.current = false;
    }
  }, [key, navigationType]);

  // ✅ Save scroll position (throttled)
  useEffect(() => {
    const handleScroll = () => {
      // Don't save while restoring
      if (isRestoringRef.current) return;
      
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          sessionStorage.setItem(key, String(window.scrollY));
          ticking.current = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [key]);
}