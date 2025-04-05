import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ThankYouPage() {
  const navigate = useNavigate();
  return (
    <>
      <Container maxWidth='md' sx={{border:'1px solid #dddddd', backgroundColor: '#fcfcfc', marginTop: '20vh', padding: '40px'}}>
        <Typography component={'h1'} sx={{width: 'fit-content', margin: 'auto', fontSize: '30px', fontWeight: '600', marginBottom: '1em'}}>
          Account Deleted
        </Typography>
        <Typography component={'h1'} sx={{width: 'fit-content', margin: 'auto', fontSize: '20px', fontWeight: '600'}}>
          Thank you for using our service.
        </Typography>
        <Typography component={'h1'} sx={{width: 'fit-content', margin: 'auto', fontSize: '20px', fontWeight: '600', marginBottom: '1em'}}>
          We hope to see you again!
        </Typography>

        <Container sx={{width: 'fit-content'}}>
          <Button variant='contained' sx={{padding: '0.2em 2em'}} onClick={() => navigate('/')} >
            HOME
          </Button>
        </Container>
        
      </Container>
    </>
  )
}