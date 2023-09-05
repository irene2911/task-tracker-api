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

router.delete('/deleteState/:boardId/:stateId', async (req, res) => {
  const { boardId, stateId } = req.params;

  try {
    const updatedBoard = await Board.findOneAndUpdate(
      { _id: boardId },
      {
        $pull: {
          states: { _id: stateId },
        },
      },
      { new: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

    return res.status(200).json({ message: 'State deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

router.put('/stateRename/:boardId/:columnId', async (req, res) => {
  const { boardId, columnId } = req.params;
  const { newStateName } = req.body;

  try {
    if (!newStateName) {
      return res.status(400).json({ error: 'New state name is required' });
    }

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const state = board.states.id(columnId);

    if (!state) {
      return res.status(404).json({ error: 'State not found' });
    }

    state.name = newStateName;

    await board.save();

    return res.status(200).json({ message: 'State name updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;
