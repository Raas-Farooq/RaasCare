import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";


const myVariants = {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    slide: { initial: { x: 50, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -50, opacity: 0 } }
}

const PageTransition = {
    type: 'tween' as const,
    ease: 'easeInOut' as const,
    duration: 0.4
}

interface PageWrapperProps {
    children?: React.ReactNode,
    variant?: keyof typeof myVariants
}

export default function PageWrapper({ children, variant = "fade" }: PageWrapperProps) {
  const location = useLocation();

  return (

      <motion.div
        key={location.pathname}
        variants={myVariants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={PageTransition}
      >
       {children ||  <Outlet />}
      </motion.div>

  );
}

// standard file structure: https://share.google/aimode/z41aLgWfkj84nFPxr
// interview prep for Mern 
// https://share.google/aimode/rb3zADzj0eyszOO6q

// 15 Day LeetCode Plan
// https://share.google/aimode/vUp9Skvgxg22yb1hK