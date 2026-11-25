import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import GameCard from "../components/GameCard";
import GameFilters from "../components/GameFilters";
import Pagination from "../components/Pagination";
import { initialDataSample } from "../services/initial-data-sample";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  fetchLibrary,
  removeGameFromLibrary,
  changeGameStatus,
} from "../redux/library/librarySlice";
import {
  selectLibraryGames,
  selectLibraryTotal,
  selectLibraryTotalPages,
  selectLibraryLoading,
  selectLibraryError,
} from "../redux/library/librarySelectors";

const genres = [...new Set(initialDataSample.map((game) => game.genre))].sort();

export default function Library() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const games = useAppSelector(selectLibraryGames);
  const total = useAppSelector(selectLibraryTotal);
  const totalPages = useAppSelector(selectLibraryTotalPages);
  const loading = useAppSelector(selectLibraryLoading);
  const error = useAppSelector(selectLibraryError);

  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "all";
  const platform = searchParams.get("platform") || "all";
  const status = searchParams.get("status") || "all";
  const sort = searchParams.get("sort") || "name";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  function updateFilters(changes) {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "page" && value === 1)) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams);
  }

  const query = new URLSearchParams({
    search,
    genre,
    platform,
    status,
    sort,
    view: "library",
    page: String(page),
    limit: "12",
  }).toString();

  useEffect(() => {
    dispatch(fetchLibrary(query));
  }, [dispatch, query]);

  async function handleStatusChange(id, newStatus) {
    try {
      await dispatch(changeGameStatus({ id, status: newStatus })).unwrap();
      dispatch(fetchLibrary(query));
    } catch {
    }
  }

  async function handleRemove(id) {
    try {
      await dispatch(removeGameFromLibrary(id)).unwrap();
      dispatch(fetchLibrary(query));
    } catch {
    }
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <div>
          <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
          <h1>My library<span>.</span></h1>
          <p className="page-description">
            Keep track of the games you want to play, are playing, or have completed.
          </p>
        </div>
        <div className="library-count">
          <strong>{total}</strong>
          <span>GAMES</span>
        </div>
      </section>

      <div className="games-actions">
        <button
          className="cancel-button"
          onClick={() => navigate("/games")}
        >
          Discover games
        </button>
        <button
          className="cancel-button"
          onClick={() => setSearchParams({})}
        >
          Clear filters
        </button>
      </div>

      <GameFilters
        view="library"
        search={search}
        setSearch={(value) => updateFilters({ search: value, page: 1 })}
        genre={genre}
        setGenre={(value) => updateFilters({ genre: value, page: 1 })}
        platform={platform}
        setPlatform={(value) => updateFilters({ platform: value, page: 1 })}
        status={status}
        setStatus={(value) => updateFilters({ status: value, page: 1 })}
        sort={sort}
        setSort={(value) => updateFilters({ sort: value, page: 1 })}
        genres={genres}
      />

      {error && (
        <div className="status-message error-message">
          <p>{error}</p>
          <button onClick={() => dispatch(fetchLibrary(query))}>
            Try again
          </button>
        </div>
      )}

      {loading && <p className="status-message">Loading your library...</p>}

      {!loading && !error && games.length === 0 && (
        <div className="status-message empty-message">
          <h2>Your library is empty</h2>
          <p>Add games from Discover to start building your collection.</p>
          <button className="add-button" onClick={() => navigate("/games")}>
            Explore games
          </button>
        </div>
      )}

      {!loading && !error && games.length > 0 && (
        <>
          <div className="results-heading">
            <span>Showing {games.length} of {total} games</span>
          </div>

          <div className="game-grid">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                view="library"
                onSelect={(id) => navigate(`/games/${id}`)}
                onStatusChange={handleStatusChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(value) => updateFilters({ page: value })}
          />
        </>
      )}
    </main>
  );
}
