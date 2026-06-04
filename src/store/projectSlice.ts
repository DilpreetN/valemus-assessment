import type { Project } from "@/components/projects/project";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ProjectSlice = {
  selectedProject: Project | undefined;
};

const initialState: ProjectSlice = {
  selectedProject: undefined,
};

export const projectSlice = createSlice({
  name: "Projects",
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<Project>) => {
      console.assert(state != null, "Selected project cannot be null");
      state.selectedProject = action.payload;
    },
  },
});

export const projectActions = projectSlice.actions;
export default projectSlice.reducer;
