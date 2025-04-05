import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContextProvider";
import { EInvoiceItem } from "../../../data";
import {
  sendInvoicesByNames,
} from "../../../service/service";
import ErrorPopup from "./ErrorPopup";
import {
  Box,
  Button, Dialog, Grid, TextField,
  Typography
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

function SendPopup({ invoices, setPopup }: { invoices: EInvoiceItem[], Popup: boolean, setPopup: Function }) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [emailListStr, setEmailListStr] = useState('');
  const [from, setFrom] = useState('');
  const [buttonText, setButtonText] = useState('SEND');

  const closePopup = () => {
    setPopup(false);
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
          <Typography variant="h5" fontWeight={"bold"}>Send eInvoice</Typography>
        
          <form onSubmit={(e) => { e.preventDefault() }}>
            <TextField
              fullWidth
              label="Recipient emails (comma separated)"
              value={emailListStr}
              onChange={(e) => setEmailListStr(e.target.value)}
            />
            <TextField
              fullWidth
              label="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Grid 
              container
              justifyContent={"center"}
              gap={"8px"}
              paddingTop={"8px"}
            >
              <Button 
                variant="contained"
                sx={{
                  backgroundColor: "#060C2A",
                  '&:hover': {
                    backgroundColor: "#7B54E8",
                  }
                }}
                onClick={async () => {
                  const emails = emailListStr.split(',').filter(e => e !== '');
                  if (emails.length == 0) {
                    window.alert('Enter at least one email');
                    return;
                  }
                  const invoiceNames = invoices.filter(invoice => invoice.checked).map(invoice => invoice.name);
                  if (invoiceNames.length == 0) {
                    window.alert('No invoices are selected');
                    return;
                  }

                  if (!from) {
                    window.alert('Please fill out the "From" field');
                    return;
                  }

                  setButtonText('SENDING...');
                  const res = await sendInvoicesByNames(user!.username, user!.password, invoiceNames, emails, from);
                  if (!res.success) {
                    window.alert('Send failed');
                    return;
                  }
                  setButtonText('SENT');
                  setTimeout(closePopup, 1000);
                }} 
                disabled={buttonText !== 'SEND'}
              >
                {buttonText}
              </Button>
              <Button 
                variant="contained"
                sx={{
                  backgroundColor: "#060C2A",
                  '&:hover': {
                    backgroundColor: "#F22556",
                  }
                }}
                disabled={buttonText !== 'SEND'} 
                onClick={closePopup}
              >
                Cancel
              </Button>
            </Grid>
          </form>
        </Grid>
      </Dialog>
    </>
  )
}

export default function SendButton({ invoices }: { invoices: EInvoiceItem[] }) {
  const [Popup, setPopup] = useState(false);
  const [Error, setError] = useState(false);
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  const openPopup = () => {
    if (!invoices.find(i => i.checked)) {
      setError(true);
    } else {
      setPopup(true);
    }
  }

  return (
    <>
      {user && user.accountType != "Free" ? (
        <Button 
          variant="contained" 
          fullWidth 
          sx={{
            backgroundColor: "#7B54E8",
            '&:hover': {
              backgroundColor: "#6a47cd",
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
            <EmailIcon /> Send <Box></Box> 
          </Grid>
        </Button>
      ) : (
        <Button
          variant="contained"
          fullWidth
          disabled
          endIcon={<LockIcon />}
        >
          Send
        </Button>
      )}

      {Popup && <SendPopup invoices={invoices} Popup={Popup} setPopup={setPopup} />}
      {Error && <ErrorPopup Popup={Error} setPopup={setError} />}
    </>
  );
}