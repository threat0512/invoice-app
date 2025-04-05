

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { Alert, Box, Button, Container, FormControl, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { changeEmail, changePassword, deleteAccount, logInAndGetUser, updateAccountType } from "../../service/service";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { PrettyBox } from "../PrettyBox";
import LogoIcon from "../LogoIcon";


function DropDown({ text, bgc, element, showElement, setShowElement }: { text: string, bgc: string, element: React.ReactNode, showElement: boolean, setShowElement: Function }) {
  return (
    <>
      <Button
        variant="contained"
        sx={{
          width: "30%",
          backgroundColor: "#060C2A",
          '&:hover': {
            backgroundColor: bgc,
          }
        }}
        onClick={() => {
          setShowElement(!showElement)
        }}
      >
        {text}
      </Button>
      {showElement && element}
    </>
  )
}

function ChangeAccountTypeForm() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [accountType, setAccountType] = useState<string>(''); // State to hold the selected account type
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  // Initialize accountType with the user's current account type
  useEffect(() => {
    if (user) {
      setAccountType(user.accountType);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateAccountType(user!.username, user!.password, accountType);
      authContext.setCurrentUser(updatedUser);
      setShowSuccess(true)
    } catch (error) {
      console.error('Error updating account type:', error);
    }
  };

  return (
    <>
      <Grid
        width={"100%"}
        padding={2}
        sx={{
          border: '1px solid #dddddd',
          borderRadius: '1em',
        }}
      >
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <TextField
              select
              margin="normal"
              id="account-select"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              fullWidth
              label="plan"
              required
            >
              <MenuItem value={"Free"}>Free</MenuItem>
              <MenuItem value={"Premium"}>Premium</MenuItem>
              <MenuItem value={"Team"}>Team</MenuItem>
            </TextField>
          </FormControl>

          <Container sx={{ width: 'fit-content', marginBottom: '1em' }}>
            <Button variant='contained' type='submit'>Confirm</Button>
          </Container>
          {
            showSuccess &&
            <Alert severity="success" sx={{ marginBottom: '1em' }}>
              Plan successfully changed.
            </Alert>
          }
        </form>
      </Grid>
    </>
  );
}

function ChangeEmailForm() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  const [newEmail, setNewEmail] = useState('')
  const [confEmail, setConfEmail] = useState('')
  const [pass, setPass] = useState('')

  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    return () => {
      setShowSuccess(false)
    }
  }, [])

  return (
    <>
      <Container sx={{
        border: '1px solid #dddddd',
        borderRadius: '1em',
      }}>
        <form 
          onSubmit={async (e) => {
            e.preventDefault()
            if (newEmail != confEmail) {
              window.alert('emails do not match')
              return;
            }
            let a = await logInAndGetUser(user!.username, pass)
            if (a == null) {
              window.alert('incorrect password')
              return
            }

            let account = await changeEmail(user!.username, user!.password, newEmail)
            if (!account) {
              window.alert('an unknown error occured')
              return
            }
            console.log(account)
            authContext.setCurrentUser(account)
            setShowSuccess(true)
          }}
          onFocus={() => setShowSuccess(false)}
        >

          <TextField
            fullWidth
            label={'new email'}
            value={newEmail}
            onChange={(e) => { setNewEmail(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <TextField
            fullWidth
            label={'confirm email'}
            value={confEmail}
            onChange={(e) => { setConfEmail(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <TextField
            fullWidth
            label={'password'}
            type='password'
            value={pass}
            onChange={(e) => { setPass(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          {
            showSuccess &&
            <Alert severity="success" sx={{ marginBottom: '1em' }}>
              Email successfully changed.
            </Alert>
          }


          <Container sx={{ width: 'fit-content', marginBottom: '1em' }}>
            <Button variant='contained' type='submit'>Confirm</Button>
          </Container>
        </form>
      </Container>

    </>
  )
}

function ChangePasswordForm() {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confPass, setConfPass] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  return (
    <>
      <Container sx={{
        border: '1px solid #dddddd',
        borderRadius: '1em',
      }}>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (newPass != confPass) {
              window.alert('passwords don\'t match')
              return;
            }
            let a = await logInAndGetUser(user!.username, oldPass)
            if (a == null) {
              window.alert('incorrect password')
              return
            }

            let account = await changePassword(user!.username, oldPass, newPass)
            if (!account) {
              window.alert('an unknown error occured')
              return
            }

            authContext.setCurrentUser(account)
            setShowSuccess(true)
          }}
          onFocus={() => setShowSuccess(false)}
        >
          <TextField
            fullWidth
            type='password'
            label={'old password'}
            value={oldPass}
            onChange={(e) => { setOldPass(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <TextField
            fullWidth
            label={'new password'}
            type='password'
            value={newPass}
            onChange={(e) => { setNewPass(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <TextField
            fullWidth
            label={'confirm new password'}
            type='password'
            value={confPass}
            onChange={(e) => { setConfPass(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <Container sx={{ width: 'fit-content', marginBottom: '1em' }}>
            <Button variant='contained' type='submit'>Confirm</Button>
          </Container>
          {
            showSuccess &&
            <Alert severity="success" sx={{ marginBottom: '1em' }}>
              Password successfully changed.
            </Alert>
          }
        </form>
      </Container>
    </>
  )
}

function DeleteAccountForm() {
  const [username, setUsername] = useState('')
  const [pass, setPass] = useState('')
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const navigate = useNavigate()

  return (
    <>
      <Container sx={{
        border: '1px solid #dddddd',
        borderRadius: '1em',
        maxWidth: '100%',
      }}>
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log('submited');

        }}>
          <Typography component={'h1'} sx={{ width: 'fit-content', margin: 'auto', fontSize: '20px', fontWeight: '600' }}>
            Are you sure you wish to delete your account?
          </Typography>
          <Typography component={'h1'} sx={{ width: 'fit-content', margin: 'auto', fontSize: '15px', textAlign: 'center' }}>
            This action is permanent and cannot be undone. To confirm, login once again.
          </Typography>

          <TextField
            fullWidth
            label={'username'}
            value={username}
            onChange={(e) => { setUsername(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <TextField
            fullWidth
            label={'password'}
            type='password'
            value={pass}
            onChange={(e) => { setPass(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' type='submit' color='error' sx={{ margin: '1em' }} onClick={async () => {
              if (username != user!.username || pass != user!.password) {
                window.alert('incorrect login')
                return
              }
              let a = await logInAndGetUser(username, pass)
              if (a == null) {
                window.alert('incorrect login');
                return;
              }
              let ret = await deleteAccount(username, pass)
              if (ret == null) {
                window.alert('error deleting account');
                return;
              }
              authContext.setCurrentUser(null)
              navigate('/thankyou')


            }}>Delete</Button>
          </Container>
        </form>
      </Container>
    </>
  )
}

export default function ProfileManagementPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  // const user = authContext.currentUser

  const [showChangeEmail, setShowChangeEmail] = useState(false)
  const [showChangePass, setShowChangePass] = useState(false)
  const [showDeleteAcc, setShowDeleteAcc] = useState(false)
  const [showChangeAccountType, setShowChangeAccountType] = useState(false);

  return (
    <>
      <Box
        bgcolor={"#7B54E8"}
        minHeight={"100vh"}
        height={"fit-content"}
      >
        <Grid
          container
          justifyContent={"space-between"} 
          alignItems={"center"}
          height={"8%"}
          paddingLeft={"20px"}
          paddingRight={"20px"}
          wrap="nowrap"
        > 
          <Grid container wrap="nowrap" alignItems={"center"} width={"50%"} gap={1}>
            <LogoIcon nav="/user" />
            <Typography 
              variant="h5" 
              fontWeight={"bold"}
              color={"white"}
            >
              Settings
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
          wrap="nowrap"
          height={"92%"}
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
              alignItems={"center"}
              gap={1}
              marginBottom={"20px"}
            >
              <AccountCircleIcon fontSize="large"/> 
              <Typography variant="h5">
                {authContext.currentUser?.username}
              </Typography>
            </Grid>

            <Grid 
              container
              direction={"column"}
              alignItems={"flex-start"}
              gap={3}
            >
              <DropDown
                setShowElement={setShowChangeAccountType}
                showElement={showChangeAccountType}
                text={"Change Plan"}
                bgc={"#7B54E8"}
                element={<ChangeAccountTypeForm />}
              />

              <DropDown 
                setShowElement={setShowChangeEmail} 
                showElement={showChangeEmail} 
                text={"Change Email"} 
                bgc={"#7B54E8"} 
                element={<ChangeEmailForm />} 
              />

              <DropDown 
                setShowElement={setShowChangePass} 
                showElement={showChangePass} 
                text={"Change password"} 
                bgc={"#7B54E8"} 
                element={<ChangePasswordForm />} 
              />

              <DropDown 
                setShowElement={setShowDeleteAcc} 
                showElement={showDeleteAcc} 
                text={"Delete account"} 
                bgc='red' 
                element={<DeleteAccountForm />} 
              />
            </Grid>
          </PrettyBox>
        </Grid>
      </Box>
    </>
  )
}