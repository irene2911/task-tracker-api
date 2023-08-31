import express from 'express';
import { Board } from '../models.js';

const router = express.Router();

router.post('/:boardId/:columnId', async (req, res) => {
  const { boardId, columnId } = req.params;
  const { text } = req.body;

  try {
    const board = await Board.findById(boardId);
    const state = board.states.find(
      (state) => state._id.toString() === columnId
    );

    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }

    const order = state.items.length + 1;

    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      {
        $push: {
          'states.$[state].items': {
            text,
            order,
          },
        },
      },
      {
        arrayFilters: [{ 'state._id': columnId }],
        new: true,
      }
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: 'Board not found' });
    }

    return res
      .status(201)
      .json({ message: 'Item added successfully', updatedBoard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding item' });
  }
});

export default router;
