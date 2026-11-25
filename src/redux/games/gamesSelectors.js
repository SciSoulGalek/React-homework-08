export const selectGames = (state) => state.games.list;
export const selectGamesTotal = (state) => state.games.total;
export const selectGamesTotalPages = (state) => state.games.totalPages;
export const selectGamesLoading = (state) => state.games.listLoading;
export const selectGamesError = (state) => state.games.listError;

export const selectGameDetails = (state) => state.games.details;
export const selectGameDetailsLoading = (state) => state.games.detailsLoading;
export const selectGameDetailsError = (state) => state.games.detailsError;

export const selectGameCreationLoading = (state) => state.games.createLoading;
export const selectGameCreationError = (state) => state.games.createError;