import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Investment} from "@/components/projects/investments/investment.ts";

type InvestmentSlice = {
  editableInvestment: Investment | null;
  isCreatingInvestment: boolean;
};

const initialState: InvestmentSlice = {
  editableInvestment: null,
  isCreatingInvestment: false,
};

export const investmentSlice = createSlice({
  name: "Investments",
  initialState,
  reducers: {
    createInvestment: (state) => {
      console.assert(state.editableInvestment == null, "Should not be able to create while editing investment");
      state.isCreatingInvestment = true;
    },
    editInvestment: (state, action: PayloadAction<Investment>) => {
      const inv = action.payload;
      console.assert(inv != null, "Investment to edit should not be null");
      state.editableInvestment = inv;
    },
    clear: (state) => {
      state.editableInvestment = null;
      state.isCreatingInvestment = false;
    }
  },
});

export const investmentActions = investmentSlice.actions;
export default investmentSlice.reducer;
