import { useContext, useEffect } from "react";
import { Container, Grid } from "@chakra-ui/react";
import { ProjectProvider, UserContext } from "../../contexts";
import { Header, Sidebar, Content } from "../../components/dashboard";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const userAccount = sessionStorage.getItem("user_account");
    if ((user.email && user.userId) || userAccount) {
      console.log("Dashboard: User state existed");
    } else {
      console.log("Dashboard: User state doesn't existed");
      navigate("/");
    }
  }, []);

  return (
    <ProjectProvider>
      <Container maxWidth="full" p={0} backgroundColor="gray.50">
        <Grid
          gridTemplateColumns={"0.6fr 1fr 1fr 1fr"}
          gridTemplateRows={"115px 1fr 1fr"}
          gridTemplateAreas={`
            "Sidebar Project-title Project-title Project-title"
            "Sidebar Tasks Tasks Tasks"
            "Sidebar Tasks Tasks Tasks"
          `}
          minHeight="100vh"
        >
          <Sidebar />
          <Header />
          <Content />
        </Grid>
      </Container>
    </ProjectProvider>
  );
}

export default Dashboard;
