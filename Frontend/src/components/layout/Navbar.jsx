import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { cn } from '@/src/lib/utils.js';
import BrandLogo from '../common/BrandLogo';
import { clearUser, selectIsAuthenticated } from '../../redux/slices/authSlice';
import { clearChat } from '../../redux/slices/chatSlice';
import { clearEntitlements } from '../../redux/slices/entitlementSlice';
import { resetState } from '../../redux/store';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const NAV_LINKS = [
  { name: 'Pricing', href: '/pricing' },
  { name: 'About',   href: '/about'   },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isScrolled,     setIsScrolled]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method:  'POST',
        credentials: 'include',
      });
    } catch {
      // proceed with local logout regardless
    } finally {
      dispatch(clearUser());
      dispatch(clearChat());
      dispatch(clearEntitlements());
      dispatch(resetState());
      setMobileMenuOpen(false);
      navigate('/');
    }
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4',
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 py-3'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/">
          <BrandLogo logoHeight="h-15" textSize="text-xl" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm font-medium text-black/60 hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-black/60 hover:text-accent transition-colors"
              > 
                Chat
              </Link>
              <button
                onClick={handleLogout}
                className="btn-primary flex items-center gap-2 py-2 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-black/60 hover:text-accent transition-colors"
              >
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary flex items-center gap-2 py-2 text-sm">
                Start for free
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white border-t border-black/5 mt-4"
        >
          <div className="flex flex-col gap-4 p-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={closeMobile}
                className="text-lg font-medium text-black/70 hover:text-accent"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMobile}
                  className="text-lg font-medium text-black/70 hover:text-accent"
                >
                  Chat
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMobile}
                  className="text-lg font-medium text-black/70 hover:text-accent"
                >
                  Profile
                </Link>
                <button onClick={handleLogout} className="btn-primary w-full text-center">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="text-lg font-medium text-black/70 hover:text-accent"
                >
                  Sign In
                </Link>
                <Link to="/signup" onClick={closeMobile} className="btn-primary w-full text-center">
                  Start for free
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
