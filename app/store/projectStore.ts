import { create } from 'zustand';
import {Project} from "../db/schema";

interface ProjectState {
    project: Project | null;
    setProject: (project: Project|null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
    project: null,
    setProject: (project) => set({ project }),
}));
