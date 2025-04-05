import { configDotenv } from 'dotenv'
import mongoose from 'mongoose'

configDotenv()
const uri = process.env.MONGODB_URI
mongoose.set("strictQuery", false);
mongoose.connect(uri)
  .then(() => { console.log('connected'); })

const Schema = mongoose.Schema

const AccountSchema = new Schema({
  username: String,
  email: String,
  passwordEncrypted: String,
  savedTags: [String],
  accountType: String
})

const AccountModel = mongoose.model("Account", AccountSchema)
export default AccountModel

