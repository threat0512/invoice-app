import axios from 'axios'
import { xmlData } from './common.js';


const RENDERING_ACCOUNT = {
  email: 'e@gmail.com',
  password: 'Password123'
}

const MAX_TRIES = 3
let TOKEN = '6978bdddcc3858a6744a092e3739f25a9d2fb7f95e8530d64313f2d2b2f76fe8'

// sample pdf: https://billtime.io/storage/invoice_12345554_en.660356e9567c8.pdf

function getFormData(xmlData) {
  const formData = new FormData();
  const blob = new Blob([xmlData], {type: 'text/xml'})
  formData.append('file', blob, 'invoice.xml')
  formData.append('outputType', 'PDF')
  formData.append('language', 'en')
  formData.append('token', TOKEN)
  return formData
}

// sample response:
// {
//     PDFURL: https://billtime.io/storage/invoice_12345554_en.660356e9567c8.pdf,
//     UID: 2
// }
export async function callRenderingAPIPDF(xmlData) {
  let numTries = 0

  while (numTries < MAX_TRIES) {
    const formData = getFormData(xmlData)
    // console.log(formData);
    try {
      const res = await axios.post('http://rendering.ap-southeast-2.elasticbeanstalk.com/render', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return res.data;
    } catch (err) {
      console.log(err.response.data)
      console.log('refreshing token')
      const res = await axios.post('http://rendering.ap-southeast-2.elasticbeanstalk.com/user/login', RENDERING_ACCOUNT)
      TOKEN = res.data.token;
      console.log('token:', TOKEN);
    }
    numTries++;
  }
  return {PDFURL: 'mockUID', UID: 'mockUID'}
}

// let res = callRenderingAPIPDF(xmlData).then(res => {
//   console.log(res)
// })

// const res = await axios.post('http://rendering.ap-southeast-2.elasticbeanstalk.com/render', {
//   email: 'd@gmail.com',
//   password: 'Password123',
//   nameFirst: 'a',
//   nameLast: 'b'
// })
// console.log(res.data)