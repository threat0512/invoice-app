import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bcrypt from 'bcryptjs'
import Account from './models/account.js'
import EInvoice from './models/einvoice.js'
import { callValidationAPIJSON } from './external-apis/validation.js'
import { callRenderingAPIPDF } from './external-apis/rendering.js'
import axios from 'axios'
import 'express-async-errors'
import { convertDataToInvoice } from './external-apis/creation.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(__dirname)

// app
const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan())
app.use(express.text({ type: 'application/xml' }))



// bcrypt
const salt = bcrypt.genSaltSync(10);

function hashPassword(password) {
  return bcrypt.hashSync(password, salt)
}

function verifyHash(password, hash) {
  return bcrypt.compareSync(password, hash)
}

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log('app listening on port', PORT);
})

/**
 * return the account on success / null on faliure
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
async function loginUser(username, password) {
  console.log('loginUser');
  const accounts = await Account.find({
    username: username
  })

  if (accounts.length == 0) {
    console.log('failed login');
    return null;
  }

  const account = accounts[0]
  if (!verifyHash(password, account.passwordEncrypted)) {
    console.log('failed login');
    return null;
  }
  return account;
}
// return object:
//   _id
//   username
//   email
//   passwordEncrypted
app.post('/api/newAccount', async (req, res) => {
  const body = req.body;
  const usernameNew = body.username
  const passwordNew = body.password
  const emailNew = body.email
  const accountTypeNew = body.accountType
  console.log("inside index, ", accountTypeNew)

  const existing = await Account.find({
    username: usernameNew
  })

  if (existing.length > 0) {
    return res.status(403).json({ error: 'account with username ' + usernameNew + ' already exists' })
  }

  const newAccount = new Account({
    username: usernameNew,
    email: emailNew,
    passwordEncrypted: hashPassword(passwordNew),
    accountType: accountTypeNew
  })


  newAccount.save().then(account => {
    res.json(account)
  })
})

// returnObject:
//    _id
//    username
//    email
//    passwordEncrypted
app.get('/api/login', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password);
  if (account) {
    return res.json(account);
  } else {
    return res.status(403).json({ error: 'invalid username or password' })
  }
})

app.put('/api/changePassword', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const newPassword = req.body.newPassword;

  const users = await Account.find({
    username: username
  })

  if (users.length == 0) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const user = users[0]
  user.passwordEncrypted = hashPassword(newPassword)
  await user.save();
  res.json(user)
})

app.put('/api/changeEmail', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const newEmail = req.body.newEmail;

  const users = await Account.find({
    username: username
  })

  if (users.length == 0) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const user = users[0]
  user.email = newEmail
  await user.save();
  res.json(user)
})

app.delete('/api/deleteAccount', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  // delete all invoices belonging to account
  await EInvoice.deleteMany({
    belongsTo: username
  })

  // delete account
  await Account.deleteOne({
    username: username
  })

  res.json('OK')
})



app.post('/api/validate', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  console.log(username, password)

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const xmlData = req.body
  const data = await callValidationAPIJSON(xmlData)
  return res.json(data)
})




// //
// // each item has
// //   -username
// //   -ourLink
// //   -billTimeUrl
// const tempLinks = []


// // update this
// let linkGen = 0;
// function generateLink() {
//   linkGen++;
//   return linkGen.toString()
// }

// header
//    username
//    password
// body
//    xmldata
// returns
// sample response:
// {
//     PDFURL: https://billtime.io/storage/invoice_12345554_en.660356e9567c8.pdf,
//     UID: 2
// }
app.post('/api/render', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  console.log(username, password)

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const xmlData = req.body
  const data = await callRenderingAPIPDF(xmlData)
  console.log('here');
  console.log(data);

  return res.json(data)
})


// })

/**
 * checks that invName is unique
 * assume that belongsTo points to a correct username
 * @param {*} belongsTo 
 * @param {*} invName 
 * @returns 
 */
