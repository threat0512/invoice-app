import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { Typography, Button, Grid, Box } from "@mui/material";
import { PrettyBox } from "./PrettyBox";
import invoice from '../assets/invoice.png'
import LogoIcon from "./LogoIcon";

function Header() {
  const authContext = useContext(AuthContext);

  return <>
    <Grid
      container
      justifyContent={"space-between"} 
      alignItems={"center"}
      height={"auto"}
      wrap="nowrap"
    > 
      <Grid container wrap="nowrap" alignItems={"center"} width={"50%"} gap={1}>
        <LogoIcon nav=""/>
        <Typography 
          variant="h5" 
          fontWeight={"bold"}
          color={"white"}
        >
          3000% Returns
        </Typography>
      </Grid>
      {authContext.currentUser == null ? (
        <>
          <Grid container gap={2} justifyContent={"flex-end"}>
            <Button 
              component={Link} 
              to="/login" 
              variant="contained"
              sx={{
                backgroundColor: "#060C2A",
                borderRadius: "100px"
              }}
            >
              Sign In 
            </Button>
            <Button 
              component={Link} 
              to="/register" 
              variant="contained"
              sx={{
                backgroundColor: "#060C2A",
                borderRadius: "100px"
              }}
            >
              Sign Up
            </Button>
          </Grid>
        </>
      ) : (
        <>
          <Button 
            component={Link} 
            to='/user' 
            variant="contained"
            sx={{
              backgroundColor: "#060C2A",
              borderRadius: "100px"
            }}
          >
            Dashboard
          </Button>
        </>
      )}
    </Grid>
  </>;
}

function Plan({ name, children, price } : { name:String, children:React.ReactNode, price:string }) {
  let rate = /^\$/.test(price)
  
  return <>
    <Grid container width={"100%"}>
      <PrettyBox
        width="100%"
        height="auto"
        colour="#7B54E8"
      >
        <Grid
          container
          direction={"row"}
          wrap="nowrap"
          justifyContent={"space-between"}
          width={"100%"}
        >
          <Grid
            container
            direction={"column"}
            width={"70%"}
          >
            <Typography variant="h5">{name}</Typography>
            <Typography>
              {children}
            </Typography>
          </Grid>
          <Grid
            container
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"30%"}
          >
            <Typography variant="h3">{price}</Typography>
            {rate ? (<Typography variant="h5">per month</Typography>) : (<></>)}
          </Grid>
        </Grid>
      </PrettyBox>
    </Grid>
  </>;
}

function Plans() {
  return <>
    <Grid
      container
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"fit-content"}
      bgcolor={"#060C2A"}
      padding={"5vw"}
      paddingTop={"3vw"}
      gap={4}
    >
      <Typography variant="h3" fontWeight={"bold"} color={"white"}>Our Subsciption Plans</Typography>

      <Plan
        name={"Free"}
        price={"Free"}
      >
        - Invoice creation <br />
        - Invoice validation <br />
        - Store up to five invoices
      </Plan>

      <Plan
        name={"Premium"}
        price={"$15"}
      >
        - Access to the same features as the free plan <br />
        - Invoice rendering <br />
        - Invoice sending <br />
        - Unlimited storage
      </Plan>

      <Plan
        name={"Team"}
        price={"Coming soon"}
      >
        - Work in teams of at at least 5 users <br />
        - Each user receives a premium account <br />
        - Users in a team gain access to new features, allowing collaborative work
      </Plan>
    </Grid>
  </>;
}

export default function LandingPage() {
  const authContext = useContext(AuthContext);

  return (
    <>
      <Grid
        container
        direction={"column"}
        bgcolor={"#7B54E8"}
        height={"fit-content"}
        justifyContent={"center"}
        alignItems={"flex-start"}
        padding={"20px"}
        paddingTop={"0px"}
        paddingBottom={8}
        gap={4}
      >
        <Header />
        
        <Grid
          container
          justifyContent={"space-between"}
          direction={"row"}
          color={"white"}
          wrap="nowrap"
          paddingLeft={"100px"}
        >
          <Grid
            container
            direction={"column"}
            width={"35%"}
            justifyContent={"center"}
            gap={2}
          >
            <Typography variant="h2" fontWeight={"bold"}>eInvoicing made simple</Typography>
            <Typography variant="subtitle1">
              Say goodbye to paper invoices and embrace the digital age. <br />
              Revolutionize your billing process by effortlessly with creating, sending, and tracking eInvoices. <br />
              Make invoicing hassle-free and eco-friendly with e-invoicing today!
            </Typography>
            {authContext.currentUser == null ? (
              <>
                <Button 
                  component={Link} 
                  to="/register" 
                  variant="contained"
                  sx={{
                    height: "40px",
                    marginTop: "20px",
                    borderRadius: "100px",
                    fontWeight: "bold",
                    backgroundColor: "#28ed8e",
                    '&:hover': {
                      backgroundColor: "#44e397",
                    }
                  }}
                >
                  Get started
                </Button>
              </>
            ) : (
              <>
                <Button 
                  component={Link} 
                  to="/user" 
                  variant="contained"
                  sx={{
                    height: "40px",
                    marginTop: "20px",
                    borderRadius: "100px",
                    fontWeight: "bold",
                    backgroundColor: "#28ed8e",
                    '&:hover': {
                      backgroundColor: "#44e397",
                    }
                  }}
                >
                  Get started
                </Button>
              </>
            )}
          </Grid>
          
          <Grid 
            container
            justifyContent={"center"}
            alignItems={"center"}
            width={"65%"}
          >
            <PrettyBox 
              width="40%"
              height="90%"
              colour="#060C2A" 
            >
              <Box 
                component={"img"}
                src={invoice}
                width={"100%"}
                height={"100%"}
              />
            </PrettyBox>
          </Grid>
          
        </Grid>
      </Grid>

      <Plans />
    </>
  );
}
