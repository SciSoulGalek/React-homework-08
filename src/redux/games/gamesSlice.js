import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getGamesList, getGame, createGame } from "../../services/gamesApi";

export const fetchGames = createAsyncThunk(
  "games/fetchGames",
  async (query, { rejectWithValue }) => {
    try {
      return await getGamesList(query);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchGameDetails = createAsyncThunk(
  "games/fetchGameDetails",
  async (id, { rejectWithValue }) => {
    try {
      return await getGame(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createNewGame = createAsyncThunk(
  "games/createNewGame",
  async (gameData, { rejectWithValue }) => {
    try {
      return await createGame(gameData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const gamesSlice = createSlice({
  name: "games",
  initialState: {
    list: [],
    total: 0,
    totalPages: 0,
    listLoading: false,
    listError: null,
    listRequestId: null,
    details: null,
    detailsLoading: false,
    detailsError: null,
    detailsRequestId: null,
    createLoading: false,
    createError: null,
  },
  reducers: {
    clearGameDetails(state) {
      state.details = null;
      state.detailsLoading = false;
      state.detailsError = null;
      state.detailsRequestId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state, action) => {
        state.listLoading = true;
        state.listError = null;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;

        state.listLoading = false;
        state.list = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.listRequestId = null;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;

        state.listLoading = false;
        state.listError = action.payload || action.error.message;
        state.listRequestId = null;
      })
      .addCase(fetchGameDetails.pending, (state, action) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.detailsRequestId = action.meta.requestId;
      })
      .addCase(fetchGameDetails.fulfilled, (state, action) => {
        if (state.detailsRequestId !== action.meta.requestId) return;

        state.detailsLoading = false;
        state.details = action.payload;
        state.detailsRequestId = null;
      })
      .addCase(fetchGameDetails.rejected, (state, action) => {
        if (state.detailsRequestId !== action.meta.requestId) return;

        state.detailsLoading = false;
        state.detailsError = action.payload || action.error.message;
        state.detailsRequestId = null;
      })
      .addCase(createNewGame.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createNewGame.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createNewGame.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || action.error.message;
      });
  },
});

export const { clearGameDetails } = gamesSlice.actions;

export default gamesSlice.reducer;
