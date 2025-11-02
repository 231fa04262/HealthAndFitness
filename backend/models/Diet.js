const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    calories: { type: Number, required: true, min: 0 },
    time: { type: String, trim: true }
  },
  { _id: false }
);

const DietSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meals: { type: [MealSchema], default: [] },
    totalCalories: { type: Number, default: 0, min: 0 },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Diet', DietSchema);


