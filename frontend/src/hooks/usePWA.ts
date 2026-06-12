import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type Platform = 'ios' | 'android' | 'desktop' | 'unknown';

function detectPlatform(): Platform {
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/Windows|Macintosh|Linux/.test(ua) && !/Mobile/.test(ua)) return 'desktop';
  return 'unknown';
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hasNativePrompt, setHasNativePrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [platform] = useState<Platform>(detectPlatform);

  useEffect(() => {
    // Check if already running as installed app
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check session dismissal
    if (sessionStorage.getItem('pwa_dismissed') === 'true') {
      setDismissed(true);
    }

    // Capture native install prompt if browser supports it
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setHasNativePrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setHasNativePrompt(false);
      setDeferredPrompt(null);
      setShowGuide(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show the prompt after a short delay so it doesn't flash on load
    const timer = setTimeout(() => setReady(true), 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const install = useCallback(async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setHasNativePrompt(false);
          setDeferredPrompt(null);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setIsInstalling(false);
      }
    }
    setShowGuide(true);
    return false;
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setShowGuide(false);
    sessionStorage.setItem('pwa_dismissed', 'true');
  }, []);

  const closeGuide = useCallback(() => {
    setShowGuide(false);
  }, []);

  return {
    canShow: ready && !isInstalled && !dismissed,
    hasNativePrompt,
    isInstalled,
    isInstalling,
    dismissed,
    showGuide,
    platform,
    install,
    dismiss,
    closeGuide,
  };
}
