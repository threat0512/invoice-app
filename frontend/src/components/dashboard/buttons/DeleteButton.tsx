import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContextProvider";
import { EInvoiceItem } from "../../../data";
import {
  deleteInvoicesFromUser,
} from "../../../service/service";
import ErrorPopup from "./ErrorPopup";
import {
  Box,
  Button, Dialog,
  Grid,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function DeletePopup({ invoices, setPopup, setInvoices }: { invoices: EInvoiceItem[], Popup: boolean, setPopup: Function, setInvoices: Function }) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  const closePopup = () => {
    setPopup(false);
  }

  async function deleteInvoice() {
    const names = invoices
      .filter((invoice) => invoice.checked)
      .map((invoice) => invoice.name);
    await deleteInvoicesFromUser(
      user!.username,
      user!.password,
      names
    );

    setInvoices(invoices.filter((invoice) => !invoice.checked));
  }

  return (
    <>
      <Dialog onClose={closePopup} open>
        <Grid 
          container
          direction={"column"}
          alignItems={"center"}
          padding={3}
          gap={2}
        >
          <Typography variant="h5" fontWeight={"bold"}>Delete eInvoice</Typography>
          <Typography variant="subtitle1">
            Are you sure? Invoice(s) will be permanently deleted.
          </Typography>
          <Grid 
            container 
            justifyContent={"center"}
            gap={"8px"}
          >
            <Button 
              variant="contained"
              sx={{
                backgroundColor: "#F22556",
                '&:hover': {
                  backgroundColor: "#d71e4a",
                }
              }}
              onClick={() => {
                deleteInvoice();
                closePopup();
              }}
            >
              Delete
            </Button>
            <Button 
              variant="contained"
              sx={{
                backgroundColor: "#060C2A",
                '&:hover': {
                  backgroundColor: "#7B54E8",
                }
              }}
              onClick={closePopup}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </>
  )
}

export default function DeleteButton({invoices, setInvoices}: {invoices : EInvoiceItem[], setInvoices: Function } ) {
  const [Popup, setPopup] = useState(false);
  const [Error, setError] = useState(false);

  const openPopup = () => {
    if (!invoices.find(i => i.checked)) {
      setError(true);
    } else {
      setPopup(true);
    }
  }

  return ( 
    <>
      <Button 
        variant="contained" 
        fullWidth 
        sx={{
          backgroundColor: "#F22556",
          '&:hover': {
            backgroundColor: "#d71e4a",
          }
        }}
        onClick={openPopup}
      >
        <Grid 
          container 
          justifyContent={"space-between"} 
          alignItems={"center"}
          wrap="nowrap"
        >
          <DeleteIcon /> Delete <Box></Box> 
        </Grid>
      </Button>
      
      {Popup && <DeletePopup invoices={invoices} Popup={Popup} setPopup={setPopup} setInvoices={setInvoices} />}
      {Error && <ErrorPopup Popup={Error} setPopup={setError}/>}
    </>
  );
}