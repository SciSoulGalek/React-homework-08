import { useEffect } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchLibrary } from "../redux/library/librarySlice";
import {
  selectLibraryLoading,
  selectLibraryError,
} from "../redux/library/librarySelectors";
import { setDashboardFilter } from "../redux/dashboard/dashboardSlice";
import {
  selectDashboardFilter,
  selectDashboardStats,
  selectDashboardGenreStats,
  selectDashboardPlatformStats,
} from "../redux/dashboard/dashboardSelectors";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectLibraryLoading);
  const error = useAppSelector(selectLibraryError);
  const filter = useAppSelector(selectDashboardFilter);
  const stats = useAppSelector(selectDashboardStats);
  const genreStats = useAppSelector(selectDashboardGenreStats);
  const platformStats = useAppSelector(selectDashboardPlatformStats);

  useEffect(() => {
    dispatch(fetchLibrary());
  }, [dispatch]);

  function renderBreakdown(data) {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const maximum = Math.max(...entries.map((item) => item[1]), 1);

    return entries.length ? (
      <div className="dashboard-breakdown">
        {entries.map(([name, count]) => (
          <div className="breakdown-item" key={name}>
            <div className="breakdown-label">
              <span>{name}</span>
              <strong>{count}</strong>
            </div>
            <div className="breakdown-track">
              <div
                className="breakdown-fill"
                style={{ width: `${(count / maximum) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No data available.</p>
    );
  }

  if (loading) {
    return <p className="status-message">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <main className="page-container">
        <div className="status-message error-message">
          <p>{error}</p>
          <button onClick={() => dispatch(fetchLibrary())}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container dashboard-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">YOUR GAMING OVERVIEW</p>
          <h1>Dashboard<span>.</span></h1>
          <p className="page-description">
            A closer look at your gaming collection and progress.
          </p>
        </div>
      </section>

      <section className="dashboard-filter">
        <label htmlFor="dashboard-status">Filter by status:</label>
        <select
          id="dashboard-status"
          value={filter}
          onChange={(event) =>
            dispatch(setDashboardFilter(event.target.value))
          }
        >
          <option value="all">All games</option>
          <option value="Want to Play">Want to Play</option>
          <option value="Playing">Playing</option>
          <option value="Completed">Completed</option>
          <option value="Dropped">Dropped</option>
        </select>
      </section>

      <section className="dashboard-stats">
        <article className="stat-card">
          <span>Total games</span>
          <strong>{stats.total}</strong>
        </article>

        <article className="stat-card">
          <span>Completed</span>
          <strong>{stats.completed}</strong>
        </article>

        <article className="stat-card">
          <span>Currently playing</span>
          <strong>{stats.playing}</strong>
        </article>

        <article className="stat-card">
          <span>Average rating</span>
          <strong>{stats.averageRating}/10</strong>
        </article>
      </section>

      <section className="dashboard-breakdowns">
        <article className="dashboard-panel">
          <h2>Games by genre</h2>
          {renderBreakdown(genreStats)}
        </article>

        <article className="dashboard-panel">
          <h2>Games by platform</h2>
          {renderBreakdown(platformStats)}
        </article>
      </section>

      <div className="dashboard-actions">
        <Link to="/games" className="add-button">
          Discover games
        </Link>
        <Link to="/library" className="cancel-button">
          View library
        </Link>
      </div>
    </main>
  );
}
