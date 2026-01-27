/**
 * ScrollToTop Component
 * 
 * Scrolls the window to the top whenever the route changes.
 * This ensures users always start at the top of the page when navigating.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top smoothly on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scroll, 'smooth' for animation
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
