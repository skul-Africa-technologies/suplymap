import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import Button from './ui/Button';
import { InstallButton } from './InstallPrompt';
import { usePWA } from '../hooks/usePWA';

function MobileInstallButton() {
  const { canInstall, isInstalled, isInstalling, install } = usePWA();

  if (!canInstall || isInstalled) return null;

  return (
    <button
      type="button"
      onClick={install}
      disabled={isInstalling}
      className="flex items-center justify-center gap-2 w-full h-11 text-sm font-medium text-brand-primary border border-brand-accent/30 bg-brand-accent/5 rounded-lg hover:bg-brand-accent/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download size={16} />
      {isInstalling ? 'Installing…' : 'Install App'}
    </button>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-app-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo.png"
            alt="SupplyMap"
            className="h-7 sm:h-8 w-auto"
          />
          <span className="font-bold text-lg sm:text-xl text-brand-deep">SupplyMap</span>
        </Link>

        {/* Desktop buttons */}
        <div className="hidden sm:flex gap-2.5 items-center">
          <InstallButton />
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Log in
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg text-text-primary hover:bg-app-bg transition-colors cursor-pointer"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.15 }}
              >
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 top-14 bg-black/20 backdrop-blur-sm sm:hidden z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="absolute top-14 left-0 right-0 bg-white border-b border-app-border shadow-lg sm:hidden z-50"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="px-4 py-5 flex flex-col gap-3">
                <MobileInstallButton />
                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
