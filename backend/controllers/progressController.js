const Progress = require('../models/Progress');

exports.createProgress = async (req, res) => {
  try {
    const { weight, workoutDone = false, date } = req.body;
    const progress = await Progress.create({ userId: req.user.id, weight, workoutDone, date });
    return res.status(201).json({ success: true, message: 'Progress logged', data: progress });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const logs = await Progress.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    return res.json({ success: true, message: 'Progress fetched', data: logs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Progress.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Progress not found' });
    return res.json({ success: true, message: 'Progress updated', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Progress.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Progress not found' });
    return res.json({ success: true, message: 'Progress deleted', data: deleted });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


