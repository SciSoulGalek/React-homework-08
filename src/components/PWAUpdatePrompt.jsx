
import { useEffect, useState } from "react";

export default function PWAUpdatePrompt() {
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let registration;

    const checkForUpdate = async () => {
      registration = await navigator.serviceWorker.register(
        `${import.meta.env.BASE_URL}sw.js`
      );
      
      await registration.update();

      if (registration.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(registration.waiting);
      }

      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;

        worker.addEventListener("statechange", () => {
          if (
            worker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            setWaitingWorker(worker);
          }
        });
      });
    };

    checkForUpdate().catch(console.error);

    return () => {
      registration?.removeEventListener("updatefound", () => {});
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
