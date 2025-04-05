import { useContext, useState } from "react";
import { EInvoiceItem } from "../../../data";
import ErrorPopup from "./ErrorPopup";
import {
  Box,
  Button, 
  Grid,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import {
  downloadInvoices,
} from "../../../service/service";
import { AuthContext } from "../../../context/AuthContextProvider";

// function DownloadPopup({ invoices, setPopup }: { invoices: EInvoiceItem[], Popup: boolean, setPopup: Function }) {
//   const authContext = useContext(AuthContext);
//   const user = authContext.currentUser;

//   const closePopup = () => {
//     setPopup(false);
//   }

//   return (
//     <>
//       <Dialog onClose={closePopup} open>
//         <Grid
//           container
//           direction={"column"}
//           alignItems={"center"}
//           padding={3}
//           gap={2}
//         >
//           <Typography variant="h5" fontWeight={"bold"}>Download eInvoice</Typography>
//           <Button
//             variant="contained"
//             onClick={async () => {
//               const invoiceNames = invoices.filter(invoice => invoice.checked).map(invoice => invoice.name);
//               try {
//                 await downloadInvoices(user!.username, user!.password, invoiceNames);
//                 setTimeout(closePopup, 1000);
//               } catch (error) {
//                 console.error('Download failed:', error);
//                 window.alert('Download failed. Please try again later.');
//               }
//             }}
//           >
//             Confirm
//           </Button>
//         </Grid>

        
//       </Dialog>
//     </>
//   )
// }

export default function DownloadButton({ invoices }: { invoices: EInvoiceItem[] }) {
  // const [Popup, setPopup] = useState(false);
  const [Error, setError] = useState(false);

  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  // const openPopup = () => {
  //   if (!invoices.find(i => i.checked)) {
  //     setError(true);
  //   } else {
  //     setPopup(true);
  //   }
  // }

  return (
    <>
      <Button 
        variant="contained" 
        fullWidth 
				sx={{
					backgroundColor: "#7B54E8",
					'&:hover': {
						backgroundColor: "#6a47cd",
					}
				}}
        onClick={async () => {
          const invoiceNames = invoices.filter(invoice => invoice.checked).map(invoice => invoice.name);
          try {
            await downloadInvoices(user!.username, user!.password, invoiceNames);
          } catch (error) {
            console.error('Download failed:', error);
            window.alert('Download failed. Please try again later.');
          }
        }}
      >
        <Grid 
          container 
          justifyContent={"space-between"} 
          alignItems={"center"}
          wrap="nowrap"
        >
          <DownloadIcon /> Download <Box></Box> 
        </Grid>
      </Button>

      {/* {Popup && <DownloadPopup Popup={Popup} setPopup={setPopup} invoices={invoices} />} */}
      {Error && <ErrorPopup Popup={Error} setPopup={setError} />}
    </>
  );
}