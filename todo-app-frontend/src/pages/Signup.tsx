import { useState } from "react";
import {
  Heading,
  Text,
  Center,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Link,
  Alert,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import services from "../services";
import { Link as ReactRouterLink } from "react-router-dom";
import { NewUserType } from "../types/user";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

type AlertState = {
  status: "success" | "error";
  show: boolean;
};

function Signup() {
  const [newUser, setNewUser] = useState<NewUserType>({} as NewUserType);
  const [alert, setAlert] = useState<AlertState>({
    status: "success",
    show: false,
  });

  const createNewUser = async (email: string, password: string) => {
    try {
      const response = await services.post("/signup", {
        email: email,
        password: password,
      });
      setNewUser(response.data);
      setAlert({ ...alert, status: "success", show: true });
    } catch (error) {
      console.error(error);
      setAlert({ ...alert, status: "error", show: true });
    }
  };

  return (
    <Center width="full" height="100vh" flexDirection="column" gap={4}>
      <Heading>Sign up, then organize your tasks!</Heading>
      <Text as="span" color="gray" align="center">
        Please enter your details
      </Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          createNewUser(values.email, values.password);
        }}
      >
        {(props) => (
          <Form>
            <Box
              border="1px"
              borderColor="gray.200"
              rounded="lg"
              p={6}
              width="md"
              display="flex"
              flexDirection="column"
              gap={4}
            >
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="maria@example.com"
                  onChange={props.handleChange}
                  value={props.values.email}
                />
                <FormHelperText color="orange.400">
                  {props.errors.email}
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  onChange={props.handleChange}
                  value={props.values.password}
                />
                <FormHelperText color="orange.400">
                  {props.errors.password}
                </FormHelperText>
              </FormControl>
              <Button colorScheme="pink" type="submit">
                Sign Up
              </Button>
              <Text align="center" color="blue.500">
                Already have an account?{" "}
                <Link as={ReactRouterLink} to="/" textDecoration="underline">
                  Sign In
                </Link>
              </Text>
            </Box>
          </Form>
        )}
      </Formik>

      {/* Show alert if sign up success OR sign up failed */}
      <Alert
        status={alert.status}
        width="md"
        rounded="lg"
        display={alert.show ? "block" : "none"}
      >
        <Text align="center">
          ℹ️ Sign up success. Now you can{" "}
          <Link as={ReactRouterLink} to="/" textDecoration="underline">
            sign in
          </Link>
        </Text>
      </Alert>
    </Center>
  );
}

export default Signup;
