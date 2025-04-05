import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import {
  Typography, Grid, Box,
  IconButton,
  Button
} from '@mui/material';
import { Container } from "react-bootstrap";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";

export default function ProfileBox() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const user = authContext.currentUser;

  return (
    <>
      <Grid 
        container
        alignItems={"center"}
        gap={1}
      >
        <IconButton
          onClick={() => navigate("/user/profile")}
        >
          <AccountCircleIcon fontSize="large"/> 
        </IconButton>
        <Typography variant="h4">
          {authContext.currentUser?.username}
        </Typography>
      </Grid>
      <Button
        size="small"
        onClick={() => {navigate("./profile")}}
      >
        Manage account →
      </Button>
      <br />
      <br />
      <Container>
        <Typography variant="h6">
          Plan: {user?.accountType} <br />
        </Typography>
        <Typography variant="h6">
          Team:
        </Typography>
        <Box bgcolor={"#F1E8FF"} minHeight={250} display="flex" justifyContent="center" alignItems="center">
          <Typography variant="body2">
            You are currently not in a team
          </Typography>
        </Box>
      </Container>
    </>
  )
}