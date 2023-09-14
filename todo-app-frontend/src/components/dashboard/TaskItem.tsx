import React, { useState } from "react";
import {
  GridItem,
  Heading,
  Stack,
  Box,
  Text,
  Badge,
  Button,
  useDisclosure,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { Task } from "../../types/projects";
import { FaPlus, FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import FormTask from "./FormTask";
import Alert from "./Alert";

type Props = {
  tasks: Task[] | undefined;
  status: "todo" | "doing" | "done";
  gridArea: string;
  label: string;
  method: "post" | "put";
  setMethod: React.Dispatch<React.SetStateAction<"post" | "put">>;
  selectedTask: Task | undefined;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
};

function TaskItem(props: Props) {
  const {
    tasks,
    status,
    gridArea,
    label,
    method,
    setMethod,
    selectedTask,
    setSelectedTask,
  } = props;
  // Control for Form Task
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Control for Alert
  const {
    isOpen: isOpenAl,
    onOpen: onOpenAl,
    onClose: onCloseAl,
  } = useDisclosure();

  const handleUpdateButton = (taskId: string | undefined) => {
    const task = tasks?.find((task) => task.task_id === taskId);
    setMethod("put");
    setSelectedTask(task);
    onOpen();
  };

  const handleDeleteButton = (taskId: string | undefined) => {
    const task = tasks?.find((task) => task.task_id === taskId);
    onOpenAl();
    setSelectedTask(task);
  };
  return (
    <>
      <GridItem rounded="lg" p={4} area={gridArea}>
        <Box position="relative">
          <Stack
            direction="row"
            bgColor="gray.100"
            p={2}
            rounded="md"
            justifyContent="space-between"
          >
            <Heading size="sm" textTransform="capitalize">
              {label}
            </Heading>
            <Badge colorScheme="green" rounded="md">
              {tasks?.length ?? 0}
            </Badge>
          </Stack>
          <Button
            my={4}
            width="full"
            colorScheme="purple"
            variant="outline"
            fontWeight="normal"
            fontSize="sm"
            leftIcon={<FaPlus />}
            borderColor="gray.200"
            onClick={onOpen}
          >
            Add New Task
          </Button>
          <Stack
            direction="column"
            gap={4}
            height="lg"
            overflow="auto"
            position="absolute"
            width="full"
          >
            {tasks?.map((task) => (
              <Box
                key={task.task_id}
                backgroundColor="white"
                p={4}
                borderColor="gray.200"
                borderWidth="1px"
                rounded="lg"
              >
                <Heading size="sm" mb={2}>
                  Task Title
                </Heading>
                <Text fontSize="xs" noOfLines={4} color="gray.500">
                  {task.description}
                </Text>
                <Divider my={4} />
                <Stack direction="row" justifyContent="flex-end" gap={0}>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleUpdateButton(task.task_id)}
                  >
                    <Icon as={FaRegPenToSquare} boxSize={4} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDeleteButton(task.task_id)}
                  >
                    <Icon as={FaRegTrashCan} boxSize={4} />
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </GridItem>

      {/* Form Add New Task OR Update Task */}
      <FormTask
        onClose={onClose}
        isOpen={isOpen}
        status={status}
        method={method}
        setMethod={setMethod}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />

      {/* Alert for delete task */}
      <Alert
        isOpen={isOpenAl}
        onClose={onCloseAl}
        heading="Delete Task"
        body="Are you sure you want to delete this task?"
        labelButton="Delete"
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </>
  );
}

export default TaskItem;
