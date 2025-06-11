import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import WorkService from "../../services/work.service";
import { IEdition } from "../../types";

interface EditionState {
  all: IEdition[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EditionState = {
  all: [],
  status: 'idle',
  error: null,
};

// Thunk kõikide teavikute pärimiseks
export const fetchEditions = createAsyncThunk('editions/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await WorkService.getEditions();
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Viga andmete laadimisel");
  }
});

// UUS THUNK: Teavikute otsimiseks
export const searchEditions = createAsyncThunk('editions/search', async (query: string, thunkAPI) => {
    try {
        const response = await WorkService.searchEditions(query);
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data.message || "Viga otsingul");
    }
});


const editionSlice = createSlice({
  name: "editions",
  initialState,
  reducers: {
    updateEditionAvailability: (state, action: PayloadAction<{ editionid: number; availability: IEdition['availability'] }>) => {
        const index = state.all.findIndex(e => e.editionid === action.payload.editionid);
        if (index !== -1) {
            state.all[index].availability = action.payload.availability;
        }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchEditions.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchEditions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.all = action.payload;
      })
      .addCase(fetchEditions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Search
      .addCase(searchEditions.pending, (state) => { state.status = 'loading'; })
      .addCase(searchEditions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.all = action.payload;
      })
      .addCase(searchEditions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { updateEditionAvailability } = editionSlice.actions;
export default editionSlice.reducer;