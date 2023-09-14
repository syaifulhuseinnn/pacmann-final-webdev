import { useEffect, useContext } from "react";
import {
  List,
  ListItem,
  Skeleton,
  Stack,
  Text,
  Box,
  Button,
  Icon,
  Tooltip,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { ProjectContext, UserContext } from "../../contexts";
import { getProjects } from "../../services/projects";
import { FaPlus } from "react-icons/fa6";
import FormProject from "./FormProject";

function ProjectList() {
  const { state, dispatch } = useContext(ProjectContext);
  const { user } = useContext(UserContext);
  const { selectedProject } = state;
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (!state.projects.isPending && state.projects.isFulfilled) {
      dispatch({
        type: "SET_SELECTED_PROJECT",
        payload: state.projects.data.projects?.[0]?.project_id,
      });
    }
  }, [
    dispatch,
    state.projects.data.projects,
    state.projects.isFulfilled,
    state.projects.isPending,
  ]);

  useEffect(() => {
    const request = async () => {
      dispatch({ type: "FETCH_PENDING", payload: true });

      try {
        const data = await getProjects(user.userId);
        dispatch({ type: "FETCH_FULFILLED", payload: data });
      } catch (error) {
        console.error(error);
        dispatch({ type: "FETCH_REJECTED", payload: true });
      }
    };

    if ((user.email, user.userId)) {
      console.info("ProjectList: User existed. GetProjects()");
      request();
    }
  }, [dispatch, user.email, user.userId]);

  if (!state.projects.isPending && state.projects.isFulfilled) {
    return (
      <>
        <Box flexGrow={2} mt={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontWeight="bold">Projects</Text>
            <Button size="xs" colorScheme="purple" onClick={onOpen}>
              <Icon as={FaPlus} />
            </Button>
          </Stack>
          <List height="xl" overflow="auto" mt={4}>
            {state.projects.data.projects?.map((project) => (
              <Stack
                key={project.project_id}
                p={2}
                my={4}
                rounded="md"
                direction="row"
                alignItems="center"
                bgColor={
                  project.project_id === selectedProject ? "purple.500" : "none"
                }
                borderWidth={
                  project.project_id === selectedProject ? "none" : "1px"
                }
                borderColor={
                  project.project_id === selectedProject ? "none" : "gray.200"
                }
                _hover={{ cursor: "pointer" }}
                onClick={() =>
                  dispatch({
                    type: "SET_SELECTED_PROJECT",
                    payload: project.project_id,
                  })
                }
              >
                <Image
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${project.title}&backgroundColor=BEE3F8`}
                  boxSize="30px"
                  rounded="md"
                  // bgColor="blue.100"
                />
                <Tooltip
                  label={project.title}
                  openDelay={1000}
                  key={project.project_id}
                >
                  <ListItem
                    fontSize="sm"
                    color={
                      project.project_id === selectedProject ? "white" : "black"
                    }
                    noOfLines={1}
                  >
                    {project.title}
                  </ListItem>
                </Tooltip>
              </Stack>
            ))}
          </List>
        </Box>
        <FormProject isOpen={isOpen} onClose={onClose} />
      </>
    );
  }

  // if (!isLoading && isError.error) {
  //   return <div>{isError.message}</div>;
  // }

  return (
    <Stack flexGrow={2} my={6} gap={6}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton
          key={item}
          height="20px"
          startColor="whiteAlpha.100"
          endColor="whiteAlpha.500"
        />
      ))}
    </Stack>
  );
}

export default ProjectList;
