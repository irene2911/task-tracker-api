import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  states: [
    {
      name: {
        type: String,
        required: true,
      },
      items: [
        {
          order: Number,
          text: String,
          desc: String,
        },
      ],
    },
  ],
});

export const Board = mongoose.model('Board', boardSchema);
