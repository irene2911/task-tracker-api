import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import { Board } from './models.js';
dotenv.config();
const app = express();
const port = 3000; // You can change this to your preferred port

// Middleware
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend's URL
};

app.options('*', cors());

app.use(cors(corsOptions));

// API endpoint for saving data to JSON file
app.post('/boards', async (req, res) => {
  const { name } = req.body;

  console.log('name: ', name);

  const newBoard = new Board({
    name,
    states: [
      {
        name: 'TODO',
      },
      {
        name: 'IN PROGRESS',
      },
      {
        name: 'DONE',
      },
      {
        name: 'BLOCKED',
      },
    ],
  });
  try {
    await newBoard.save();
    return res.status(200).json({ message: 'Data saved successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'failed to create data' });
  }
});

app.get('/boards', async (req, res) => {
  try {
    const response = await Board.find();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'failed to fetch data' });
  }
});

app.delete('/boards/:id', async (req, res) => {
  const boardIdToDelete = req.params.id;
  try {
    const response = await Board.findByIdAndDelete(boardIdToDelete);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'failed to delete data' });
  }
});

app.put('/boards/:id', async (req, res) => {
  const boardIdToUpdate = req.params.id;
  const { newName } = req.body;

  try {
    const response = await Board.findByIdAndUpdate(boardIdToUpdate, {
      name: newName,
    });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'failed to rename data' });
  }
});

// API endpoint to get a specific board by its ID
app.get('/boards/:boardId', async (req, res) => {
  const boardId = req.params.boardId;

  try {
    const response = await Board.findById(boardId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'failed to find board by Id' });
  }
});

app.post('/columns/:columnId/items', (req, res) => {
  const { columnId } = req.params;
  const { id, text } = req.body;

  // Read the JSON file
  // fs.readFile('your-data-file.json', 'utf8', (readErr, data) => {
  //   if (readErr) {
  //     return res.status(500).json({ message: 'Error reading data file' });
  //   }

  //   try {
  //     const jsonData = JSON.parse(data);

  //     // Find the column by ID
  //     const column = jsonData.find((col) => col.id === columnId);

  //     if (!column) {
  //       return res.status(404).json({ message: 'Column not found' });
  //     }

  //     // Add the new item to the column
  //     column.items.push({ id, name });

  //     // Save the updated data back to the JSON file
  //     fs.writeFile(
  //       'your-data-file.json',
  //       JSON.stringify(jsonData, null, 2),
  //       (writeErr) => {
  //         if (writeErr) {
  //           return res.status(500).json({ message: 'Error saving data file' });
  //         }

  //         res.status(201).json({ message: 'Item added successfully' });
  //       }
  //     );
  //   } catch (parseError) {
  //     return res.status(500).json({ message: 'Error parsing data file' });
  //   }
  // });
});

app.listen(port, () => {
  mongoose.connect(process.env.MONGODB_URL);
  console.log(`Server is running on port ${port}`);
});
