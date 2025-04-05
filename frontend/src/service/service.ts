/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from 'axios'
import { EInvoiceItem, UserProfile } from '../data';
import { CreationFormData } from '../components/dashboard/get_started/formTypes';

export async function logInAndGetUser(username: string, password: string) {
  try {
    const res = await axios.get('/api/login', {
      headers: {
        username: username,
        password: password
      }
    })
    const acct = res.data

    const retUser: UserProfile = {
      id: acct._id,
      username: acct.username,
      email: acct.email,
      password: password,
      savedTags: acct.savedTags ? acct.savedTags : [],
      accountType: acct.accountType
    }

    return retUser

  } catch (err) {
    return null;
  }
}

export async function getInvoicesBelongingTo(username: string, password: string) {
  const res = await axios.get('/api/getInvoiceNamesBelongingTo', {
    headers: {
      username: username,
      password: password
    }
  })
  const einvoicesRaw = res.data as any[];
  const einvoices: EInvoiceItem[] = einvoicesRaw.map((invoice, i) => {
    return {
      id: invoice._id,
      name: invoice.name,
      checked: false,
      pdfGenMsg: 'generate pdf',
      tags: invoice.tags ? invoice.tags : [],
      index: i,
      shown: true
    }
  })
  return einvoices
}

export async function addTagsToInvoice(username: string, password: string, invoiceName: string, tags: string[]) {
  const res = await axios.post('/api/addTagsToInvoice',
    {
      invoiceName: invoiceName,
      tags: tags
    },
    {
      headers: {
        username: username,
        password: password
      }
    }
  )
  const retTags = res.data as string[]
  console.log(retTags)
  return retTags
}

export async function setTagListForInvoice(username: string, password: string, invoiceName: string, tags: string[]) {
  const res = await axios.put('/api/setTagList',
    {
      invoiceName: invoiceName,
      tags: tags
    },
    {
      headers: {
        username: username,
        password: password
      }
    }
  )
  const retTags = res.data as string[]
  console.log(retTags)
  return retTags
}

export async function setUserSavedTags(username: string, password: string, newSavedTags: string[]) {
  const res = await axios.put('/api/setUserSavedtags',
    {
      newSavedTags: newSavedTags
    },
    {
      headers: {
        username: username,
        password: password
      }
    }
  )

  const acc = res.data
  const retUser: UserProfile = {
    id: acc._id,
    username: acc.username,
    email: acc.email,
    password: password,
    savedTags: acc.savedTags ? acc.savedTags : [],
    accountType: acc.accountType
  }

  return retUser;
}


export async function deleteTagsFromInvoice(username: string, password: string, invoiceName: string, tags: string[]) {
  const res = await axios.post('/api/deleteTagsFromInvoice',
    {
      invoiceName: invoiceName,
      tags: tags
    },
    {
      headers: {
        username: username,
        password: password
      }
    }
  )
  const retTags = res.data as string[]
  return retTags
}

export async function validateFile(username: string, password: string, xmlFile: File) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(xmlFile)
    reader.onload = async (e) => {
      const xmlData = e.target?.result as string;
      const res = await axios.post('/api/validate', xmlData, {
        headers: {
          username: username,
          password: password,
          "Content-Type": 'application/xml'
        }
      })
      resolve(res.data)
    }
  })
}

export async function getPdfLink(username: string, password: string, xmlData: string) {
  try {
    const res = await axios.post('/api/render', xmlData, {
      headers: {
        username: username,
        password: password,
        "Content-Type": 'application/xml'
      }
    })
    console.log(res.data);
    return res.data.PDFURL
  } catch (err) {
    return null
  }
}

/**
 * give a list of invoiceNames and
 * get all invoices with name in invoiceNames
 * @param username 
 * @param password 
 * @param invoiceNames 
 * @returns 
 */
export async function getInvoicesByNames(username: string, password: string, invoiceNames: string[]) {
  try {
    const res = await axios.post('/api/getInvoicesByNames', { names: invoiceNames }, {
      headers: {
        username: username,
        password: password,
      }
    })
    return res.data;
  } catch (err) {
    return null
  }
}


/**
 * give a list of invoiceNames and emails
 * sends those invoices to those emails
 * @param username 
 * @param password 
 * @param invoiceNames 
 * @returns 
 */
export async function sendInvoicesByNames(username: string, password: string, invoiceNames: string[], emails: string[], from: string) {
  try {
    const res = await axios.post('/api/sendInvoicesByNames', {
      invoiceNames: invoiceNames,
      emails: emails,
      from: from
    }, {
      headers: {
        username: username,
        password: password,
      }
    })
    return res.data;
  } catch (err) {
    return { success: false }
  }
}

/**
 * get xml data of an invoice given it's name
 * @param username 
 * @param password 
 * @param filename 
 * @returns 
 */
