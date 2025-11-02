const Workout = require('../models/Workout');

exports.createWorkout = async (req, res) => {
  try {
    const { type, duration, notes, date } = req.body;
    if (!type || duration === undefined) {
      return res.status(400).json({ success: false, message: 'type and duration are required' });
    }
    const workout = await Workout.create({ userId: req.user.id, type, duration, notes, date });
    return res.status(201).json({ success: true, message: 'Workout created', data: workout });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    return res.json({ success: true, message: 'Workouts fetched', data: workouts });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Workout.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    return res.json({ success: true, message: 'Workout updated', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Workout.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    return res.json({ success: true, message: 'Workout deleted', data: deleted });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


