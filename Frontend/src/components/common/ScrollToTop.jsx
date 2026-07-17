import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop({ containerRef }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, containerRef]);

  return null;
}
