import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContextProvider";
import { EInvoiceItem, arraysEqual } from "../../../data";
import {
  setUserSavedTags,
} from "../../../service/service";
import {
  Box,
  Button, Dialog, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField,
  Tooltip,
  Typography
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import LabelIcon from '@mui/icons-material/Label';
import {setTagListForInvoice} from '../../../service/service'

function TagWithX({text, rmvFunction}: {text: string, rmvFunction: Function}) {
  return (
    <Typography fontSize={15} sx={{
      marginRight: '0.5em',
      marginBottom: '0.5em',
      borderRadius: '5px',
      padding: '0.5em',
      backgroundColor: 'grey',
      color: 'white',
      textWrap: 'nowrap',
      width: 'fit-content',
      position: 'relative',
      display: 'flex',
      alignItems:'center'
    }}>
    {text}
    <RemoveCircleIcon fontSize="small"
      sx={{
        '&:hover': {
          color: "#ffbdbd",
          cursor: 'pointer'
        },
        marginLeft: '0.5em'
      }}
      onClick={() => rmvFunction()}
    />
    </Typography>
  )
}

function Tag({text}: {text: string}) {
  return (
    <Typography fontSize={15} sx={{
      borderRadius: '5px',
      padding: '0.1em', 
      backgroundColor: 'grey',
      color: 'white',
      textWrap: 'nowrap',
      width: 'fit-content'
    }}>{text}</Typography>
  )
}


function ManageInvoicePopup({ invoices, setInvoices, index, setPopup }: { invoices: EInvoiceItem[], setInvoices: Function, index:number, Popup: boolean, setPopup: Function }) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [searchBarTxt, setSearchBarTxt] = useState('')
  const [tempTagList, setTempTagList] = useState<string[]>([...invoices[index].tags])
  const [tempUserTagList, setTempUserTagList] = useState<string[]>([...user!.savedTags])

  const shownUserTags = tempUserTagList.filter(ut => RegExp(searchBarTxt).test(ut))

  const pushTagListChanges = async (tagList: string[]) => {
    let newInvoices = JSON.parse(JSON.stringify(invoices)) as EInvoiceItem[]
    let invoice = newInvoices[index]

    let tagRet = await setTagListForInvoice(user!.username, user!.password, invoice.name, tagList)
    invoice.tags = tagRet
    setInvoices(newInvoices)
  }

  const addSavedTag = async (tag: string) => {
    // add new tags to the existing tempUserTagList array
    // short the length to 30
    // assume tempUserTagList is unique
    if (tempUserTagList.includes(tag)) {
      return
    }
    let newTempTagList = [tag, ...tempUserTagList];
    newTempTagList = newTempTagList.slice(0, 30);
    console.log(newTempTagList)
    addTagToInvoice(tag)
    setTempUserTagList(newTempTagList)
  }

  const addTagToInvoice = async(tag: string) => {
    if (tempTagList.includes(tag)) {
      return;
    }
    setTempTagList([...tempTagList, tag])
  }

  /**
   * update the commonly used tags array of the user to the new one
   */
  const pushUserTaglistChanges = async() => {
    const newUser = await setUserSavedTags(user!.username, user!.password, tempUserTagList)
    authContext.setCurrentUser(newUser)
  }

  const closePopup = () => {
    if (!arraysEqual(tempTagList, invoices[index].tags)) {
      if (!window.confirm('You have unsaved changes. Do you want to discard them?')) {
        return
      }
    }
    setPopup(false);
  }

  return (
    <>
      <Dialog onClose={closePopup} open>
        <DialogTitle>Manage tags for {invoices[index].name}</DialogTitle>
        <Box sx={{padding: '1em'}}>
          <Box sx={{
            border: '1px solid black', 
            padding: '0.5em',
            borderRadius: '0.5em', 
            minHeight: '1em',
            display: 'flex',
            flexWrap: 'wrap',
            maxWidth: '500px',
            marginBottom: '1em'
          }}>
            {
              tempTagList.length == 0 ?
                <Typography>No Tags</Typography>
              :
              tempTagList.map(tag => <div key={tag}> <TagWithX text={tag}
                rmvFunction={() => {
                  setTempTagList(tempTagList.filter(t => t !== tag))
                }}
              ></TagWithX></div>)
            }
          </Box>

          <TextField
            label='Add tag: eg. UNPAID'
            value={searchBarTxt}
            onChange={(e) => {
              const newTxt = e.target.value
              if (!/^[a-zA-Z0-9_-]*$/.test(newTxt)) {
                return
              }
              setSearchBarTxt(newTxt.toUpperCase())
            }}
            sx={{
              marginBottom: '1em'
            }}
          >
          </TextField>
          
          <Box sx={{overflowY: 'scroll', overflowX: 'hidden', height:'200px', border: '1px solid black', position: 'relative', borderRadius: '0.5em', marginBottom: '1em'}}>
            <List>
              {
                shownUserTags.length == 0 ? 
                  <Typography>No recent tags</Typography>
                :
                shownUserTags.map(userTag => 
                <ListItem
                  disablePadding
                  key={userTag}
                  onClick={() => {addTagToInvoice(userTag); setSearchBarTxt('')}}
                >
                  <ListItemButton>
                    <ListItemIcon sx={{minWidth: '40px'}}>
                      <AccessTimeIcon />
                    </ListItemIcon>
                    <ListItemText sx={{display: 'flex', alignItems: 'center'}}>
                      <Tag text={userTag}></Tag>
                    </ListItemText>
  
                    <ListItemIcon>
                      <IconButton edge="end" aria-label="comments">
                        <Typography sx={{marginRight:'1em'}}>Add</Typography>
                        <AddIcon></AddIcon>
                      </IconButton>
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
                )
              }
              </List>

              {
                (!shownUserTags.includes(searchBarTxt) && searchBarTxt.length > 0) &&
                <ListItemButton
                  sx={{
                    backgroundColor: "#dfffd9",
                    '&:hover': {
                      backgroundColor: "#c7ffbd",
                    },
                    position: 'sticky',
                    width: '100%',
                    bottom: '0px'
                  }}
                  onClick={() => {
                    setSearchBarTxt('')
                    addSavedTag(searchBarTxt)
                  }}
              >
                <ListItemIcon sx={{minWidth: '40px'}}>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText sx={{display: 'flex', alignItems: 'center'}}>
                  <Tag text={searchBarTxt}></Tag>
                </ListItemText>
                <ListItemIcon>
                  <IconButton edge="end" aria-label="comments">
                    <Typography sx={{marginRight:'1em'}}>Create and add new tag</Typography>
                    <AddIcon />
                  </IconButton>
                </ListItemIcon>
              </ListItemButton>
              }
          </Box>
          <Button variant='contained' onClick={() => {
            pushTagListChanges(tempTagList)
            pushUserTaglistChanges()
          }}>
            save changes
          </Button>
        </Box>

        

        
      </Dialog>
    </>
  )
}

export default function ManageTagButton({invoices, setInvoices, index}: {invoices: EInvoiceItem[], setInvoices: Function, index: number}) {
  const [Popup, setPopup] = useState(false);

  const openPopup = () => {
    setPopup(true)
  }

  return ( 
    <>
      
      <Tooltip title="Manage tags">
        <IconButton
          onClick={openPopup}
          aria-label="Tags"
        >
          <LabelIcon />
        </IconButton>
      </Tooltip>
      
      
      {Popup && <ManageInvoicePopup invoices={invoices} setInvoices={setInvoices} index={index} Popup={Popup} setPopup={setPopup} />}
    </>
  );
}