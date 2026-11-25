import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import GameCard from "../components/GameCard";
import GameFilters from "../components/GameFilters";
import Pagination from "../components/Pagination";
import GameForm from "../components/GameForm";
import { initialDataSample } from "../services/initial-data-sample";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchGames, createNewGame } from "../redux/games/gamesSlice";
import {
  selectGames,
  selectGamesTotal,
  selectGamesTotalPages,
  selectGamesLoading,
  selectGamesError,
  selectGameCreationLoading,
  selectGameCreationError,
} from "../redux/games/gamesSelectors";
import { addGameToLibrary, fetchLibrary } from "../redux/library/librarySlice";
import { selectLibraryMutationError } from "../redux/library/librarySelectors";

const genres = [...new Set(initialDataSample.map((game) => game.genre))].sort();

export default function Games() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const games = useAppSelector(selectGames);
  const total = useAppSelector(selectGamesTotal);
  const totalPages = useAppSelector(selectGamesTotalPages);
  const loading = useAppSelector(selectGamesLoading);
  const error = useAppSelector(selectGamesError);
  const saving = useAppSelector(selectGameCreationLoading);
  const formError = useAppSelector(selectGameCreationError);
  const mutationError = useAppSelector(selectLibraryMutationError);

  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);

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
    view: "discover",
    page: String(page),
    limit: "12",
  }).toString();

  useEffect(() => {
    dispatch(fetchGames(query));
  }, [dispatch, query]);

  async function handleAddToLibrary(id) {
    try {
      await dispatch(addGameToLibrary(id)).unwrap();
      dispatch(fetchGames(query));
      dispatch(fetchLibrary());
      setNotice("Game added to your library.");
    } catch {
    }
  }

  async function handleAddGame(gameData) {
    try {
      await dispatch(createNewGame(gameData)).unwrap();

      dispatch(fetchGames(query));

      if (gameData.destination === "library") {
        dispatch(fetchLibrary());
      }

      setNotice(
        gameData.destination === "library"
          ? "Game added to your library."
          : "Game added to Discover.",
      );
      setShowForm(false);
    } catch {
    }
  }

  const displayedError = error || mutationError;

  return (
    <main className="page-container">
      <section className="page-heading">
        <div>
          <p className="eyebrow">FIND YOUR NEXT ADVENTURE</p>
          <h1>Discover games<span>.</span></h1>
          <p className="page-description">
            Explore the catalog and find your next adventure.
          </p>
        </div>

        <div className="library-count">
          <strong>{total}</strong>
          <span>GAMES</span>
        </div>
      </section>

      <div className="games-actions">
        <button
          className="add-button"
          onClick={() => setShowForm((current) => !current)}
        >
          {showForm ? "Cancel" : "Add game"}
        </button>
        <Link to="/dashboard">View dashboard</Link>
      </div>

      {notice && <p className="success-message">{notice}</p>}

      {showForm && (
        <>
          <GameForm
            genres={genres}
            onSubmit={handleAddGame}
            onCancel={() => setShowForm(false)}
          />
          {formError && <p className="form-error">{formError}</p>}
        </>
      )}

      <GameFilters
        view="discover"
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

      {displayedError && (
        <div className="status-message error-message">
          <p>{displayedError}</p>
          <button onClick={() => dispatch(fetchGames(query))}>
            Try again
          </button>
        </div>
      )}

      {loading && <p className="status-message">Loading games...</p>}

      {!loading && !displayedError && games.length === 0 && (
        <div className="status-message empty-message">
          <h2>No games found</h2>
          <p>Try changing your search or filters.</p>
          <button
            className="cancel-button"
            onClick={() => setSearchParams({})}
          >
            Clear filters
          </button>
        </div>
      )}

      {!loading && !displayedError && games.length > 0 && (
        <>
          <div className="results-heading">
            <span>Showing {games.length} of {total} games</span>
          </div>

          <div className="game-grid">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                view="discover"
                onSelect={(id) => navigate(`/games/${id}`)}
                onAddToLibrary={handleAddToLibrary}
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

      {saving && <p className="status-message">Saving your game...</p>}
    </main>
  );
}
