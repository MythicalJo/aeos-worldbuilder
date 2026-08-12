import { PWAInstallPromptEvent } from '../types';

let deferredPrompt: PWAInstallPromptEvent | null = null;
const pwaListeners = new Set<() => void>();

export function initPWA() {
  if (typeof window === 'undefined') return;

  // Listen for beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as PWAInstallPromptEvent;
    notifyListeners();
  });

  // Listen for appinstalled
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyListeners();
  });

  // Register service worker in production or standard environment
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('SW registered:', reg.scope);
      }).catch((err) => {
        console.warn('SW registration failed:', err);
      });
    });
  }
}

export function subscribePWAStatus(callback: () => void) {
  pwaListeners.add(callback);
  return () => pwaListeners.delete(callback);
}

function notifyListeners() {
  pwaListeners.forEach(cb => cb());
}

export function canInstallPWA(): boolean {
  return deferredPrompt !== null;
}

export async function promptPWAInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notifyListeners();
    return outcome === 'accepted';
  } catch (err) {
    console.error('PWA Install prompt error:', err);
    return false;
  }
}

export function isAppStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as unknown as { standalone?: boolean }).standalone === true;
}
