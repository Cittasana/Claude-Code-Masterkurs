import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProjectHubStore {
  /** Map of stepId -> true for completed steps */
  completedSteps: Record<string, boolean>;
  /** Map of projectId -> true for completed projects */
  completedProjects: Record<string, boolean>;
  /** Toggle a step's completion status */
  toggleStep: (stepId: string) => void;
  /** Mark a project as completed */
  markProjectCompleted: (projectId: string) => void;
}

export const useProjectHubStore = create<ProjectHubStore>()(
  persist(
    (set) => ({
      completedSteps: {},
      completedProjects: {},

      toggleStep: (stepId: string) =>
        set((state) => ({
          completedSteps: {
            ...state.completedSteps,
            [stepId]: !state.completedSteps[stepId],
          },
        })),

      markProjectCompleted: (projectId: string) =>
        set((state) => ({
          completedProjects: {
            ...state.completedProjects,
            [projectId]: true,
          },
        })),
    }),
    {
      name: 'claude-code-masterkurs-project-hub',
    }
  )
);
