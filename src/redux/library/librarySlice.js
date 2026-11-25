import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getGamesList,
  addToLibrary,
  removeFromLibrary,
  updateGame,
} from "../../services/gamesApi";

export const fetchLibrary = createAsyncThunk(
  "library/fetchLibrary",
  async (query = "view=library&limit=1000", { rejectWithValue }) => {
    try {
      return await getGamesList(query);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addGameToLibrary = createAsyncThunk(
  "library/addGame",
  async (id, { rejectWithValue }) => {
    try {
      return await addToLibrary(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeGameFromLibrary = createAsyncThunk(
  "library/removeGame",
  async (id, { rejectWithValue }) => {
    try {
      return await removeFromLibrary(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const changeGameStatus = createAsyncThunk(
  "library/changeGameStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await updateGame(id, { status });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const librarySlice = createSlice({
  name: "library",
  initialState: {
    games: [],
    loading: false,
    error: null,
    requestId: null,
    mutationLoading: false,
    mutationError: null,
    total: 0,
    totalPages: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibrary.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchLibrary.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
            
        state.loading = false;
        state.games = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.requestId = null;
      })
      .addCase(fetchLibrary.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;

        state.loading = false;
        state.error = action.payload || action.error.message;
        state.requestId = null;
      })
      .addMatcher(
        (action) =>
          [
            addGameToLibrary.pending.type,
            removeGameFromLibrary.pending.type,
            changeGameStatus.pending.type,
          ].includes(action.type),
        (state) => {
          state.mutationLoading = true;
          state.mutationError = null;
        },
      )
      .addMatcher(
        (action) =>
          [
            addGameToLibrary.fulfilled.type,
            removeGameFromLibrary.fulfilled.type,
            changeGameStatus.fulfilled.type,
          ].includes(action.type),
        (state) => {
          state.mutationLoading = false;
        },
      )
      .addMatcher(
        (action) =>
          [
            addGameToLibrary.rejected.type,
            removeGameFromLibrary.rejected.type,
            changeGameStatus.rejected.type,
          ].includes(action.type),
        (state, action) => {
          state.mutationLoading = false;
          state.mutationError = action.payload || action.error.message;
        },
      );
  },
});

export default librarySlice.reducer;
