import services from ".";

type NewProjectResponse = {
  project_id: string;
  tasks: [];
  title: string;
  user_id: string;
};

type NewTaskResponse = {
  project_id: string;
  task: {
    task_id: string;
    description: string;
    status: "todo" | "doing" | "done";
  };
};

type UpdateTaskResponse = {
  project_id: string;
  task: {
    task_id: string;
    description: string;
    status: "todo" | "doing" | "done";
  };
};

export const getProjects = async (userId: string) => {
  try {
    const response = await services.get(`/projects/${userId}`);
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const addNewTask = async (
  userId: string,
  projectId: string,
  task: { description: string; status: string }
): Promise<NewTaskResponse> => {
  try {
    const response = await services.post(`/tasks/${userId}`, {
      project_id: projectId,
      task: task,
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const updateTask = async (
  userId: string,
  projectId: string,
  task: {
    task_id: string;
    description: string;
    status: "todo" | "doing" | "done";
  }
): Promise<UpdateTaskResponse> => {
  try {
    const response = await services.put(`/tasks/${userId}`, {
      project_id: projectId,
      task: task,
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const deleteTask = async (
  userId: string,
  projectId: string,
  taskId: string
) => {
  try {
    const response = await services.delete(`/tasks/${userId}`, {
      data: {
        project_id: projectId,
        task_id: taskId,
      },
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const createNewProject = async (
  userId: string,
  title: string
): Promise<NewProjectResponse> => {
  try {
    const response = await services.post(`/projects/${userId}`, {
      title: title,
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
