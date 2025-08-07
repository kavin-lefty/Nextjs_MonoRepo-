import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommonDataStructure {
  id: string | null;
}

const initialState: CommonDataStructure = {
  id: null,
};

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
    SetId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { SetId } = commonSlice.actions;
export default commonSlice.reducer;
