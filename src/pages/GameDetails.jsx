import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  fetchGameDetails,
  clearGameDetails,
} from "../redux/games/gamesSlice";
import {
  selectGameDetails,
  selectGameDetailsLoading,
  selectGameDetailsError,
} from "../redux/games/gamesSelectors";
import {
  addGameToLibrary,
  removeGameFromLibrary,
  changeGameStatus,
} from "../redux/library/librarySlice";
import { fetchLibrary } from "../redux/library/librarySlice";
import { selectLibraryMutationError } from "../redux/library/librarySelectors";

export default function GameDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const game = useAppSelector(selectGameDetails);
  const loading = useAppSelector(selectGameDetailsLoading);
  const error = useAppSelector(selectGameDetailsError);
  const mutationError = useAppSelector(selectLibraryMutationError);

  useEffect(() => {
    dispatch(fetchGameDetails(id));

    return () => {
      dispatch(clearGameDetails());
    };
  }, [dispatch, id]);

  async function handleAddToLibrary() {
    try {
      await dispatch(addGameToLibrary(id)).unwrap();
      dispatch(fetchGameDetails(id));
      dispatch(fetchLibrary());
    } catch {
    }
  }

  async function handleStatusChange(event) {
    try {
      await dispatch(
        changeGameStatus({
          id,
          status: event.target.value,
        }),
      ).unwrap();

      dispatch(fetchGameDetails(id));
      dispatch(fetchLibrary());
    } catch {
    }
  }

  async function handleRemoveFromLibrary() {
    try {
      await dispatch(removeGameFromLibrary(id)).unwrap();
      dispatch(fetchGameDetails(id));
      dispatch(fetchLibrary());
    } catch {
    }
  }

  if (loading) {
    return <p className="status-message">Loading game details...</p>;
  }

  if (error || !game) {
    return (
      <main className="page-container">
        <div className="status-message error-message">
          <h2>{error === "Game not found" ? "Game not found" : "Something went wrong"}</h2>
          <p>{error || "This game does not exist."}</p>
          <Link to="/games">Back to games</Link>
          {error && (
            <button onClick={() => dispatch(fetchGameDetails(id))}>
              Try again
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <Link to="/games">← Back to games</Link>

      <section className="game-details-page">
        <p className="eyebrow">GAME DETAILS</p>
        <h1>{game.name}</h1>

        <div className="details-grid">
          <p><strong>Genre:</strong> {game.genre}</p>
          <p><strong>Release year:</strong> {game.releaseYear}</p>
          <p><strong>Developer:</strong> {game.developer}</p>
          <p><strong>Rating:</strong> {game.rating}/10</p>
          <p><strong>Platforms:</strong> {game.platforms?.join(", ") || "Unknown"}</p>
          <p><strong>Library status:</strong> {game.inLibrary ? game.status || "In library" : "Not in library"}</p>
          <p><strong>Game ID:</strong> {game.id}</p>
        </div>

        {mutationError && (
          <p className="error-message">{mutationError}</p>
        )}

        <section className="details-actions">
          {game.inLibrary ? (
            <>
              <label htmlFor="game-status">Library status:</label>
              <select
                id="game-status"
                value={game.status}
                onChange={handleStatusChange}
              >
                {["Want to Play", "Playing", "Completed", "Dropped"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button className="cancel-button" onClick={handleRemoveFromLibrary}>
                Remove from library
              </button>
            </>
          ) : (
            <button className="add-button" onClick={handleAddToLibrary}>
              Add to library
            </button>
          )}
        </section>

        <section>
          <h2>About this game</h2>
          <p>{game.description || "No description available."}</p>
        </section>
      </section>
    </main>
  );
}
