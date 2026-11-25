import { createSelector } from "@reduxjs/toolkit";
import { selectLibraryGames } from "../library/librarySelectors";

export const selectDashboardFilter = (state) => state.dashboard.filter;

export const selectFilteredDashboardGames = createSelector(
  [selectLibraryGames, selectDashboardFilter],
  (games, filter) => {
    if (filter === "all") return games;

    return games.filter((game) => game.status === filter);
  },
);

export const selectDashboardStats = createSelector(
  [selectFilteredDashboardGames],
  (games) => {
    const completed = games.filter(
      (game) => game.status === "Completed",
    ).length;

    const playing = games.filter(
      (game) => game.status === "Playing",
    ).length;

    const ratedGames = games.filter(
      (game) => Number.isFinite(Number(game.rating)),
    );

    const averageRating = ratedGames.length
      ? (
          ratedGames.reduce(
            (sum, game) => sum + Number(game.rating),
            0,
          ) / ratedGames.length
        ).toFixed(1)
      : "0.0";

    return {
      total: games.length,
      completed,
      playing,
      averageRating,
    };
  },
);

export const selectDashboardGenreStats = createSelector(
  [selectFilteredDashboardGames],
  (games) =>
    games.reduce((stats, game) => {
      stats[game.genre] = (stats[game.genre] || 0) + 1;
      return stats;
    }, {}),
);

export const selectDashboardPlatformStats = createSelector(
  [selectFilteredDashboardGames],
  (games) =>
    games.reduce((stats, game) => {
      game.platforms?.forEach((platform) => {
        stats[platform] = (stats[platform] || 0) + 1;
      });

      return stats;
    }, {}),
);
