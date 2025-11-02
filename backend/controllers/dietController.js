const Diet = require('../models/Diet');

exports.createDiet = async (req, res) => {
  try {
    const { meals = [], totalCalories = 0, date } = req.body;
    const diet = await Diet.create({ userId: req.user.id, meals, totalCalories, date });
    return res.status(201).json({ success: true, message: 'Diet created', data: diet });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDiets = async (req, res) => {
  try {
    const diets = await Diet.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    return res.json({ success: true, message: 'Diets fetched', data: diets });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDiet = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Diet.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Diet not found' });
    return res.json({ success: true, message: 'Diet updated', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDiet = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Diet.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Diet not found' });
    return res.json({ success: true, message: 'Diet deleted', data: deleted });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


