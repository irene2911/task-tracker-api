import express from 'express';
import { Board } from '../models.js';

const router = express.Router();

router.post('/addState/:boardId', async (req, res) => {
  const { boardId } = req.params;
  const { name } = req.body;

  try {
    const updatedBoard = await Board.findOneAndUpdate(
      { _id: boardId },
      {
        $push: {
          states: {
            name: name,
          },
        },
      },
      { new: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

    return res
      .status(200)
      .json({ message: 'State added successfully', board: updatedBoard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;
