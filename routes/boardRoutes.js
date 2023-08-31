import express from 'express';
import { Board } from '../models.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name } = req.body;

  const newBoard = new Board({
    name,
    description: 'Description of the board',
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

router.get('/', async (req, res) => {
  try {
    const response = await Board.find();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'failed to fetch data' });
  }
});

router.delete('/:id', async (req, res) => {
  const boardIdToDelete = req.params.id;
  try {
    const response = await Board.findByIdAndDelete(boardIdToDelete);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'failed to delete data' });
  }
});

router.put('/:id', async (req, res) => {
  const boardIdToUpdate = req.params.id;
  const { name, description } = req.body;

  const updateFields = {};

  if (name) {
    updateFields.name = name;
  }

  if (description !== undefined) {
    updateFields.description = description;
  }

  try {
    const response = await Board.findByIdAndUpdate(
      boardIdToUpdate,
      updateFields,
      { new: true }
    );

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'failed to update data' });
  }
});

router.get('/:boardId', async (req, res) => {
  const boardId = req.params.boardId;

  try {
    const response = await Board.findById(boardId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'failed to find board by Id' });
  }
});

export default router;
