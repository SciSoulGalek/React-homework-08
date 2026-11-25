import { useNavigate } from "react-router";

export default function Offline() {
  const navigate = useNavigate();

  const retry = () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      navigate(-1);
    }
  };

  return (
    <main className="offline-page">
      <div>
        <h1>You're offline</h1>
        <p>
          Questlog can't connect to the internet.
          Check your connection and try again.
        </p>
        <button onClick={retry}>Retry connection</button>
      </div>
    </main>
  );
}