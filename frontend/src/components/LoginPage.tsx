import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { TextField, Button, Alert, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { logInAndGetUser } from "../service/service";
import logo from '../assets/logo.png'

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const user = await logInAndGetUser(username, password);

    if (user == null) {
      setShowError(true);
      return;
    }
    authContext.setCurrentUser(user);
    navigate("/user");
  };

  return (
    <>
      <Grid 
        container
        height={"100vh"}
        width={"100vw"}
      >
        <Grid 
          container
          direction={"column"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"70%"}
          padding={2}
        >
          <Grid
            container
            alignItems={"center"}
            gap={2}
          >
            <img src={logo} alt="Logo" width={"80px"}/>
            <Typography 
              variant="h4" 
              fontWeight={"bold"}
            >
              3000% Returns
            </Typography>
          </Grid>

          <Grid 
            container
            direction={"column"}
            alignItems={"center"}
            height={"fit-content"}
          >
            <Typography variant="h4" fontWeight={"bold"}>Login</Typography>
            <Typography variant="subtitle1" color={"#7B54E8"}>Sign in to your account</Typography>
            <br />
            <Grid item width={"40%"}>
              <form 
                onSubmit={handleSubmit}
              >
                <Grid 
                  container
                  direction={"column"}
                  alignItems={"center"}  
                  width={"100%"}
                  gap={2}
                >
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#060C2A",
                      width: "60%",
                      borderRadius: "100px",
                      '&:hover': {
                        backgroundColor: "#7B54E8",
                      }
                    }}
                  >
                    Sign in
                  </Button>
                  {showError && <Alert severity="error">Incorrect username or password!</Alert>}
                </Grid>
              </form>
            </Grid>
          </Grid>
          
          <Grid
            container
            justifyContent={"flex-end"}
          >
            <Button variant="text" color="primary" onClick={() => navigate("/")}>
              Return to homepage →
            </Button>
          </Grid>
          
        </Grid>

        
        <Grid 
          container
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"30%"}
          bgcolor={"#7B54E8"}
          color={"white"}
        >
          <Typography 
            variant="h4" 
            fontSize={32} 
            fontWeight={"bold"}
          >
            Don't have an account?
          </Typography>
          <Typography variant="subtitle1">Gain access to our eInvoicing services</Typography>
          <br />
          <Button 
            variant="contained" 
            sx={{
              width: "40%",
              height: "45px",
              color: "#060C2A",
              backgroundColor: "white",
              borderRadius: "100px",
              '&:hover': {
                color: "white",
                backgroundColor: "#060C2A",
              }
            }}
            onClick={() => navigate("/register")}
          >
            Sign up
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
