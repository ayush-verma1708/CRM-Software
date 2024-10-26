// importData.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import Record from '../models/records.js'; // Ensure this path matches the location of your model

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Load the Excel file
const workbook = xlsx.readFile('Data_sorting.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert the sheet to JSON format, setting blank cells to `null`
const data = xlsx.utils.sheet_to_json(worksheet, { defval: null });
// Convert the sheet to JSON format, setting blank cells to `null`
// const data = xlsx.utils.sheet_to_json(worksheet, { defval: null });
console.log('Data being imported:', data); // Debugging output

// Function to import data to MongoDB
const importData = async () => {
  try {
    await Record.deleteMany(); // Optional: Clear existing data if needed
    await Record.insertMany(data);
    console.log('Data imported successfully');
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Execute the import function
importData();

// const xlsx = require('xlsx');

// // Load the Excel file
// const workbook = xlsx.readFile('Data_sorting.xlsx');

// // Select the first sheet
// const sheetName = workbook.SheetNames[0];
// const worksheet = workbook.Sheets[sheetName];

// // Get all rows with the first row as an array of headers
// const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

// // Extract the headers (first row of the data)
// const headers = data[0]; // `data[0]` contains the column headers
// const count = 0;

// console.log('Column Headers:', headers);

// // const xlsx = require('xlsx');

// // // Load the Excel file
// // const workbook = xlsx.readFile('Data_sorting.xlsx');

// // // Select the first sheet
// // const sheetName = workbook.SheetNames[0];
// // const worksheet = workbook.Sheets[sheetName];

// // // Convert the sheet to JSON and include all columns
// // const data = xlsx.utils.sheet_to_json(worksheet, {
// //   header: 1, // Read each row as an array, so all columns (even empty) are included
// //   defval: null, // Sets blank cells to `null`
// //   blankrows: false, // Ignore completely blank rows
// // });

// // // Print all data, including empty columns, to the console
// // console.log(data);

// // // const xlsx = require('xlsx');

// // // // Load the original Excel file
// // // const workbook = xlsx.readFile('Data_sorting.xlsx');

// // // // Select the first sheet
// // // const sheetName = workbook.SheetNames[0];
// // // const worksheet = workbook.Sheets[sheetName];

// // // // Convert the sheet to JSON and replace blank spaces with null
// // // const data = xlsx.utils.sheet_to_json(worksheet, {
// // //   defval: null, // This option sets all blank cells to `null`
// // // });

// // // // Convert JSON data back to a worksheet
// // // const newWorksheet = xlsx.utils.json_to_sheet(data);

// // // // Create a new workbook and append the modified worksheet
// // // const newWorkbook = xlsx.utils.book_new();
// // // xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

// // // // Write the new workbook to an Excel file
// // // xlsx.writeFile(newWorkbook, 'Data_with_nulls.xlsx');

// // // console.log(
// // //   'New Excel file "Data_with_nulls.xlsx" created with blank spaces replaced by null.'
// // // );

// Column Headers: [
// "I'm Model/Photographer/MUA",
// 'Magazine',
// 'Currency',
// 'Amount',
// 'Status',
// 'Payment Type',
// 'Payment Method',
// 'First Name',
// 'Last Name',
// 'Country Code',
// 'Email',
// 'Phone',
// 'Address',
// 'State',
// 'ZIP Code',
// 'Phone',
// 'Order ID',
// 'Product',
// 'Quantity',
// 'Discount',
// 'Shipping',
// <1 empty item>,
// 'I Am model/photographer ',
// 'MODEL: Stage Name',
// 'Model Insta Link 1',
// 'Email Address',
// 'Photographer Insta Link 1',
// "MUA's : Stage Name",
// 'Mua Insta Link-',
// 'Phone number',
// 'Email Address',
// 'Country',
// 'Date of Birth'
// ]
