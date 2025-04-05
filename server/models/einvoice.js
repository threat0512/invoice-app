import { configDotenv } from 'dotenv'
import mongoose from 'mongoose'

configDotenv()
const uri = process.env.MONGODB_URI
mongoose.set("strictQuery", false);
mongoose.connect(uri)
  .then(() => {console.log('connected');})

const Schema = mongoose.Schema

const EInvoiceSchema = new Schema({
  belongsTo: String, // username of account it belongs to
  name: String,
  data: String,
  tags: [String]
})

const EInvoiceModel = mongoose.model("EInvoice", EInvoiceSchema)
export default EInvoiceModel