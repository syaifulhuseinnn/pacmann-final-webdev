import { useContext, useState } from "react";
import { ProjectContext } from "../../contexts";
import TaskItemCopy from "./TaskItemCopy";
import { Skeleton, Stack } from "@chakra-ui/react";
import { Task } from "../../types/projects";

type Status = "todo" | "doing" | "done";

function TasksCopy() {
  const { state } = useContext(ProjectContext);
  const { projects, selectedProject } = state;
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [method, setMethod] = useState<"post" | "put">("post");

  if (state.projects.isFulfilled) {
    const project = projects.data.projects.find(
      (item) => item.project_id === selectedProject
    );

    return (
      <>
        {["todo", "doing", "done"].map((status, index) => (
          <TaskItemCopy
            key={index}
            status={status as Status}
            label={status}
            tasks={project?.tasks?.filter((task) => task.status === status)}
            gridArea={status}
            method={method}
            setMethod={setMethod}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          />
        ))}
      </>
    );
  }

  return <div>Loading...</div>;
}

export default TasksCopy;
