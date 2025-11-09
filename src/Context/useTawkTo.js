// hooks/useTawkTo.js
import { useEffect } from 'react';

const useTawkTo = () => {
  useEffect(() => {
    // Check if TawkTo is already loaded to prevent duplicates
    if (window.Tawk_API) return;

    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];
    
    s1.async = true;
    s1.src = 'https://embed.tawk.to/690e5789c7778b19591c2f67/1j9g0bsl2';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);

    // Cleanup function to remove script if component unmounts
    return () => {
      if (s1.parentNode) {
        s1.parentNode.removeChild(s1);
      }
    };
  }, []);
};

export default useTawkTo;