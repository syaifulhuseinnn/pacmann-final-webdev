import React, { useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  Select,
  FormLabel,
  Textarea,
  Stack,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { addNewTask, updateTask } from "../../services/projects";
import { ProjectContext, UserContext } from "../../contexts";
import { Task } from "../../types/projects";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  status: "todo" | "doing" | "done";
  method: "post" | "put";
  setMethod: React.Dispatch<React.SetStateAction<"post" | "put">>;
  selectedTask: Task | undefined;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
};

type InitialValues = {
  taskId?: string;
  description: string;
  status: "todo" | "doing" | "done";
};

function FormTask({
  onClose,
  isOpen,
  status,
  method,
  selectedTask,
  setMethod,
  setSelectedTask,
}: Props) {
  const { state, dispatch } = useContext(ProjectContext);
  const { user } = useContext(UserContext);
  const { selectedProject, projects } = state;

  // Define initial values for Formik
  let initialValues: InitialValues;
  if (method === "put" && selectedTask) {
    initialValues = selectedTask;
  } else {
    initialValues = {
      description: "",
      status: status,
    };
  }

  const handleAddNewTask = async (
    description: string,
    status: "todo" | "doing" | "done"
  ) => {
    try {
      const { task } = await addNewTask(user.userId, selectedProject, {
        description,
        status,
      });

      // Add new task to projects state
      const copiedProjects = { ...projects.data };
      const project = copiedProjects.projects.find(
        (project) => project.project_id === selectedProject
      );

      // Once add new task succeed to server
      // Update selected project
      if (project) {
        // Add new task to tasks property
        const tasks = [
          ...project.tasks,
          {
            task_id: task.task_id,
            description: task.description,
            status: task.status,
          },
        ];
        // Add new task to project
        const newProject = { ...project, tasks: tasks };
        // Find index selected project
        const indexProject = copiedProjects.projects.findIndex(
          (item) => item.project_id === selectedProject
        );
        // Reassign project with the new one
        copiedProjects.projects[indexProject] = newProject;

        // Update state
        dispatch({ type: "ADD_NEW_TASK", payload: copiedProjects });

        // Close modal
        onClose();
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleUpdateTask = async (
    description: string,
    status: "todo" | "doing" | "done"
  ) => {
    const task = {
      task_id: selectedTask?.task_id as string,
      description: description,
      status: status,
    };

    try {
      const response = await updateTask(user.userId, selectedProject, task);

      // Update task in projects state
      const copiedProjects = { ...projects.data };
      const project = copiedProjects.projects.find(
        (project) => project.project_id === response.project_id
      );

      // Once add new task succeed to server
      // Update selected project
      if (project) {
        // Find index task
        const indexTask = project.tasks.findIndex(
          (task) => task.task_id === response.task.task_id
        );

        // Find index selected project
        const indexProject = copiedProjects.projects.findIndex(
          (item) => item.project_id === response.project_id
        );

        // Replace task with the new one
        copiedProjects.projects[indexProject].tasks[indexTask] = {
          task_id: response.task.task_id,
          description: response.task.description,
          status: response.task.status,
        };

        // Update state
        dispatch({ type: "UPDATE_TASK", payload: copiedProjects });

        // Close modal
        onClose();

        // Reset states
        setMethod("post");
        setSelectedTask(undefined);
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleOnCloseModal = () => {
    // Reset states
    setMethod("post");
    setSelectedTask(undefined);
    onClose();
  };

  return (
    <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="scale">
      <ModalOverlay />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          if (method === "put" && selectedTask) {
            handleUpdateTask(values.description, values.status);
          } else {
            handleAddNewTask(values.description, values.status);
          }
        }}
      >
        {(props) => (
          <Form>
            <ModalContent>
              <ModalHeader>Add New Task</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack direction="column" gap={4}>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      placeholder="Description"
                      size="md"
                      resize="none"
                      name="description"
                      value={props.values.description}
                      onChange={props.handleChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      placeholder="Status"
                      name="status"
                      onChange={props.handleChange}
                      value={props.values.status}
                    >
                      <option value="todo">Todo</option>
                      <option value="doing">Doing</option>
                      <option value="done">Done</option>
                    </Select>
                  </FormControl>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="pink"
                  mr={3}
                  onClick={handleOnCloseModal}
                  variant="outline"
                >
                  Close
                </Button>
                <Button variant="solid" colorScheme="purple" type="submit">
                  {method === "post" ? "Save" : "Save Update"}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default FormTask;