async function checkName(belongsTo, invName) {
  const foundInvoices = await EInvoice.find(
    {
      belongsTo: belongsTo,
      name: invName
    }
  )
  if (foundInvoices.length > 0) {
    return false;
  }
  return true;
}
// assumes that the invoice being added is already valididated
// headers:
//   username
//   password
// query
//   name
// body
//   <xml data>
// 
// an invoice must have an "name" field
// for a certain user, the all invoices must be unique
app.post('/api/addInvoice', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }
  const name = req.query.name
  if (!name) {
    return res.status(400).json({ error: 'must include name field in params' })
  }

  const isUniqueName = await checkName(username, name);
  console.log(username, name);
  console.log(isUniqueName)
  if (!isUniqueName) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const xmlData = req.body;
  const newInvoice = new EInvoice({
    belongsTo: username,
    name: name,
    data: xmlData,
    tags: []
  })

  let invoice = newInvoice.save();
  res.json(invoice)
})

// user must be logged in to use this route
// headers:
//   username
//   password
app.get('/api/getInvoicesBelongingTo', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const invoices = await EInvoice.find({
    belongsTo: username
  })

  // console.log(invoices[0].data)
  // console.log(invoices);

  res.json(invoices)
})


// delete invoice given a name
// headers:
//   username
//   password
// query:
//   name
app.delete('/api/deleteInvoice', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const name = req.query.name;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const deleted = EInvoice.deleteOne(
    { name: name }
  )
  res.json(deleted)
})

// delete a bunch of invoices from the database
// headers:
//   username
//   password
// body:
//   names: array[string]
app.delete('/api/deleteInvoices', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const names = req.body.names;

  console.log(username, password);

  console.log(names);

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  try {
    const result = await EInvoice.deleteMany(
      {
        name: { $in: names }
      }
    )
    res.json({ numDeleted: result.deletedCount })
  } catch (err) {
    res.status(400).status(err.message)
  }
})


// get names of invoices belonging to certain person
// headers:
//   username
//   password
app.get('/api/getInvoiceNamesBelongingTo', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const invoices = await EInvoice.find({
    belongsTo: username
  }).select('name tags')

  console.log(invoices)

  res.json(invoices)
})

// sets the list of saved tags of a certain user to the new list
// headers:
//   username
//   password
// body:
//   newSavedTags
app.put('/api/setUserSavedtags', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const newSavedTags = req.body.newSavedTags
  account.savedTags = newSavedTags
  await account.save()
  res.json(account)
})

// add a list of tags to an invoice in one request
// headers:
//   username
//   password
// body:
//   invoiceName: string
//   tags: string[]
app.post('/api/addTagsToInvoice', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const invoiceName = req.body.invoiceName
  const tagsToAdd = req.body.tags

  const invoices = await EInvoice.find({
    belongsTo: username,
    name: invoiceName
  })

  const invoice = invoices[0]
  const newTags = [...invoice.tags]

  for (const tag of tagsToAdd) {
    if (!newTags.includes(tag)) {
      newTags.push(tag)
    }
  }

  invoice.tags = newTags;

  const invRet = await invoice.save()
  console.log(invRet)
  res.json(invRet.tags)
})

// delete a list of tags from an invoice in one request
// headers:
//   username
//   password
// body:
//   invoiceName: string[]
//   tags: string[]
app.post('/api/deleteTagsFromInvoice', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const invoiceName = req.body.invoiceName
  const tags = req.body.tags

  const invoices = await EInvoice.find({
    belongsTo: username,
    name: invoiceName
  })
  
  const invoice = invoices[0]
  invoice.tags = invoice.tags.filter(tag => tags.includes(tag))
  const invRet = await invoice.save()
  console.log(invRet)
  res.json(invRet.tags)
})

// set the list of tags to the one given
// headers:
//   username
//   password
// body:
//   invoiceName: string[]
//   tags: string[]
app.put('/api/setTagList', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const invoiceName = req.body.invoiceName
  const tags = req.body.tags

  const invoices = await EInvoice.find({
    belongsTo: username,
    name: invoiceName
  })
  
  const invoice = invoices[0]
  invoice.tags = tags
  const invRet = await invoice.save()
  console.log(invRet)
  res.json(invRet.tags)
})

// get data of certain invoice
// headers:
//   username
//   password
// query:
//   invoiceName
app.get('/api/getInvoiceDataByName', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const invoiceName = req.query.name;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const invoices = await EInvoice.find({
    belongsTo: username,
    name: invoiceName
  })

  if (invoices.length == 0) {
    return res.status(403).json({ error: 'your invoice couldn\'t be found' })
  }

  res.json(invoices[0].data)
})

