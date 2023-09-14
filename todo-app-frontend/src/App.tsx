import { useContext, useState } from "react";
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
import services from "./services";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { UserContext } from "./contexts";

type AlertState = {
  status: "success" | "error";
  show: boolean;
};

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

function App() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [alert, setAlert] = useState<AlertState>({
    status: "success",
    show: false,
  });

  const getUserAccount = async (email: string, password: string) => {
    try {
      const response = await services.post<{ email: string; user_id: string }>(
        "/users",
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 200) {
        console.log("User state updated!");
        setUser({
          ...user,
          email: response.data.email,
          userId: response.data.user_id,
        });
        navigate("/dashboard");
      } else {
        setAlert({ ...alert, status: "error", show: true });
      }
    } catch (error) {
      console.error(error);
      setAlert({ ...alert, status: "error", show: true });
    }
  };
  return (
    <Center width="full" height="100vh" flexDirection="column" gap={4}>
      <Heading>Welcome back!</Heading>
      <Text as="span" color="gray" align="center">
        Please enter your details
      </Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // console.log(JSON.stringify(values));
          getUserAccount(values.email, values.password);
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
                  placeholder="john@example.com"
                  onChange={props.handleChange}
                  value={props.values.email}
                />
                <FormHelperText>{props.errors.email}</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  onChange={props.handleChange}
                  value={props.values.password}
                />
                <FormHelperText>{props.errors.password}</FormHelperText>
              </FormControl>
              <Button colorScheme="purple" type="submit">
                Sign In
              </Button>
              <Text align="center" color="blue.500">
                Don't have an account yet?{" "}
                <Link
                  as={ReactRouterLink}
                  to="/signup"
                  textDecoration="underline"
                >
                  Register here
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
        <Text align="center">🙊 Your email or password was wrong!</Text>
      </Alert>
    </Center>
  );
}

export default App;
