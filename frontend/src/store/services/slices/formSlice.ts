// formSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  [key: string]: any;
}

const initialState: FormState = {};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFieldValue: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state[action.payload.key] = action.payload.value;
    },
    setFormValues: (state, action: PayloadAction<FormState>) => {
      return { ...state, ...action.payload };
    },
    resetForm: () => {
      return {};
    }
  }
});

export const { setFieldValue, setFormValues, resetForm } = formSlice.actions;
export default formSlice.reducer;