// returns full data of all invoices in invoiceNames
// headers:
//   username
//   password
// body
//   invoiceNames: name of invoices
// return
//    list of invoices, each invoice has the form
//    _id, belongsTo, name, data
app.post('/api/getInvoicesByNames', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;


  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const invoiceNames = req.body.invoiceNames
  console.log(invoiceNames);

  const invoices = await EInvoice.find({
    belongsTo: username,
    name: { $in: invoiceNames }
  })

  if (invoices.length == 0) {
    return res.status(403).json({ error: 'your invoice couldn\'t be found' })
  }

  res.json(invoices)
})

// send invoice to destination emails
// headers:
//   username
//   password
// body
//   invoiceNames: invoice names
//   emails: list of emails
//   from: from field to appear in email
// return
//    list of invoices, each invoice has the form
//    _id, belongsTo, name, data
app.post('/api/sendInvoicesByNames', async (req, res) => {
  console.log("Hi")
  const username = req.headers.username;
  const password = req.headers.password;


  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const invoiceNames = req.body.invoiceNames
  const emails = req.body.emails
  const from = req.body.from
  console.log(invoiceNames);

  const invoices = await EInvoice.find({
    belongsTo: username,
    name: { $in: invoiceNames }
  })

  if (invoices.length == 0) {
    return res.status(403).json({ error: 'no invoices found' })
  }

  const content = invoices.map(invoice => {
    return {
      xmlString: invoice.data,
      filename: invoice.name
    }
  })

  const data = {
    type: 'multiplexml',
    from: from,
    recipients: emails,
    content: content
  }

  // console.log(data)

  const apiResponse = await axios.post('https://invoice-seng2021-24t1-eggs.vercel.app/send/multEmail', data)
  res.json(apiResponse.data)
})

app.post('/api/createInvoice', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;


  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const data = req.body;
  const xmlString = convertDataToInvoice(data);
  res.send(xmlString);
})

import JSZip from 'jszip';

app.post('/api/downloadInvoicesByNames', async (req, res) => {
  try {
    console.log("Hello?");
    const username = req.headers.username;
    const password = req.headers.password;

    const account = await loginUser(username, password);
    if (!account) {
      return res.status(403).json({ error: 'invalid username or password' });
    }

    const invoiceNames = req.body.invoiceNames;
    console.log(invoiceNames);

    const invoices = await EInvoice.find({
      belongsTo: username,
      name: { $in: invoiceNames }
    });

    if (invoices.length === 0) {
      console.log("SHOULD NOT APPEAR");
      return res.status(404).json({ error: 'no invoices found' }); // Changed status code to 404
    }

    if (invoices.length === 1) {
      // If only one invoice is selected, send it as the response without zipping
      const invoice = invoices[0];
      res.set({
        'Content-Type': 'application/xml', // Set Content-Type to application/xml for single XML file
        'Content-Disposition': `attachment; filename="${invoice.name}.xml"` // Set filename to the name of the invoice
      });
      res.send(invoice.data); // Send the XML content of the invoice
      return;
    }

    // If multiple invoices are selected, create a zip file
    const zip = new JSZip();
    invoices.forEach(invoice => {
      zip.file(`${invoice.name}.xml`, invoice.data); // Add each XML content as a file to the zip with original filename
    });

    // Generate the zip file asynchronously and send it as the response
    zip.generateAsync({ type: 'nodebuffer' }).then((content) => {
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="invoices.zip"'
      });
      res.send(content);
    }).catch((err) => {
      console.error('Error generating zip file:', err);
      res.status(500).json({ error: 'Failed to generate zip file' });
    });
  } catch (error) {
    console.error('Error downloading invoices:', error);
    res.status(500).json({ error: 'Failed to download invoices' });
  }
});

app.put('/api/updateAccountType', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password);
  if (!account) {
    return res.status(403).json({ error: 'invalid username or password' });
  }

  const newAccountType = req.body.newAccountType;

  const users = await Account.find({
    username: username
  })

  if (users.length == 0) {
    return res.status(403).json({ error: 'invalid username or password' })
  }

  const user = users[0]
  user.accountType = newAccountType;
  await user.save();
  res.json(user)
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})