import React from "react";
import { GridItem, Image, Center } from "@chakra-ui/react";
import ProjectList from "./ProjectList";

function Sidebar() {
  return (
    <GridItem
      id="sidebar"
      bgColor="white"
      p={4}
      display="flex"
      flexDirection="column"
      borderRightWidth="1px"
      borderRightColor="gray.200"
      area={"Sidebar"}
      position="fixed"
      left={0}
      height="100%"
      minWidth="16.8%"
      maxWidth="16.8%"
    >
      <Center height="50px">
        <Image src="https://img.logoipsum.com/259.svg" boxSize="180px" />
      </Center>
      <ProjectList />
    </GridItem>
  );
}

export default Sidebar;
