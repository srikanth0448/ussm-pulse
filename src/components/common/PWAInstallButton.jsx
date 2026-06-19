// PWAInstallIcon.jsx

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import "./pwainstallbtn.css";
export default function PWAInstallIcon() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null;

  return (
    <button
      className="pwa-install-icon"
      onClick={handleInstall}
      title="Install USM Pulse"
    >
      <Download size={22} />
    </button>
  );
}
