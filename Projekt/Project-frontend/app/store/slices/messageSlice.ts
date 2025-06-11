import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessageState {
  message: string | null;
}

const initialState: MessageState = { message: null };

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;