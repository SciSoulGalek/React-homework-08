import { useEffect, useState } from "react";

export default function PWAUpdatePrompt() {
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let registration;

    const checkWaitingWorker = () => {
      if (registration?.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(registration.waiting);
      }
    };

    const handleUpdateFound = () => {
      const worker = registration.installing;

      if (!worker) return;

      worker.addEventListener("statechange", () => {
        if (
          worker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          checkWaitingWorker();
        }
      });
    };

    const registerWorker = async () => {
      registration = await navigator.serviceWorker.register(
        `${import.meta.env.BASE_URL}sw.js`
      );

      registration.addEventListener("updatefound", handleUpdateFound);

      checkWaitingWorker();

      await registration.update();

      checkWaitingWorker();
    };

    registerWorker().catch(console.error);

    return () => {
      registration?.removeEventListener("updatefound", handleUpdateFound);
    };
  }, []);

  useEffect(() => {
    if (!waitingWorker) return;

    const handleControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
      { once: true }
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange
      );
    };
  }, [waitingWorker]);

  if (!waitingWorker) return null;

  return (
    <div className="pwa-update-prompt">
      <span>A new version of Questlog is available!</span>
      <button onClick={() => waitingWorker.postMessage("SKIP_WAITING")}>
        Update now
      </button>
    </div>
  );
}
