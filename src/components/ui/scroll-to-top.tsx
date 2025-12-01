import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Handle hash links (anchors)
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Scroll to top on route change (no hash)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' for immediate scroll to top
      });
    }
  }, [pathname, hash]);

  // Also handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (!hash) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }, 10);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hash]);

  return null;
};

export default ScrollToTop;
