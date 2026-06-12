import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Share, MoreVertical, PlusSquare } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import type { Platform } from '../hooks/usePWA';

/* ─── Platform-specific install instructions ─── */

function InstallGuide({
  platform,
  onClose,
}: {
  platform: Platform;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-1"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0">
            <Smartphone size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              Install SupplyMap
            </h3>
            <p className="text-xs text-text-secondary">
              Add to your home screen
            </p>
          </div>
        </div>

        {platform === 'ios' && (
          <div className="space-y-4">
            <Step
              number={1}
              icon={<Share size={16} className="text-brand-accent" />}
              text={<>Tap the <strong>Share</strong> button in Safari&apos;s toolbar</>}
            />
            <Step
              number={2}
              icon={<PlusSquare size={16} className="text-brand-accent" />}
              text={<>Scroll down and tap <strong>Add to Home Screen</strong></>}
            />
            <Step
              number={3}
              icon={<Download size={16} className="text-brand-accent" />}
              text={<>Tap <strong>Add</strong> to confirm</>}
            />
          </div>
        )}

        {platform === 'android' && (
          <div className="space-y-4">
            <Step
              number={1}
              icon={<MoreVertical size={16} className="text-brand-accent" />}
              text={<>Tap the <strong>⋮ menu</strong> button in your browser</>}
            />
            <Step
              number={2}
              icon={<PlusSquare size={16} className="text-brand-accent" />}
              text={<>Tap <strong>Add to Home screen</strong> or <strong>Install app</strong></>}
            />
            <Step
              number={3}
              icon={<Download size={16} className="text-brand-accent" />}
              text={<>Tap <strong>Install</strong> to confirm</>}
            />
          </div>
        )}

        {(platform === 'desktop' || platform === 'unknown') && (
          <div className="space-y-4">
            <Step
              number={1}
              icon={<Download size={16} className="text-brand-accent" />}
              text={<>Look for the <strong>install icon</strong> (⊕) in your browser&apos;s address bar</>}
            />
            <Step
              number={2}
              icon={<PlusSquare size={16} className="text-brand-accent" />}
              text={<>Or open browser <strong>menu → Install SupplyMap</strong></>}
            />
            <Step
              number={3}
              icon={<Smartphone size={16} className="text-brand-accent" />}
              text={<>The app will open as a <strong>standalone window</strong></>}
            />
            <p className="text-xs text-text-secondary mt-2 pt-2 border-t border-app-border">
              Works best in Chrome, Edge, or Brave. Safari and Firefox have limited PWA support on desktop.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 h-10 text-sm font-medium text-text-secondary bg-app-bg hover:bg-app-border rounded-lg transition-colors cursor-pointer"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  );
}

function Step({
  number,
  icon,
  text,
}: {
  number: number;
  icon: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-7 h-7 rounded-full bg-brand-accent/10 flex items-center justify-center mt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary mb-0.5 font-medium">
          Step {number}
        </p>
        <p className="text-sm text-text-primary leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

/* ─── Floating toast prompt (always visible until dismissed) ─── */

export default function InstallPrompt() {
  const { canShow, isInstalling, showGuide, platform, install, dismiss, closeGuide } =
    usePWA();

  return (
    <>
      {/* Toast — bottom-right on desktop, bottom full-width on mobile */}
      <AnimatePresence>
        {canShow && !showGuide && (
          <motion.div
            key="install-toast"
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-[100]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="bg-white border border-app-border rounded-xl shadow-2xl shadow-black/15 p-4 sm:p-5 relative">
              <button
                type="button"
                onClick={dismiss}
                className="absolute top-3 right-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-1"
                aria-label="Dismiss install prompt"
              >
                <X size={16} />
              </button>

              <div className="flex gap-3.5">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                  <Smartphone size={20} className="text-white" />
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-0.5">
                    Install SupplyMap
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-3">
                    Add to your home screen for quick access — works offline too.
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={install}
                      disabled={isInstalling}
                      className="inline-flex items-center gap-1.5 bg-brand-primary text-white text-xs font-medium px-3.5 py-2 rounded-lg hover:bg-brand-deep active:bg-brand-deep transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download size={13} />
                      {isInstalling ? 'Installing…' : 'Install app'}
                    </button>
                    <button
                      type="button"
                      onClick={dismiss}
                      className="text-xs text-text-secondary hover:text-text-primary px-2.5 py-2 rounded-lg hover:bg-app-bg transition-colors cursor-pointer"
                    >
                      Not now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install guide modal */}
      <AnimatePresence>
        {showGuide && <InstallGuide platform={platform} onClose={closeGuide} />}
      </AnimatePresence>
    </>
  );
}

/* ─── Compact install button for Navbar ─── */

export function InstallButton() {
  const { canShow, isInstalling, install } = usePWA();

  if (!canShow) return null;

  return (
    <motion.button
      type="button"
      onClick={install}
      disabled={isInstalling}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-deep border border-brand-primary/30 hover:border-brand-primary bg-brand-accent/5 hover:bg-brand-accent/10 px-3 py-2 h-9 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      title="Install SupplyMap app"
    >
      <Download size={14} />
      <span className="hidden md:inline">Install</span>
    </motion.button>
  );
}
