export interface SingleProject {
  project: Project;
  user_id: string;
}

export interface Projects {
  projects: Project[];
  user_id: string;
}

export interface Project {
  project_id: string;
  tasks: Task[];
  title: string;
}

export interface Task {
  description: string;
  status: "todo" | "doing" | "done";
  task_id: string;
}
