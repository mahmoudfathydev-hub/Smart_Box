import { createSlice } from "@reduxjs/toolkit";
import { Language } from "@/enums/language.enum";

interface LanguageState {
  locale: Language;
}

const initialState: LanguageState = {
  locale: Language.EN,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.locale =
        state.locale === Language.EN ? Language.AR : Language.EN;
    },
    setLanguage: (state, action: { payload: Language }) => {
      state.locale = action.payload;
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
