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
  Input,
  FormLabel,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { createNewProject } from "../../services/projects";
import { ProjectContext, UserContext } from "../../contexts";

type Props = {
  onClose: () => void;
  isOpen: boolean;
};

function FormProject(props: Props) {
  const { onClose, isOpen } = props;
  const { state, dispatch } = useContext(ProjectContext);
  const { user } = useContext(UserContext);
  const { projects } = state;

  const handleCreateNewProject = async (title: string) => {
    try {
      const response = await createNewProject(user.userId, title);

      const copiedProjects = { ...projects.data };
      const projectsAfterCreateNew = [...copiedProjects.projects, response];

      dispatch({ type: "CREATE_NEW_PROJECT", payload: projectsAfterCreateNew });

      // Close Form Create New Project
      onClose();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="scale">
      <ModalOverlay />
      <Formik
        initialValues={{ projectName: "" }}
        onSubmit={(values) => {
          handleCreateNewProject(values.projectName);
        }}
      >
        {(props) => (
          <Form>
            <ModalContent>
              <ModalHeader>Create New Project</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Project Name</FormLabel>
                  <Input
                    placeholder="New Project"
                    name="projectName"
                    value={props.values.projectName}
                    onChange={props.handleChange}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="pink"
                  mr={3}
                  onClick={onClose}
                  variant="outline"
                >
                  Close
                </Button>
                <Button variant="solid" colorScheme="purple" type="submit">
                  Create
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default FormProject;
