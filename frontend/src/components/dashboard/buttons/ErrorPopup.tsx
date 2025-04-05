import {
  Dialog,
  Grid,
  Typography
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export default function ErrorPopup({ setPopup } : { Popup: boolean, setPopup: Function }) {
  const closeError = () => {
    setPopup(false);
  }

  return (
    <>
      <Dialog onClose={closeError} open>
        <Grid 
          container
          direction={"column"}
          alignItems={"center"}
          padding={2}
          gap={1}
        >
          <ErrorIcon color='error' />
          <Typography variant='subtitle1'>Please select a file</Typography>
        </Grid>
      </Dialog>
    </>
  )
}