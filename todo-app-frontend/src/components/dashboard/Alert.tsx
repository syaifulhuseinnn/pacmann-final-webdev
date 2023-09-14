import React, { useContext } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { ProjectContext, UserContext } from "../../contexts";
import { Task } from "../../types/projects";
import { deleteTask } from "../../services/projects";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  heading: string;
  body: string;
  labelButton: string;
  selectedTask: Task | undefined;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
};

function Alert(props: Props) {
  const { state, dispatch } = useContext(ProjectContext);
  const { user } = useContext(UserContext);
  const { selectedProject, projects } = state;
  const {
    isOpen,
    onClose,
    heading,
    body,
    labelButton,
    selectedTask,
    setSelectedTask,
  } = props;

  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleDeleteTask = async (taskId: string | undefined) => {
    try {
      // Send  delete request to server
      await deleteTask(user.userId, selectedProject, taskId as string);

      // Update task in projects state
      const copiedProjects = { ...projects.data };
      const project = copiedProjects.projects.find(
        (project) => project.project_id === selectedProject
      );

      // Update selected project
      if (project) {
        // Find index that want to remove
        const indexTask = project.tasks.findIndex(
          (task) => task.task_id === taskId
        );

        // Find index selected project
        const indexProject = copiedProjects.projects.findIndex(
          (item) => item.project_id === selectedProject
        );

        // Remove task
        copiedProjects.projects[indexProject].tasks.splice(indexTask, 1);

        const tasksAfterDelete = copiedProjects.projects[indexProject].tasks;

        // Add deleted tasks to project
        const newProject = { ...project, tasks: tasksAfterDelete };

        // Reassign project with the new one
        copiedProjects.projects[indexProject] = newProject;

        // Update state once delete request success
        dispatch({ type: "DELETE_TASK", payload: copiedProjects });

        // Close modal
        onClose();

        // Reset states
        setSelectedTask(undefined);
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      motionPreset="scale"
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {heading}
          </AlertDialogHeader>

          <AlertDialogBody>{body}</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              colorScheme="pink"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={() => handleDeleteTask(selectedTask?.task_id)}
              ml={3}
            >
              {labelButton}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default Alert;
