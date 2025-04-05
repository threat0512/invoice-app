import axios from 'axios'

let TOKEN = '123'
const VALIDATION_ACCOUNT = {
  username: '3000return-frontend',
  password: 'frontendPassword123'
}

const MAX_TRIES = 3
const DEPLOY_URL = "https://invoice-validation-deployment.onrender.com"
const LOCAL_URL = "http://localhost:8080"

export async function callValidationAPIJSON(xmlData) {
  let numTries = 0;
  while (numTries < MAX_TRIES) {
    try {
      const res = await axios.post(`${DEPLOY_URL}/api/validate/json`, xmlData, {
        headers: {
          'Content-Type': 'application/xml',
          'Authorization': TOKEN
        }
      })
      return res.data;
    } catch (err) {
      console.log(err.response.data);
      console.log("refreshing token")
      // log in again
      const res = await axios.post(`${DEPLOY_URL}/auth/login`, VALIDATION_ACCOUNT)
      const resString = res.data
      const regex = /"([^"]+)"/
      const newToken = resString.match(regex)[1]
      TOKEN = newToken
    }
    numTries++;
  }
  return 'max tries exceeded'
}


