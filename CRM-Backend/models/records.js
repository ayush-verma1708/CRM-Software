// models/Record.js
import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    "I'm Model/Photographer/MUA": { type: String },
    Magazine: { type: String },
    Currency: { type: String },
    Amount: { type: Number },
    Status: { type: String },
    'Payment Type': { type: String },
    'Payment Method': { type: String },
    'First Name': { type: String },
    'Last Name': { type: String },
    'Country Code': { type: String },
    Email: { type: String },
    Phone: { type: String },
    Address: { type: String },
    State: { type: String },
    'ZIP Code': { type: String },
    'Order ID': { type: String },
    Product: { type: String },
    Quantity: { type: Number },
    Discount: { type: Number },
    Shipping: { type: Number },
    'I Am model/photographer': { type: String },
    'MODEL: Stage Name': { type: String },
    'Model Insta Link 1': { type: String },
    'Email Address': { type: String },
    'Photographer Insta Link 1': { type: String },
    "MUA's : Stage Name": { type: String },
    'Mua Insta Link-': { type: String },
    'Phone number': { type: String },
    'Email Address': { type: String },
    Country: { type: String },
    'Date of Birth': { type: Date },
    Notes: { type: String }, // New field for notes
  },
  { timestamps: true }
);

export default mongoose.model('Record', recordSchema);
