import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { TextField, Button, Alert, Typography, Link, Grid, MenuItem } from '@mui/material';
import { registerUser } from "../service/service";
import logo from '../assets/logo.png'
import { PrettyBox } from "./PrettyBox";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [plan, setPlan] = useState('');
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setShowError(true);
      return;
    }
    const user = await registerUser(username, email, password, plan)
    console.log(plan)
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
            wrap="nowrap"
            height={"fit-content"}
          >
            <Typography variant="h4" fontWeight={"bold"}>Register</Typography>
            <Typography variant="subtitle1" color={"#7B54E8"}>Create a new account</Typography>
            <Link href="/login" variant="body2">
              Already have an account? Sign in here
            </Link>
            <br />
            <Grid item width={"40%"}>
              <form onSubmit={handleSubmit} onFocus={() => setShowError(false)}>
                <Grid 
                  container
                  direction={"column"}
                  alignItems={"center"}  
                  width={"100%"}
                  gap={1}
                >
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <TextField
                    select
                    id="account-select"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    fullWidth
                    label="Plan"
                    required
                  >
                    <MenuItem value={"Free"}>Free</MenuItem>
                    <MenuItem value={"Premium"}>Premium</MenuItem>
                    <MenuItem value={"Team"}>Team</MenuItem>
                  </TextField>
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
                    Sign up
                  </Button>
                  {showError && <Alert severity="error">Passwords do not match or user already exists</Alert>}
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
          justifyContent={"flex-start"}
          alignItems={"center"}
          width={"30%"}
          padding={3}
          gap={2}
          bgcolor={"#7B54E8"}
          color={"white"}
        >
          <Typography 
            variant="h4" 
            fontSize={32} 
            fontWeight={"bold"}
          >
            Our plans
          </Typography>
          
          <PrettyBox 
            width="100%" 
            height="auto"
            colour="#060C2A"
          >
            <Typography variant="h5" fontWeight={"bold"}>Free</Typography>
            <Typography variant="subtitle1">
              New to eInvoicing?<br />
              Begin with our free plan.
            </Typography>
          </PrettyBox>
          
          <PrettyBox 
            width="100%" 
            height="auto"
            colour="#060C2A"
          >
            <Typography variant="h5" fontWeight={"bold"}>Premium</Typography>
            <Typography variant="subtitle1">
              Want additional features?<br />
              Select the premium plan
            </Typography>
          </PrettyBox>
          
          <PrettyBox 
            width="100%" 
            height="auto"
            colour="#060C2A"
          >
            <Typography variant="h5" fontWeight={"bold"}>Team</Typography>
            <Typography variant="subtitle1">
              Coming soon!
            </Typography>
          </PrettyBox>
        </Grid>
      </Grid>
    </>
  );
}
