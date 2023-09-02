import express from 'express';
import { Board } from '../models.js';
import {
  calculateNewOrder,
  moveWithinContainer,
  updateContainerOrder,
} from '../utils/taskOrder.js';

const router = express.Router();

router.post('/:boardId/move-task', async (req, res) => {
  const { boardId } = req.params;
  const { selectedTaskId, toContainer, newIndex } = req.body;

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    let foundTask = null;
    let sourceState = null;
    let destinationState = null;

    for (const state of board.states) {
      foundTask = state.items.find(
        (item) => item._id.toString() === selectedTaskId
      );
      if (foundTask) {
        sourceState = state;
        break;
      }
    }

    if (!sourceState) {
      return res.status(404).json({ error: 'Source container not found' });
    }

    if (toContainer === sourceState._id.toString()) {
      const updatedItems = moveWithinContainer(
        sourceState,
        selectedTaskId,
        newIndex
      );

      if (!updatedItems) {
        return res.status(404).json({ error: 'Task not found' });
      }

      updateContainerOrder(sourceState);
    } else {
      destinationState = board.states.find(
        (state) => state._id.toString() === toContainer
      );

      if (!destinationState) {
        return res
          .status(404)
          .json({ error: 'Destination container not found' });
      }

      const newOrder = calculateNewOrder(destinationState.items, newIndex);

      sourceState.items = sourceState.items.filter(
        (item) => item._id.toString() !== selectedTaskId
      );

      destinationState.items.splice(newIndex, 0, {
        _id: selectedTaskId,
        text: foundTask.text,
        desc: foundTask.desc,
        order: newOrder,
      });

      updateContainerOrder(destinationState);
    }

    await board.save();

    res.status(200).json({ message: 'Task moved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;
