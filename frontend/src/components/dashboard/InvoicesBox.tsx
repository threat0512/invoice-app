/* eslint-disable @typescript-eslint/ban-types */
import { useContext, useEffect, useState } from "react";
import DownloadButton from "./buttons/DownloadButton";
import SendButton from "./buttons/SendButton";
import { AuthContext } from "../../context/AuthContextProvider";
import { EInvoiceItem } from "../../data";
import {
  getInvoicesBelongingTo,
  getPdfLink,
  getXmlData,
} from "../../service/service";
import {
  Checkbox, FormControlLabel,
  Typography, Grid, Box,
  IconButton,
  Tooltip,
  TextField,
  Chip,
} from '@mui/material';
import GetStartedButton from "./buttons/GetStartedButton";
import DeleteButton from "./buttons/DeleteButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ManageTagButton from "./buttons/ManageTagButton";
import { evaluateString } from "./buttons/TagSelectionEvaluator";

const buttonWidth = "65%";

function Header({invoices}: {invoices: EInvoiceItem[]}) {
  return (
    <>
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        height={"auto"}
      >
        <Grid item xs>
          <Typography variant="h4" fontWeight={"bold"}>Invoices</Typography>
        </Grid>
        <Grid item width={buttonWidth}>
          <GetStartedButton invoices={invoices} />
        </Grid>
      </Grid>
    </>
  );
}

function Buttons({
  search, 
  setSearch,
  tagSelectionTxt,
  setTagSelectionTxt,
  invoices,
  setInvoices
}: {search: string, setSearch: Function, tagSelectionTxt: string, setTagSelectionTxt: Function, invoices: EInvoiceItem[], setInvoices: Function}) {
  return (
    <>
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        height={"auto"}
      >
        <Grid
          item
          xs
          paddingRight={"8px"}
        >
          <Box sx={{display:'flex', justifyContent: 'space-between'}}>
            <TextField 
              label="Search invoices" 
              type="search"
              variant="outlined" 
              size="small"
              fullWidth
              sx={{marginRight: '1em'}}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <TextField 
              fullWidth 
              sx={{marginRight: '1em'}} 
              label="Search tags" 
              size='small'
              value={tagSelectionTxt}
              onChange={(e) => {
                let newVal = e.target.value.toUpperCase()
                if (!/^[A-Z0-9_\-,|\(\)]*$/.test(newVal)) {
                  console.log('here');
                  return;
                }
                setTagSelectionTxt(newVal)
              }}
            />
          </Box>
        </Grid>
        <Grid 
          container 
          width={buttonWidth}
          gap={"8px"}
        >
          <Grid item xs>
            <DownloadButton invoices={invoices} />
          </Grid>
          <Grid item xs>
            <SendButton invoices={invoices} />
          </Grid>
          <Grid item xs>
            <DeleteButton invoices={invoices} setInvoices={setInvoices}/>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

function Invoice({
    invoice,
    i,
    invoices,
    setInvoices
  } : {
    invoice: EInvoiceItem, 
    i: number, 
    invoices: EInvoiceItem[], 
    setInvoices: Function
  }) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  async function getPDF() {
    const xmlData = await getXmlData(
      user!.username,
      user!.password,
      invoice.name
    );

    // console.log(xmlData);
    const link = await getPdfLink(
      user!.username,
      user!.password,
      xmlData
    );

    setTimeout(() => window.open(link), 100);
  }

  return (
    <>
      <Grid 
        container
        wrap="nowrap"
        width={"100%"}
        paddingLeft={2}
        paddingRight={2}
        borderBottom={"1px solid grey"}
      >
        <Box width={"50%"} overflow={"hidden"}>
          <FormControlLabel
            control={
              <Checkbox
                checked={invoice.checked}
                onChange={(e) => {
                  const invoices_ = [...invoices];
                  // get the invoice which has that name
                  invoices_[i].checked = e.target.checked;
                  setInvoices(invoices_);
                }}
              />
            }
            label={invoice.name} // Set the label of the checkbox to be the name of the invoice
            labelPlacement="end" // Align the label to the start of the checkbox
          />
        </Box>

        <Grid 
          container
          justifyContent={"flex-end"}
          width={"100%"}
          alignItems={"center"}
          wrap="nowrap"
          gap={1}
        >
          <Box 
            sx={{
              width: '100%',
              display: 'flex', 
              padding: '0.25em', 
              borderRadius: '5px',
              gap: '5px'
            }}
          >
            {
              invoice.tags.map((tag) => 
                <Chip 
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: '#7B54E8',
                    color: "white"
                  }}
                />
              )
            }
          </Box>
          <ManageTagButton invoices={invoices} setInvoices={setInvoices} index={i}/>
          <Tooltip title="View eInvoice">
            <IconButton 
              aria-label="View"
              onClick={() => {
                window.open(`/user/view-invoice/${invoice.name}`);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {user!.accountType !== 'Free' ? (
              <Tooltip title="Generate PDF">
                <IconButton
                  aria-label="PDF"
                  onClick={getPDF}
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Upgrade to Premium to generate PDF">
                <span>
                  <IconButton
                    aria-label="PDF"
                    disabled
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )
          }
        </Grid>
      </Grid>
    </>
  )
}

function Invoices({invoices, setInvoices}: {invoices: EInvoiceItem[], setInvoices: Function}) {
  const [selectAll, setSelectAll] = useState(false);
  const shownInvoices = invoices.filter(invoice => invoice.shown)
  return (
    <>
      <Grid
        item
        display={"flex"}
        flexDirection={"column"}
        padding={"20px"}
        paddingTop={1}
        width={"100%"}
        height={"100%"}
        overflow={"auto"}
        sx={{
          bgcolor: "#F1E8FF",
        }}
      >
        <Grid 
          container 
          wrap="nowrap"
        >
          <Box 
            width={"100%"}
            paddingLeft={2}
            paddingRight={2}
            borderBottom={"1px solid black"}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectAll}
                  onChange={(e) => {
                    setSelectAll(e.target.checked);
                    shownInvoices.map((invoice) => invoice.checked = !selectAll)
                  }}
                />
              }
              label={"Name"} // Set the label of the checkbox to be the name of the invoice
            />
          </Box>
        </Grid>


        {
          shownInvoices.map((invoice) => (
            <Invoice key={invoice.id} invoice={invoice} i={invoice.index} invoices={invoices} setInvoices={setInvoices}/>
          ))
        }
      </Grid>
    </>
  );
}

