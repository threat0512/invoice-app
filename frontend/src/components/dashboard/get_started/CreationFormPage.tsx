import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContextProvider";
import { CreationFormData, InvoiceItem, sampleData } from "./formTypes";
import {
  Button,
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { createInvoice } from "../../../service/service";
import LogoIcon from "../../LogoIcon";
import { PrettyBox } from "../../PrettyBox";

const newItem = {
  ID: "",
  UnitCode: "",
  UnitPrice: "",
  InvoicedQuantity: "",
  ItemName: "",
};

function NumberField({
  label,
  textLabel,
  value,
  setterFn,
}: {
  label: string;
  textLabel: string;
  value: string | undefined;
  setterFn: (v: string) => void;
}) {
  const value_ = value ? value : "";
  return (
    <>
      <Typography variant="body1" fontWeight="bold">
        {label}
      </Typography>
      <TextField
        fullWidth
        label={textLabel}
        type='number'
        value={value_}
        onChange={(e) => {
          let newNum = Number(e.target.value);
          if (newNum <= 0) return;
          setterFn(e.target.value)
        }}
        sx={{ mt: 2, mb: 2 }}
      ></TextField>
    </>
  );
}

function StringField({
  label,
  textLabel,
  value,
  setterFn,
}: {
  label: string;
  textLabel: string;
  value: string | undefined;
  setterFn: (v: string) => void;
}) {
  const value_ = value ? value : "";
  return (
    <>
      <Typography variant="body1" fontWeight="bold">
        {label}
      </Typography>
      <TextField
        fullWidth
        label={textLabel}
        value={value_}
        onChange={(e) => setterFn(e.target.value)}
        sx={{ mt: 2, mb: 2 }}
      ></TextField>
    </>
  );
}

function MyDateField({
  label,
  textLabel,
  value,
  setterFn,
}: {
  label: string;
  textLabel: string;
  value: string | undefined;
  setterFn: (v: string) => void;
}) {
  const value_ = value ? value : "";
  return (
    <>
      <Typography variant="body1" fontWeight="bold">
        {label}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateField
          label={textLabel}
          value={value_ ? dayjs(value_) : null}
          onChange={(newValue) => {
            newValue != null &&
              newValue.isValid() &&
              setterFn(newValue.format("YYYY-MM-DD"));
          }}
          sx={{ mt: 2, mb: 2 }}
          fullWidth
        ></DateField>
      </LocalizationProvider>
    </>
  );
}

function MultiSelect({
  label,
  textLabel,
  value,
  setterFn,
}: {
  label: string;
  textLabel: string;
  value: string | undefined;
  setterFn: (v: string) => void;
}) {
  return (
    <>
      <Typography variant="body1" fontWeight="bold">
        {label}
      </Typography>
      <Select
        value={value}
        label={textLabel}
        onChange={(e) => setterFn(e.target.value)}
        sx={{ mt: 2, mb: 2 }}
      >
        <MenuItem value={"AU"}>AU</MenuItem>
        <MenuItem value={"NZ"}>NZ</MenuItem>
      </Select>
    </>
  );
}

function GeneralDetails({ formData, setFormData } : { formData: CreationFormData, setFormData: React.Dispatch<React.SetStateAction<CreationFormData>>}) {
  return (
    <>
      <Typography variant="h4" color={"#7B54E8"} >
        General Details
      </Typography>

      <br/>

      <StringField
        label="Buyer reference"
        textLabel="ORDER123"
        value={formData["BuyerReference"]!}
        setterFn={(v: string) =>
          setFormData({ ...formData, BuyerReference: v })
        }
      ></StringField>

      <StringField
        label="Invoice ID"
        textLabel="INV_01"
        value={formData["InvoiceID"]!}
        setterFn={(v: string) => setFormData({ ...formData, InvoiceID: v })}
      ></StringField>

      <MyDateField
        label="Issue date"
        textLabel=""
        value={formData["IssueDate"]!}
        setterFn={(v: string) => setFormData({ ...formData, IssueDate: v })}
      ></MyDateField>

      <MyDateField
        label="Due date"
        textLabel=""
        value={formData["DueDate"]!}
        setterFn={(v: string) => setFormData({ ...formData, DueDate: v })}
      ></MyDateField>
    </>
  );
}

function PartyDetails({
  formData,
  setFormData,
  seller,
}: {
  formData: CreationFormData;
  setFormData: Function;
  seller: boolean;
}) {
  const title = seller ? "Seller's details" : "Buyer's details"
  const prefix = seller ? "AccountingSupplierParty" : "AccountingCustomerParty";
  const companyIDPlaceholder = formData[`${prefix}Country`] == 'AU' ? '47555222000' : '9429040298443'

  return (
    <>
      <Grid
        container
        direction={"column"}
        padding={2}
      >
        <Typography variant="h4" color="#7B54E8" >
          {title}
        </Typography>
        <br />
        <Typography variant="h5" component="h5" align="left" gutterBottom>
          Business Details
        </Typography>
        <StringField
          label="Business name"
          textLabel="business name"
          value={formData[`${prefix}PartyName`]!}
          setterFn={(v: string) => {
            let obj = { ...formData };
            obj[`${prefix}PartyName`] = v;
            setFormData(obj);
          }}
        ></StringField>
        <StringField
          label="Registration name"
          textLabel="official business name"
          value={formData[`${prefix}RegistrationName`]!}
          setterFn={(v: string) => {
            let obj = { ...formData };
            obj[`${prefix}RegistrationName`] = v;
            setFormData(obj);
          }}
        ></StringField>
        <MultiSelect
          label="Country"
          textLabel=""
          value={formData[`${prefix}Country`]!}
          setterFn={(v: string) => {
            let obj = { ...formData };
            obj[`${prefix}Country`] = v as any;
            setFormData(obj);
          }}
        ></MultiSelect>

        <StringField
          label="Company ID"
          textLabel={companyIDPlaceholder}
          value={formData[`${prefix}CompanyID`]!}
          setterFn={(v: string) => {
            let obj = { ...formData };
            obj[`${prefix}CompanyID`] = v;
            setFormData(obj);
          }}
        >
        </StringField>
        <Typography variant="h5" component="h5" align="left" gutterBottom>
          Address
        </Typography>
        <StringField
          label="Street name line 1"
          textLabel="1 low street"
          value={formData[`${prefix}StreetName`]!}
          setterFn={(v: string) => {
            let obj = { ...formData };
            obj[`${prefix}StreetName`] = v;
            setFormData(obj);
          }}
        >
        </StringField>

        <StringField
          label="Street name line 2"
          textLabel="..."
          value={formData[`${prefix}AdditionalStreetName`]!}
          setterFn={(v: string) => {
            let obj = { ...formData };
            obj[`${prefix}AdditionalStreetName`] = v;
            setFormData(obj);
          }}
        >
        </StringField>

        <StringField
          label="City"
          textLabel="Sydney"
          value={formData[`${prefix}CityName`]!}
          setterFn={(v: string) => {
            let obj = { ...formData };
            obj[`${prefix}CityName`] = v;
            setFormData(obj);
          }}
        >
        </StringField>

        <StringField
          label="Postal code"
          textLabel="2033"
          value={formData[`${prefix}PostalZone`]!}
          setterFn={(v: string) => {
            let obj = { ...formData };
            obj[`${prefix}PostalZone`] = v;
            setFormData(obj);
          }}
        >
        </StringField>
      </Grid>
    </>
  );
}

const validateFormData = (formData: CreationFormData) => {
  const fields = [
    'BuyerReference',
    'InvoiceID',
    'IssueDate',
    'DueDate',

    'AccountingSupplierPartyPartyName',
    'AccountingSupplierPartyStreetName',
    'AccountingSupplierPartyAdditionalStreetName',
    'AccountingSupplierPartyCityName',
    'AccountingSupplierPartyPostalZone',
    'AccountingSupplierPartyCountry',
    'AccountingSupplierPartyRegistrationName',
    'AccountingSupplierPartyCompanyID',

    'AccountingCustomerPartyPartyName',
    'AccountingCustomerPartyStreetName',
    'AccountingCustomerPartyAdditionalStreetName',
    'AccountingCustomerPartyCityName',
    'AccountingCustomerPartyPostalZone',
    'AccountingCustomerPartyCountry',
    'AccountingCustomerPartyRegistrationName',
    'AccountingCustomerPartyCompanyID',
  ]

  for (const field of fields) {
    if (! (formData as any)[field]) {
      console.log(field);
      
      window.alert('You have not filled in one or more fields');
      return;
    }

    // check supplier companyID
    if (formData.AccountingSupplierPartyCountry == 'AU') {
      if (! /^[0-9]{11}$/.test(formData.AccountingSupplierPartyCompanyID!)) {
        window.alert('supplier companyID is not a valid ABN (must be 11 digits)');
        return;
      }
    } else {
      if (! /^[0-9]{13}$/.test(formData.AccountingSupplierPartyCompanyID!)) {
        window.alert('supplier companyID is not a valid NZBN (must be 13 digits)');
        return;
      }
    }

    // check customer companyID
    if (formData.AccountingCustomerPartyCountry == 'AU') {
      if (! /^[0-9]{11}$/.test(formData.AccountingCustomerPartyCompanyID!)) {
        window.alert('customer companyID is not a valid ABN (must be 11 digits)');
        return;
      }
    } else {
      if (! /^[0-9]{13}$/.test(formData.AccountingCustomerPartyCompanyID!)) {
        window.alert('customer companyID is not a valid NZBN (must be 13 digits)');
        return;
      }
    }
  }

  for (let item of formData.InvoiceLines) {
    for (let field in item) {
      if (!(item as any)[field]) {
        window.alert('you have not filled in one or more fields in one of the items')
        return
      }
    }

    if (!/^[0-9]+$/.test(item.InvoicedQuantity)) {
      window.alert('invalid value for quantity was found in one of the items')
      return
    }

    if (!/^[0-9]+\.[0-9]{2}$/.test(item.UnitPrice)) {
      window.alert('make sure that all unitPrices for all items are given strictly as a decimal to 2dp. Note: 0 is 0.00.')
      return
    }
  }

  console.log(formData);
  return true;
}

export default function CreationFormPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const user = authContext.currentUser;
  const [formData, setFormData] = useState<CreationFormData>({
    AccountingSupplierPartyCountry: "AU",
    AccountingCustomerPartyCountry: "AU",
    InvoiceLines: [{ ...newItem }],
  });

  const [numItems, setNumItems] = useState(1)
  let itemInputs = [];

  const setItem = (attr: string, i: number, data: string) => {
    let newObj = { ...formData };
    (newObj.InvoiceLines[i] as any)[attr] = data;
    setFormData(newObj)
  }

  for (let i = 0; i < numItems; i++) {
    const input = (
      <div key={i}>
        <Typography variant="h5" component="h5" align="left" gutterBottom sx={{
          border: '3px solid grey',
          borderRadius: '0.5em',
          padding: '0.25em',
          background: '#eeeeee'

        }}>
          Item type {i + 1}
        </Typography>
        <StringField
          label="Item ID"
          textLabel={(i + 1).toString()}
          value={formData.InvoiceLines[i].ID}
          setterFn={(v: string) => setItem("ID", i, v)}
          >
        </StringField>
        <StringField
          label="Name"
          textLabel='Gold'
          value={formData.InvoiceLines[i].ItemName}
          setterFn={(v: string) => setItem("ItemName", i, v)}
          >
        </StringField>
        <StringField
          label="Unit code"
          textLabel='KGM'
          value={formData.InvoiceLines[i].UnitCode}
          setterFn={(v: string) => setItem("UnitCode", i, v)}
          >
        </StringField>
        <StringField
          label="Unit price"
          textLabel='10.00'
          value={formData.InvoiceLines[i].UnitPrice}
          setterFn={(v: string) => setItem("UnitPrice", i, v)}
          >
        </StringField>
        <StringField
          label="Quantity"
          textLabel='3'
          value={formData.InvoiceLines[i].InvoicedQuantity}
          setterFn={(v: string) => setItem("InvoicedQuantity", i, v)}
          >
        </StringField>
      </div>
    )
    itemInputs.push(input)
  }


  return (
    <>
      <Grid
        container
        direction={"column"}
        justifyContent={"center"}
        alignItems={"flex-start"}
        height={"auto"}
        width={"100%"}
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
          <Grid container wrap="nowrap" alignItems={"center"} width={"50%"} gap={1}>
            <LogoIcon nav="/user" />
            <Typography 
              variant="h5" 
              fontWeight={"bold"}
              color={"white"}
            >
              Creation
            </Typography>
            <button onClick={() => {setFormData(sampleData); setNumItems(2)}}>Sample data</button>
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
          height={"100%"}
          padding={"20px"}
          paddingTop={"0"}
        >
          <PrettyBox
            width="100%"
            height="auto"
            colour="#060C2A" 
          >
              <GeneralDetails 
                formData={formData} 
                setFormData={setFormData} 
              />
              <br />
              <Divider />

              <Grid
                container
                direction={"row"}
                wrap="nowrap"
              >
                <PartyDetails
                  formData={formData}
                  setFormData={setFormData}
                  seller={true}
                />
                <Divider orientation="vertical" flexItem />
                <PartyDetails
                  formData={formData}
                  setFormData={setFormData}
                  seller={false}
                />
              </Grid>
              <Divider />

              <br />
              <Typography variant="h4" color={"#7B54E8"}>
                Invoiced items
              </Typography>
              <NumberField
                label={"Number of items"}
                textLabel={"0"}
                value={numItems.toString()}
                setterFn={(v) => {
                  let newNumItems = Number(v)
                  setNumItems(newNumItems)
                  let newLines: InvoiceItem[] = [];
                  for (let i = 0; i < newNumItems; i++) {
                    if (i >= formData.InvoiceLines.length) {
                      newLines.push({...newItem})
                    } else {
                      newLines.push({...formData.InvoiceLines[i]})
                    }
                  }
                  setFormData({...formData, InvoiceLines: newLines})
                }}
              ></NumberField>
              {itemInputs}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                onClick={async() => {
                  if (!validateFormData(formData)) return;
                  const xmlData = await createInvoice(user?.username!, user?.password!, formData);
                  console.log(xmlData)
                  const blob = new Blob([xmlData], {type: 'application/xml'});
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a')
                  link.href = url;
                  link.download = formData.InvoiceID!;
                  document.body.appendChild(link)
                  link.click();
                  document.body.removeChild(link)
                  URL.revokeObjectURL(url)
                  navigate('/user/upload')
                }}
              >
                Submit Form
              </Button>
          </PrettyBox>
        </Grid>
      </Grid>
    </>
  );
}
