/* eslint-disable @typescript-eslint/ban-types */
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import InvoicesBox from "./InvoicesBox";
import ProfileBox from "./ProfileBox";
import ValidatePage from "./get_started/ValidatePage";
import CreationPage from "../redundant/CreationPage";
import { AuthContext } from "../../context/AuthContextProvider";
import {
  getXmlData,
} from "../../service/service";
import {
  Button, Typography, Grid
} from '@mui/material';
import ProfileManagementPage from './ProfileManagementPage'
import { PrettyBox } from "../PrettyBox";
import LogoIcon from "../LogoIcon";

function Dashboard() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  return (
    <>
      <Grid
        container
        direction={"column"}
        wrap="nowrap"
        height={"100vh"}
        bgcolor={"#7B54E8"}
      >
        <Grid
          container
          justifyContent={"space-between"} 
          alignItems={"center"}
          height={"auto"}
          paddingLeft={"20px"}
          paddingRight={"20px"}
          wrap="nowrap"
        > 
          <Grid container wrap="nowrap" alignItems={"center"} width={"50%"} gap={1}>
            <LogoIcon nav="/" />
            <Typography 
              variant="h5" 
              fontWeight={"bold"}
              color={"white"}
            >
              Dashboard
            </Typography>
          </Grid>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#060C2A",
              borderRadius: "100px"
            }}
            onClick={() => {
              authContext.setCurrentUser(null);
              navigate("/login");
            }}
          >
            Sign Out
          </Button>
        </Grid>

        <Grid
          container
          justifyContent={"space-between"}
          wrap="nowrap"
          height={"100%"}
          padding={"20px"}
          paddingTop={"0"}
          gap={"20px"}
        >
          <PrettyBox
            width="20%" 
            height="auto"
            colour="#060C2A" 
          >
            <ProfileBox />
          </PrettyBox>

          <PrettyBox 
            width="80%" 
            height="auto"
            colour="#060C2A" 
          >
            <InvoicesBox />
          </PrettyBox>
        </Grid>
      </Grid>
    </>
  );
}

function InvoiceView() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const { invoiceName } = useParams();
  const [xmlData, setXmlData] = useState("Fetching...");

  useEffect(() => {
    console.log(invoiceName);
    if (!invoiceName) {
      setXmlData("Your invoice couldn't be loaded");
    }

    getXmlData(user!.username, user!.password, invoiceName!).then((data) => {
      if (data == null) {
        setXmlData("Your invoice couldn't be loaded");
        return;
      }
      setXmlData(data);
    });
  }, []);

  return (
    <>
      <Typography variant="h1">{invoiceName}</Typography>
      <pre>
        {xmlData}
      </pre>
    </>
  );
}

export default function DashboardPage() {
  const authContext = useContext(AuthContext);

  return (
    <>
      {authContext.currentUser == null ? (
        <Navigate to="/login" />
      ) : (
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/upload" element={<ValidatePage />} />
          <Route path="/create/*" element={<CreationPage />} />
          <Route path="/profile" element={<ProfileManagementPage />} />
          <Route
            path="/view-invoice/:invoiceName"
            element={<InvoiceView />}
          ></Route>
        </Routes>
      )}
    </>
  );
}
