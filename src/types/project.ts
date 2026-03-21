export const PROJECT_STATUS = {
  completed: "completed",
  "in-progress": "in-progress",
  maintained: "maintained",
  archived: "archived",
} as const;

export type ProjectStatus = keyof typeof PROJECT_STATUS;

export type Project = {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  githubUrl: string;
  insight: string;
};