function shouldShowInvoice(invoice: EInvoiceItem, tagSelectionTxt: string, search: string) {
  const res1 = evaluateString(invoice, tagSelectionTxt) == 'true'
  const res2 = RegExp(new RegExp(search, 'i')).test(invoice.name)
  return res1 && res2
}

export default function InvoicesBox() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [invoices, setInvoices] = useState<EInvoiceItem[]>([]);
  const [search, setSearch_] = useState("");
  const [tagSelectionTxt, setTagSelectionTxt_] = useState('')

  // set searchTxt and unchecks invoices which become invisible
  function setSearch(value: string) {
    const invoicesNew = [...invoices]
    for (let invoice of invoicesNew) {
      invoice.shown = shouldShowInvoice(invoice, tagSelectionTxt, value)
      invoice.checked = false
    }
    setInvoices(invoicesNew)
    setSearch_(value)
  }

  // set tagSelectionTxt and check
  function setTagSelectionTxt(value: string) {
    const invoicesNew = [...invoices]
    for (let invoice of invoicesNew) {
      invoice.shown = shouldShowInvoice(invoice, value, search)
      invoice.checked = false
    }
    setInvoices(invoicesNew)
    setTagSelectionTxt_(value)
  }

  useEffect(() => {
    console.log(user?.username, user?.password);
    getInvoicesBelongingTo(user!.username, user!.password).then((invoices) =>
      setInvoices(invoices)
    );
  }, []);

  return (
    <>
      <Grid
        container
        height={"100%"}
        alignContent={"flex-start"}
        alignItems={"stretch"}
        overflow={"clip"}
        gap={"8px"}
      >
        <Header invoices={invoices}/>
        <Buttons 
          search={search} 
          setSearch={setSearch} 
          invoices={invoices} 
          setInvoices={setInvoices}
          tagSelectionTxt={tagSelectionTxt}
          setTagSelectionTxt={setTagSelectionTxt}
        />
        <Invoices
          invoices={invoices}
          setInvoices={setInvoices}
          />
      </Grid>
    </>
  );
}