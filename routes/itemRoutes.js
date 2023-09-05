import express from 'express';
import { Board } from '../models.js';

const router = express.Router();
router.post('/:boardId/:columnId', async (req, res) => {
  const { boardId, columnId } = req.params;
  const { text, desc } = req.body;

  try {
    const board = await Board.findById(boardId);
    const state = board.states.find(
      (state) => state._id.toString() === columnId
    );

    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }

    const order = state.items.length + 1;

    const updateQuery = {
      $push: {
        'states.$[state].items': {
          text,
          order,
          desc,
        },
      },
    };

    if (desc) {
      updateQuery.$push['states.$[state].items'].desc = desc;
    }

    const updatedBoard = await Board.findByIdAndUpdate(boardId, updateQuery, {
      arrayFilters: [{ 'state._id': columnId }],
      new: true,
    });

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

router.put('/updateTask/:boardId', async (req, res) => {
  const { boardId } = req.params;
  const { newTaskText, newTaskDesc, taskId } = req.body;
  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    let task = null;
    let state = null;

    for (const boardState of board.states) {
      task = boardState.items.find((item) => item._id.toString() === taskId);

      if (task) {
        state = boardState;
        break;
      }
    }

    if (!task) {
      return res.status(404).json({ error: 'Task not found in any state' });
    }

    if (newTaskText !== undefined) {
      task.text = newTaskText;
    }

    if (newTaskDesc !== undefined) {
      task.desc = newTaskDesc;
    }

    await board.save();

    res.json({ message: 'Task updated successfully', updatedTask: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/deleteTask/:boardId/:taskId', async (req, res) => {
  const { boardId, taskId } = req.params;

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    let task = null;
    let state = null;

    for (const boardState of board.states) {
      task = boardState.items.find((item) => item._id.toString() === taskId);

      if (task) {
        state = boardState;
        break;
      }
    }

    if (!task) {
      return res.status(404).json({ error: 'Task not found in any state' });
    }

    const taskIndex = state.items.findIndex(
      (item) => item._id.toString() === taskId
    );
    state.items.splice(taskIndex, 1);

    await board.save();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
