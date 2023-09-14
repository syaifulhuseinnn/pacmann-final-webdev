import { GridItem } from "@chakra-ui/react";
import Tasks from "./Tasks";

function Content() {
  return (
    <GridItem
      id="tasks"
      area={"Tasks"}
      display="grid"
      gridTemplateColumns={"1fr 1fr 1fr"}
      gridTemplateAreas={`"todo doing done"
            "todo doing done"
            "todo doing done"`}
    >
      <Tasks />
    </GridItem>
  );
}

export default Content;
