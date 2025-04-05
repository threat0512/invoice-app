import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  Grid,
  Alert,
} from "@mui/material";
import { addInvoiceToUser, validateFile } from "../../../service/service";
import { AuthContext } from "../../../context/AuthContextProvider";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { PrettyBox } from "../../PrettyBox";
import LogoIcon from "../../LogoIcon";

type ValidationOutcome = "" | "loading" | "successful" | "unsuccessful";

export default function ValidatePage() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [fileName] = useState('');
  const [warning, setWarning] = useState(false);
  const [validationOutcome, setValidationOutcome] = useState<ValidationOutcome>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [validationReason, setValidationReason] = useState("");
  const [validationDetails, setValidationDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationOutcome("");
    setWarning(false);
    setSubmitted(false);


    if (e.target.files && e.target.files.length > 0) {
      const toUpload = e.target.files[0];
      if (!(toUpload.type === "text/xml")) {
        setFile(null);
        setWarning(true);
        return;
      }
      setFile(toUpload);
    } else {
      setFile(null);
    }
  };


  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const newFile = new File([file!], newName, { type: file!.type });
    setFile(newFile);
  };

  const handleFileSubmit = async () => {
    setValidationOutcome("loading");
    const reportJSON = await validateFile(user!.username, user!.password, file!) as any;
    if (reportJSON.successful) {
      setValidationOutcome("successful");
      setOpenDialog(true);
      setDialogMessage("Validation Successful");
    } else {
      setValidationOutcome("unsuccessful");
      setOpenDialog(true);
      setDialogMessage("Validation Failed");
      if (reportJSON.reason === "Both UBL assertion errors and PEPPOL assertion errors were fired") {
        let tableContent = "<table style='border-collapse: collapse;'><thead><tr><th style='border: 1px solid black;'><Typography>ID</Typography></th><th style='border: 1px solid black;'><Typography>Test</Typography></th><th style='border: 1px solid black;'><Typography>Description</Typography></th><th style='border: 1px solid black;'><Typography>Severity</Typography></th></tr></thead><tbody>";
        for (const assertionError of reportJSON.firedAssertionErrors.aunz_PEPPOL_1_1_10) {
          tableContent += `<tr><td style='border: 1px solid black;'><Typography>${assertionError.id}</Typography></td><td style='border: 1px solid black;'><Typography>${assertionError.test}</Typography></td><td style='border: 1px solid black;'><Typography>${assertionError.description}</Typography></td><td style='border: 1px solid black; color: ${assertionError.severity === 'fatal' ? 'red' : assertionError.severity === 'warning' ? 'orange' : 'inherit'}'><Typography>${assertionError.severity}</Typography></td></tr>`;
        }
        for (const assertionError of reportJSON.firedAssertionErrors.aunz_UBL_1_1_10) {
          tableContent += `<tr><td style='border: 1px solid black;'><Typography>${assertionError.id}</Typography></td><td style='border: 1px solid black;'><Typography>${assertionError.test}</Typography></td><td style='border: 1px solid black;'><Typography>${assertionError.description}</Typography></td><td style='border: 1px solid black; color: ${assertionError.severity === 'fatal' ? 'red' : assertionError.severity === 'warning' ? 'orange' : 'inherit'}'><Typography>${assertionError.severity}</Typography></td></tr>`;
        }
        tableContent += "</tbody></table>";
        setValidationReason(reportJSON.reason);
        setValidationDetails(tableContent.trim());
      } else {
        setValidationReason(reportJSON.reason);
        setValidationDetails(`<Typography>${reportJSON.details}</Typography>`);
      }
    }
    setSubmitted(true);
  };

  const handleFileStore = async () => {
    try {
      await addInvoiceToUser(user!.username, user!.password, file!)
      setSubmitted(true);
    } catch (err) {
      console.log("storage failed")
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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
          <Grid 
            container 
            wrap="nowrap" 
            alignItems={"center"} 
            width={"50%"} 
            gap={1}
          >
            <LogoIcon nav="/user" />
            <Typography 
              variant="h5" 
              fontWeight={"bold"}
              color={"white"}
            >
              Validation
            </Typography>
          </Grid>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#060C2A",
              borderRadius: "100px"
            }}
            onClick={() => {
              navigate("/user");
            }}
          >
            Dashboard
          </Button>
        </Grid>
        
        <Grid
          container
          justifyContent={"space-between"}
          height={"100%"}
          padding={"20px"}
          paddingTop={"0"}
        >
          <PrettyBox 
            width="100%"
            height="auto"
            colour="#060C2A"
          >
            <Grid
              container
              direction={"column"}
              wrap="nowrap"
              padding={2}
              height={"100%"}
            >
              <Typography variant="h3">Upload your eInvoice</Typography>
              <br />
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{
                  height: "60%",
                  color: "#7B54E8",
                  backgroundColor: "#F1E8FF",
                  borderColor: "#7B54E8",
                  '&:hover': {
                    borderColor: "#7B54E8",
                  }
                }}
              >
                Upload file
                <input type="file" onChange={handleFileChange} hidden />
              </Button>
              <br />
              {warning && <Alert severity="error">Error: the file must be XML</Alert>}
              {file && (
                <div>
                  <Typography variant="body1">
                    File details: <br />
                    Name: 
                    <input
                      
                      type="text"
                      value={fileName !== '' ? fileName : (file ? file.name : '')}
                      onChange={handleFileNameChange}
                      disabled={submitted}
                    />
                    <br />
                    Size: {file.size} bytes
                  </Typography>
                </div>
              )}

              <br />

              <Button 
                variant="contained"
                disabled={!file || validationOutcome === "loading"} 
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#28ed8e",
                  '&:hover': {
                    backgroundColor: "#44e397",
                  }
                }}
                onClick={handleFileSubmit} 
              >
                Submit
              </Button>
              <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="lg">
                <Grid
                    container
                    direction={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    padding={"20px"}
                    paddingTop={0}
                >
                    <DialogTitle>{dialogMessage}</DialogTitle>
                    {validationOutcome === "successful" ? (
                        <>
                            <Typography variant="body1">
                                Your file has been successfully validated.
                            </Typography>
                            <br />
                            <Button 
                                variant="contained"
                                sx={{
                                    backgroundColor: "#060C2A",
                                    borderRadius: "100px",
                                    '&:hover': {
                                        backgroundColor: "#7B54E8",
                                    }
                                }}
                                disabled={!file || validationOutcome !== "successful"} 
                                onClick={() => { handleFileStore(); navigate("/user"); }}
                            >
                                Store
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="body1">
                                {validationReason}
                            </Typography>
                            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: validationDetails }} />
                        </>
                    )}
                </Grid>
            </Dialog>
            </Grid>
          </PrettyBox>
          
        </Grid>
      </Grid>
    </>
  );
}
