// importData.js
import xlsx from 'xlsx';
import User from '../models/userInfo.js';
import Record from '../models/Record.js';

// Read Excel file and parse data
export const importData = async (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const records = xlsx.utils.sheet_to_json(worksheet);

    // Separate data for User and Record models based on column names
    const userRecords = records.map((record) => ({
      Model_Type: record['Model_Type'],
      Stage_Name: record['Stage_Name'],
      Model_Insta_Link: record['Model_Insta_Link'],
      Email_Address: record['Email_Address'],
      Photographer_Insta_Link: record['Photographer_Insta_Link'],
      Mua_Stage_Name: record['Mua_Stage_Name'],
      Mua_Insta_link: record['Mua_Insta_link'],
      Phone_Number_2: record['Phone_Number_2'],
      Email_Address_2: record['Email_Address_2'],
      Country: record['Country'],
      Date_Of_Birth: record['Date_Of_Birth']
        ? new Date(record['Date_Of_Birth'])
        : null,
    }));

    const transactionRecords = records.map((record) => ({
      Magazine: record['Magazine'],
      Currency: record['Currency'],
      Amount: record['Amount'],
      Status: record['Status'],
      Payment_Type: record['Payment_Type'],
      Payment_Method: record['Payment_Method'],
      // First_Name: record['First_Name'],
      // Last_Name: record['Last_Name'],
      Full_Name: `${record['First_Name']} ${record['Last_Name']}`, // Combine First_Name and Last_Name

      Country_Code: record['Country_Code'],
      Email: record['Email'],
      Phone: record['Phone'],
      Address: record['Address'],
      State: record['State'],
      Zip_Code: record['Zip_Code'],
      Order_id: record['Order_id'],
      Product: record['Product'],
      Quantity: record['Quantity'],
      Discount: record['Discount'],
      Shipping: record['Shipping'],
    }));

    // Log the parsed data to inspect if values are populated
    console.log('User Records:', userRecords);
    console.log('Transaction Records:', transactionRecords);

    // Insert data into MongoDB
    await User.insertMany(userRecords);
    await Record.insertMany(transactionRecords);

    console.log(
      `Successfully imported ${userRecords.length} user records and ${transactionRecords.length} transaction records.`
    );
  } catch (error) {
    console.error('Error importing data:', error.message);
    throw error; // Re-throw error so the calling function can handle it
  }
};

// // importData.js
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import xlsx from 'xlsx';
// import User from '../models/userInfo.js';
// import Record from '../models/Record.js';

// dotenv.config();

// // Database connection function
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('Database connection failed:', error.message);
//     process.exit(1);
//   }
// };

// // Read Excel file and parse data
// const importData = async (filePath) => {
//   try {
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const records = xlsx.utils.sheet_to_json(worksheet);

//     // Separate data for User and Record models based on column names
//     const userRecords = records.map((record) => ({
//       Model_Type: record['Model_Type'],
//       Stage_Name: record['Stage_Name'],
//       Model_Insta_Link: record['Model_Insta_Link'],
//       Email_Address: record['Email_Address'],
//       Photographer_Insta_Link: record['Photographer_Insta_Link'],
//       Mua_Stage_Name: record['Mua_Stage_Name'],
//       Mua_Insta_link: record['Mua_Insta_link'],
//       Phone_Number_2: record['Phone_Number_2'],
//       Email_Address_2: record['Email_Address_2'],
//       Country: record['Country'],
//       Date_Of_Birth: record['Date_Of_Birth']
//         ? new Date(record['Date_Of_Birth'])
//         : null,
//     }));

//     const transactionRecords = records.map((record) => ({
//       Magazine: record['Magazine'],
//       Currency: record['Currency'],
//       Amount: record['Amount'],
//       Status: record['Status'],
//       Payment_Type: record['Payment_Type'],
//       Payment_Method: record['Payment_Method'],
//       First_Name: record['First_Name'],
//       Last_Name: record['Last_Name'],
//       Country_Code: record['Country_Code'],
//       Email: record['Email'],
//       Phone: record['Phone'],
//       Address: record['Address'],
//       State: record['State'],
//       Zip_Code: record['Zip_Code'],
//       Order_id: record['Order_id'],
//       Product: record['Product'],
//       Quantity: record['Quantity'],
//       Discount: record['Discount'],
//       Shipping: record['Shipping'],
//     }));

//     // Log the parsed data to inspect if values are populated
//     console.log('User Records:', userRecords);
//     console.log('Transaction Records:', transactionRecords);

//     // Insert data into MongoDB
//     await User.insertMany(userRecords);
//     await Record.insertMany(transactionRecords);

//     console.log(
//       `Successfully imported ${userRecords.length} user records and ${transactionRecords.length} transaction records.`
//     );
//   } catch (error) {
//     console.error('Error importing data:', error.message);
//   }
// };

// // Run the import script
// const filePath = 'Data_sorting.xlsx';
// connectDB().then(() => importData(filePath));
