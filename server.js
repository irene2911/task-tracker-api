let nanoid;
import('nanoid').then((nanoidModule) => {
  nanoid = nanoidModule;
});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
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
app.post('/boards', (req, res) => {
  const { name } = req.body;

  // Read the existing data from the JSON file
  fs.readFile('boards.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read data.' });
      return;
    }

    let existingData = JSON.parse(data);

    // If existingData is not an array, initialize it as an empty array
    if (!Array.isArray(existingData)) {
      existingData = [];
    }

    // Append the new board name to the existing data
    existingData.push({ name, id: nanoid.nanoid() });

    // Write the updated data back to the JSON file
    fs.writeFile(
      'boards.json',
      JSON.stringify(existingData, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to save data.' });
        } else {
          res.status(200).json({ message: 'Data saved successfully.' });
        }
      }
    );
  });
});

app.get('/boards', (req, res) => {
  fs.readFile('boards.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read data.' });
    } else {
      const parsedData = JSON.parse(data);
      res.status(200).json(parsedData);
    }
  });
});

app.delete('/boards/:id', (req, res) => {
  const boardIdToDelete = req.params.id;

  fs.readFile('boards.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read data.' });
    } else {
      try {
        const parsedData = JSON.parse(data);
        const filtered = parsedData.filter(
          (board) => board.id !== boardIdToDelete
        );
        // Save the updated array back to the JSON file
        fs.writeFile(
          'boards.json',
          JSON.stringify(filtered, null, 2),
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Failed to save data.' });
            } else {
              res.status(200).json({ message: 'Board removed successfully.' });
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process data.' });
      }
    }
  });
});

app.put('/boards/:id', (req, res) => {
  const boardIdToUpdate = req.params.id;
  const { newName } = req.body;

  fs.readFile('boards.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read data.' });
    } else {
      try {
        const parsedData = JSON.parse(data);
        const boardToUpdate = parsedData.find(
          (board) => board.id === boardIdToUpdate
        );

        if (boardToUpdate) {
          boardToUpdate.name = newName;
          // Save the updated array back to the JSON file
          fs.writeFile(
            'boards.json',
            JSON.stringify(parsedData, null, 2),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to save data.' });
              } else {
                res
                  .status(200)
                  .json({ message: 'Board renamed successfully.' });
              }
            }
          );
        } else {
          res.status(404).json({ error: 'Board not found.' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process data.' });
      }
    }
  });
});

// API endpoint to get a specific board by its ID
app.get('/boards/:boardId/:boardName', (req, res) => {
  const boardId = req.params.boardId;

  // Read the boards data from your JSON file
  fs.readFile('boards.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read data.' });
    } else {
      const parsedData = JSON.parse(data);

      // Find the board with the specified ID
      const board = parsedData.find((board) => board.id === boardId);

      console.log('board: ', board);

      if (board) {
        res.status(200).json(board); // Send the board data as JSON response
      } else {
        res.status(404).json({ error: 'Board not found.' });
      }
    }
  });
});

app.post('/columns/:columnId/items', (req, res) => {
  const { columnId } = req.params;
  const { id, name } = req.body;

  // Read the JSON file
  fs.readFile('your-data-file.json', 'utf8', (readErr, data) => {
    if (readErr) {
      return res.status(500).json({ message: 'Error reading data file' });
    }

    try {
      const jsonData = JSON.parse(data);

      // Find the column by ID
      const column = jsonData.find((col) => col.id === columnId);

      if (!column) {
        return res.status(404).json({ message: 'Column not found' });
      }

      // Add the new item to the column
      column.items.push({ id, name });

      // Save the updated data back to the JSON file
      fs.writeFile(
        'your-data-file.json',
        JSON.stringify(jsonData, null, 2),
        (writeErr) => {
          if (writeErr) {
            return res.status(500).json({ message: 'Error saving data file' });
          }

          res.status(201).json({ message: 'Item added successfully' });
        }
      );
    } catch (parseError) {
      return res.status(500).json({ message: 'Error parsing data file' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
