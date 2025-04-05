import { Box } from "@mui/material"
import logo from '../assets/blacklogo.png'
import { useNavigate } from "react-router-dom";

export default function LogoIcon({ nav } : { nav:string }) {
  const navigate = useNavigate();
  
  return <>
    <Box 
      component={"img"}
      src={logo}
      alt="Logo"
      width={"60px"}
      onClick={() => {navigate(nav)}}
      sx={{
        cursor: "pointer"
      }}
    />
  </>
}