import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  [key: string]: string;
}

const initialState: FormState = {};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormValue: (state, action: PayloadAction<{ name: string; value: string }>) => {
      state[action.payload.name] = action.payload.value;
    },
    resetForm: () => initialState,
  },
});

export const { setFormValue, resetForm } = formSlice.actions;
export default formSlice.reducer;
