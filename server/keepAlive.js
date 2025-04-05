import axios from 'axios'

setInterval(() => {
  axios.get('https://invoice-validation-deployment.onrender.com').then(res => {
    console.log(res.data)
  })
}, 60000)