export async function getXmlData(username: string, password: string, filename: string) {
  try {
    const res = await axios.get(`/api/getInvoiceDataByName?name=${filename}`, {
      headers: {
        username: username,
        password: password
      },
    })
    const xmlData = res.data
    return xmlData
  } catch (err) {
    console.log('here');

    return null;
  }
}

export async function registerUser(username: string, email: string, password: string, accountType: string) {
  try {
    const res = await axios.post('/api/newAccount', {
      username: username,
      email: email,
      password: password,
      accountType: accountType
    })
    const acct = res.data
    console.log("Inside axios: ", acct.accountType)

    const retUser: UserProfile = {
      id: acct._id,
      username: acct.username,
      password: password,
      email: acct.email,
      savedTags: acct.savedTags ? acct.savedTags : [],
      accountType: acct.accountType
    }
    return retUser
  } catch (err) {
    return null;
  }
}

export async function addInvoiceToUser(username: string, password: string, xmlFile: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(xmlFile)
    reader.onload = async (e) => {
      const xmlData = e.target?.result as string;

      try {
        await axios.post('/api/addInvoice', xmlData, {
          params: {
            name: xmlFile.name
          },
          headers: {
            username: username,
            password: password,
            "Content-Type": 'application/xml'
          }
        })

        resolve('ok')
      } catch (err) {
        reject((err! as AxiosError).response!.data)
      }
    }
  })
}


export async function deleteInvoicesFromUser(username: string, password: string, invoiceNames: string[]) {
  try {
    const res = await axios({
      method: 'delete',
      url: '/api/deleteInvoices',
      data: { names: invoiceNames },
      headers: {
        username: username,
        password: password
      }
    })

    console.log(res);


    const numDel = res.data.numDeleted
    return numDel
  } catch (err) {
    return null;
  }
}

export async function createInvoice(username: string, password: string, data: CreationFormData) {
  try {
    const res = await axios.post('/api/createInvoice', data, {
      headers: {
        username: username,
        password: password
      }
    })
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function changeEmail(username: string, password: string, newEmail: string) {
  try {
    const res = await axios.put('/api/changeEmail', { newEmail: newEmail }, {
      headers: {
        username: username,
        password: password
      }
    })
    const acc = res.data;
    console.log('service.ts')
    console.log(acc)

    const retUser: UserProfile = {
      id: acc._id,
      username: acc.username,
      email: acc.email,
      password: password,
      savedTags: acc.savedTags ? acc.savedTags : [],
      accountType: acc.accountType
    }

    return retUser;

  } catch (err) {
    return null;
  }
}

export async function changePassword(username: string, password: string, newPassword: string) {
  try {
    const res = await axios.put('/api/changePassword', { newPassword: newPassword }, {
      headers: {
        username: username,
        password: password
      }
    })
    const acc = res.data;

    const retUser: UserProfile = {
      id: acc._id,
      username: acc.username,
      email: acc.email,
      password: password,
      savedTags: acc.savedTags ? acc.savedTags : [],
      accountType: acc.accountType
    }
    return retUser;
  } catch (err) {
    return null;
  }
}

export async function deleteAccount(username: string, password: string) {
  try {
    const res = await axios.delete('/api/deleteAccount', {
      headers: {
        username: username,
        password: password
      }
    })
    return res.data
  } catch (err) {
    return null;
  }
}

export async function downloadInvoices(username: string, password: string, invoiceNames: string[]): Promise<void> {
  try {
    const response: AxiosResponse<Blob> = await axios.post('/api/downloadInvoicesByNames', {
      invoiceNames: invoiceNames
    }, {
      headers: {
        username: username,
        password: password,
      },
      responseType: 'blob'
    });

    const contentType = response.headers['content-type'] || '';
    const disposition = response.headers['content-disposition'];

    if (contentType.startsWith('application/zip')) {
      // Multiple files, handle zip download
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoices.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (contentType.startsWith('application/xml') && disposition) {
      // Single file, handle direct download
      const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = fileNameRegex.exec(disposition);
      const fileName = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : 'invoice.xml';
      const blob = new Blob([response.data], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('Unsupported content type:', contentType);
      // Handle unsupported content type appropriately
    }
  } catch (error) {
    console.error('Error downloading invoices:', error);
    // Handle error appropriately, e.g., display an error message to the user
  }
}

export async function updateAccountType(username: string, password: string, newAccountType: string) {
  try {
    const res = await axios.put('/api/updateAccountType', { newAccountType: newAccountType }, {
      headers: {
        username: username,
        password: password
      }
    });
    const acc = res.data;

    const retUser: UserProfile = {
      id: acc._id,
      username: acc.username,
      email: acc.email,
      password: password,
      savedTags: acc.savedTags,
      accountType: acc.accountType,
    }

    return retUser;

  } catch (err) {
    return null;
  }
}
