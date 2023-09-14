import { useContext } from "react";
import {
  GridItem,
  Stack,
  Image,
  Box,
  Heading,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { FaAngleDown } from "react-icons/fa6";
import { ProjectContext, UserContext } from "../../contexts";
import { useNavigate } from "react-router-dom";

function Header() {
  const { state } = useContext(ProjectContext);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { selectedProject } = state;
  const projectName = state.projects.data.projects?.find(
    (item) => item.project_id === selectedProject
  );

  const handleLogout = () => {
    setUser({ ...user, email: "", userId: "" });
    sessionStorage.removeItem("user_account");
    navigate("/");
  };

  return (
    <GridItem
      id="project-title"
      area={"Project-title"}
      position="fixed"
      right={0}
      top={0}
      width="calc(100% - 16.8%)"
      zIndex={10}
    >
      <Stack
        bgColor="white"
        p={4}
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        direction="row"
        justifyContent="space-between"
      >
        <Stack direction="row" gap={4}>
          <Image
            src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${projectName?.title}&backgroundColor=BEE3F8`}
            boxSize="80px"
            rounded="lg"
          />
          <Box maxWidth="xl">
            <Heading size="md">{projectName?.title}</Heading>
            <Text fontSize="sm" mt={4} color="gray.500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
              tenetur aliquid sint eligendi reiciendis ipsum velit
            </Text>
          </Box>
        </Stack>
        <Box>
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={
                <Image
                  src={`https://api.dicebear.com/7.x/open-peeps/svg?seed=${
                    user.email.split("@")[0]
                  }`}
                  boxSize="35px"
                  borderRadius="full"
                  bgColor="yellow.200"
                />
              }
              rightIcon={<FaAngleDown />}
              px={2}
              bgColor="transparent"
              textTransform="capitalize"
            >
              {user.email.split("@")[0]}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Stack>
    </GridItem>
  );
}

export default Header;
