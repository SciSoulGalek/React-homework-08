export const selectLibraryGames = (state) => state.library.games;
export const selectLibraryLoading = (state) => state.library.loading;
export const selectLibraryError = (state) => state.library.error;
export const selectLibraryMutationLoading = (state) =>
  state.library.mutationLoading;
export const selectLibraryMutationError = (state) =>
  state.library.mutationError;

export const selectLibraryTotal = (state) => state.library.total;
export const selectLibraryTotalPages = (state) => state.library.totalPages;