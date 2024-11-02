import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Record from './models/records.js'; // Adjust the file extension
import Joi from 'joi';
import multer from 'multer';
import cors from 'cors'; // Import the cors package
import { importData } from './scripts/script.js'; // Update the path to where your import script is located

dotenv.config();

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save the file with its original name
  },
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Validation schema for records
const recordSchema = Joi.object({
  'First Name': Joi.string().required(),
  'Last Name': Joi.string().required(),
  Magazine: Joi.string().required(),
  Amount: Joi.number().required(),
  Email: Joi.string().email().required(),
  'Model Insta Link 1': Joi.string().uri().required(),
  LeadSource: Joi.string().optional(),
  Notes: Joi.string().optional(),
});

// Utility function to format records
const formatRecords = (records) => {
  return records.map((record) => ({
    id: record._id, // Include the _id field as id

    Name: `${record['First Name']} ${record['Last Name']}`,
    Magazine: record.Magazine,
    Amount: record.Amount,
    Instagram_link: record['Model Insta Link 1'],
    Email: record.Email,
    Lead_source: record.LeadSource || null,
    Notes: record.Notes || null,
  }));
};

app.get('/records', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || ''; // Get search term from query
  const minPrice = parseFloat(req.query.minPrice); // Get minimum price from query
  const maxPrice = parseFloat(req.query.maxPrice); // Get maximum price from query

  try {
    const skip = (page - 1) * limit;

    // Construct filter for search and price range
    const filter = {
      $or: [
        { 'First Name': { $regex: search, $options: 'i' } },
        { 'Last Name': { $regex: search, $options: 'i' } },
        { Magazine: { $regex: search, $options: 'i' } },
        { Email: { $regex: search, $options: 'i' } },
        { 'Model Insta Link 1': { $regex: search, $options: 'i' } },
      ],
    };

    // Add price range filter if specified
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      filter.Amount = { $gte: minPrice, $lte: maxPrice }; // Assuming 'Amount' is the field name in your database
    } else if (!isNaN(minPrice)) {
      filter.Amount = { $gte: minPrice }; // Only minimum price specified
    } else if (!isNaN(maxPrice)) {
      filter.Amount = { $lte: maxPrice }; // Only maximum price specified
    }

    const records = await Record.find(filter).skip(skip).limit(limit).lean();
    const totalRecords = await Record.countDocuments(filter);

    const response = {
      totalRecords,
      page,
      totalPages: Math.ceil(totalRecords / limit),
      records: formatRecords(records),
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: `Error retrieving records: ${err.message}` });
  }
});

// File upload route
app.post('/api/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Pass the uploaded file path to your import function
    const filePath = req.file.path;
    await importData(filePath); // Update importData function to accept the file path
    res.status(200).json({ message: 'Data imported successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error importing data', error: err.message });
  }
});

// Create a record (POST)
app.post('/records', async (req, res) => {
  try {
    const { error } = recordSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const record = new Record(req.body);
    const savedRecord = await record.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single record by ID (GET)
app.get('/records/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id).lean();
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/records/:id', async (req, res) => {
  console.log('Request body:', req.body); // Debugging

  try {
    // Validate input fields against schema
    const { error } = recordSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // $set updates only specified fields
      {
        new: true, // Return the updated document
        runValidators: true, // Apply schema validation
        lean: true, // Return a plain JavaScript object
      }
    );

    if (!updatedRecord) {
      console.log('Record not found with ID:', req.params.id);
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(updatedRecord);
  } catch (err) {
    console.error('Update error:', err); // Log errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/records/:id/notes', async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  try {
    const record = await Record.findById(id);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Always update the "Notes" field with the new note
    record.Notes = note;
    await record.save();

    return res
      .status(200)
      .json({ message: 'Note updated successfully', record });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/records/:id', async (req, res) => {
  try {
    const deletedRecord = await Record.findByIdAndDelete(req.params.id).lean();
    if (!deletedRecord)
      return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// app.patch('/records/:id/notes', async (req, res) => {
//   const { id } = req.params;
//   const { note } = req.body; // Expects a "note" field in the request body

//   try {
//     // Find the record by ID
//     const record = await Record.findById(id);

//     if (!record) {
//       return res.status(404).json({ error: 'Record not found' });
//     }

//     // Update the "Notes" field, whether it is empty or has existing content
//     record.Notes = note;
//     await record.save(); // Save the updated record

//     return res
//       .status(200)
//       .json({ message: 'Note updated successfully', record });
//   } catch (error) {
//     console.error('Error updating note:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// //

// app.patch('/records/:id/notes', async (req, res) => {
//   const { id } = req.params;
//   const { note } = req.body;

//   try {
//     const record = await Record.findById(id);
//     if (!record) {
//       console.log('Record not found'); // Debug statement
//       return res.status(404).json({ error: 'Record not found' });
//     }

//     record.Notes = note;
//     await record.save();

//     console.log('Note updated successfully'); // Debug statement
//     return res
//       .status(200)
//       .json({ message: 'Note updated successfully', record });
//   } catch (error) {
//     console.error('Error updating note:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Delete a record by ID (DELETE)

// Get records (with pagination and search)
// app.get('/records', async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const search = req.query.search || ''; // Get search term from query

//   try {
//     const skip = (page - 1) * limit;

//     // Construct filter for search
//     const filter = {
//       $or: [
//         { 'First Name': { $regex: search, $options: 'i' } },
//         { 'Last Name': { $regex: search, $options: 'i' } },
//         { Magazine: { $regex: search, $options: 'i' } },
//         { Email: { $regex: search, $options: 'i' } },
//         { 'Model Insta Link 1': { $regex: search, $options: 'i' } }, // Added Instagram Link filter
//       ],
//     };

//     const records = await Record.find(filter).skip(skip).limit(limit).lean();
//     const totalRecords = await Record.countDocuments(filter);

//     const response = {
//       totalRecords,
//       page,
//       totalPages: Math.ceil(totalRecords / limit),
//       records: formatRecords(records),
//     };

//     res.json(response);
//   } catch (err) {
//     res.status(500).json({ error: `Error retrieving records: ${err.message}` });
//   }
// });

// Get records (with pagination, search, and price range filtering)
