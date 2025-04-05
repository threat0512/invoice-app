import { Box, Grid, Paper } from "@mui/material";
import React from "react";


export function PrettyBox ({ width, height, colour, children } : {width: string, height: string, colour: string, children: React.ReactNode }) {
  const size = "16px"

  return (
    <>
      <Grid 
        container
        width={width}
        height={height}
        paddingRight={size}
        paddingBottom={size}
      > 
        <Paper
          elevation={10} 
          square
          sx={{ 
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            padding: "20px",
            zIndex: "1"
          }}
        >
          {children}
        </Paper>
        
        <Box
          position={"relative"}
          zIndex={"0"}
          bgcolor={colour}
          width={"100%"}
          height={"100%"}
          marginTop={size}
          left={size}
          bottom={"100%"}
        />
      </Grid>
    </>
  );
}