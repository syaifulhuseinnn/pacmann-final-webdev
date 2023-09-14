import { useContext, useState } from "react";
import { ProjectContext } from "../../contexts";
import TaskItem from "./TaskItem";
import { Skeleton, Stack } from "@chakra-ui/react";
import { Task } from "../../types/projects";

type Status = "todo" | "doing" | "done";

function Tasks() {
  const { state } = useContext(ProjectContext);
  const { projects, selectedProject } = state;

  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [method, setMethod] = useState<"post" | "put">("post");

  if (state.projects.isFulfilled) {
    const project = projects.data.projects?.find(
      (item) => item.project_id === selectedProject
    );

    return (
      <>
        {["todo", "doing", "done"].map((status, index) => (
          <TaskItem
            key={index}
            status={status as Status}
            label={status}
            tasks={project?.tasks.filter((task) => task.status === status)}
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

  return [1, 2, 3].map((item) => (
    <Stack p={4} key={item}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton key={item} height="20" p={4} />
      ))}
    </Stack>
  ));
}

export default Tasks;
