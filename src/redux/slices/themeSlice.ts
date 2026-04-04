import { createSlice } from "@reduxjs/toolkit";
import { Theme } from "@/enums/theme.enum";

interface ThemeState {
  mode: Theme;
}

const initialState: ThemeState = {
  mode: Theme.LIGHT,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    },
    setTheme: (state, action: { payload: Theme }) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
