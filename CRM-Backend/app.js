import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import recordRoutes from './routes/recordRoutes.js'; // Assuming you create a separate file for routes
// import { importData } from './scripts/script.js'; // Update the path to where your import script is located
import importRoutes from './routes/importRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Middleware configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Use env variable for CORS origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if connection fails
  }
};

// Initialize database connection
connectDB();

// Routes
app.use('/records', recordRoutes); // Use your routes

//User Routes
app.use('/api', userRoutes);

// Middleware and Routes
app.use('/api', importRoutes);

// // File import route
// app.post('/api/import', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }

//   try {
//     const filePath = req.file.path; // Get the uploaded file path
//     await importData(filePath); // Pass the uploaded file path to your import function
//     res.status(200).json({ message: 'Data imported successfully' });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: 'Error importing data', error: err.message });
//   }
// });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import multer from 'multer';
// import cors from 'cors';
// import recordRoutes from './routes/recordRoutes.js'; // Assuming you create a separate file for routes
// import { importData } from './scripts/script.js'; // Update the path to where your import script is located

// dotenv.config();

// const app = express();

// // CORS configuration
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Use env variable for CORS origin
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// // Middleware
// app.use(express.json());

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage });

// // MongoDB connection
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.error('MongoDB connection error:', err);
//     process.exit(1); // Exit process if connection fails
//   }
// };

// // Initialize database connection
// connectDB();

// // Use routes
// app.use('/records', recordRoutes); // Use your routes

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// app.post('/api/import', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }

//   try {
//     // Pass the uploaded file path to your import function
//     const filePath = req.file.path;
//     await importData(filePath); // Update importData function to accept the file path
//     res.status(200).json({ message: 'Data imported successfully' });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: 'Error importing data', error: err.message });
//   }
// });

// // import express from 'express';
// // import mongoose from 'mongoose';
// // import dotenv from 'dotenv';
// // import multer from 'multer';
// // import cors from 'cors';
// // import * as recordController from './controllers/recordController.js';

// // dotenv.config();

// // const app = express();
// // app.use(
// //   cors({
// //     origin: 'http://localhost:5173',
// //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// //     credentials: true,
// //     allowedHeaders: ['Content-Type', 'Authorization'],
// //   })
// // );
// // app.use(express.json());

// // // Multer configuration for file uploads
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, './uploads/'),
// //   filename: (req, file, cb) => cb(null, file.originalname),
// // });
// // const upload = multer({ storage });

// // // MongoDB connection
// // mongoose
// //   .connect(process.env.MONGO_URI, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   })
// //   .then(() => console.log('MongoDB connected'))
// //   .catch((err) => console.log(err));

// // // Routes
// // app.get('/records', recordController.getRecords);
// // app.post('/api/import', upload.single('file'), recordController.importRecords);
// // app.post('/records', recordController.createRecord);
// // app.get('/records/:id', recordController.getRecordById);
// // app.patch('/records/:id', recordController.updateRecord);
// // app.patch('/records/:id/notes', recordController.updateRecordNotes);
// // app.delete('/records/:id', recordController.deleteRecord);

// // // Start server
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // // import express from 'express';
// // // import mongoose from 'mongoose';
// // // import dotenv from 'dotenv';
// // // import cors from 'cors';
// // // import multer from 'multer';
// // // import recordRoutes from './routes/recordRoutes.js';
// // // import importRoutes from './routes/importRoutes.js';

// // // dotenv.config();

// // // const app = express();
// // // app.use(
// // //   cors({
// // //     origin: 'http://localhost:5173',
// // //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// // //     credentials: true,
// // //     allowedHeaders: ['Content-Type', 'Authorization'],
// // //   })
// // // );
// // // app.use(express.json());

// // // // Configure Multer for file uploads
// // // const storage = multer.diskStorage({
// // //   destination: (req, file, cb) => cb(null, './uploads/'),
// // //   filename: (req, file, cb) => cb(null, file.originalname),
// // // });
// // // app.use(multer({ storage }).single('file'));

// // // // Connect to MongoDB
// // // mongoose
// // //   .connect(process.env.MONGO_URI, {
// // //     useNewUrlParser: true,
// // //     useUnifiedTopology: true,
// // //   })
// // //   .then(() => console.log('MongoDB connected'))
// // //   .catch((err) => console.log(err));

// // // // Use routes
// // // app.use('/records', recordRoutes);
// // app.use('/api/import', importRoutes);

// // // const PORT = process.env.PORT || 5000;
// // // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
