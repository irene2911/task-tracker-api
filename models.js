import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  states: [
    {
      name: {
        type: String,
        required: true,
      },
      items: [
        {
          text: String,
        },
      ],
    },
  ],
});

export const Board = mongoose.model('Board', boardSchema);
