// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// function signToken(userId) {
//   const secret = process.env.JWT_SECRET || 'dev_secret';
//   return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
// }

// exports.register = async (req, res) => {
//   try {
//     const { username, email, password, age, weight, height, goals, profilePic, weeklyGoal, weeklyDays } = req.body;
//     if (!username || !email || !password) {
//       return res.status(400).json({ success: false, message: 'username, email and password are required' });
//     }
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ success: false, message: 'Email already in use' });
//     }
//     if (profilePic && !/\.(jpe?g)$/i.test(profilePic.split('?')[0])) {
//       return res.status(400).json({ success: false, message: 'Profile picture must be a .jpg or .jpeg image URL' });
//     }
//     const user = await User.create({ username, email, password, age, weight, height, goals, profilePic, weeklyGoal, weeklyDays });
//     const token = signToken(user._id);
//     return res.status(201).json({
//       success: true,
//       message: 'User registered',
//       data: { token, user: { id: user._id, username: user.username, email: user.email, profilePic: user.profilePic || null, weeklyGoal: user.weeklyGoal, weeklyDays: user.weeklyDays } }
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: 'email and password are required' });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ success: false, message: 'Invalid credentials' });
//     }
//     const valid = await user.comparePassword(password);
//     if (!valid) {
//       return res.status(400).json({ success: false, message: 'Invalid credentials' });
//     }
//     const token = signToken(user._id);
//     return res.json({
//       success: true,
//       message: 'Login successful',
//       data: { token, user: { id: user._id, username: user.username, email: user.email, profilePic: user.profilePic || null, weeklyGoal: user.weeklyGoal, weeklyDays: user.weeklyDays } }
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   try {
//     const updates = {};
//     const allowed = ['username', 'age', 'weight', 'height', 'goals', 'profilePic', 'weeklyGoal', 'weeklyDays'];
//     for (const key of allowed) {
//       if (req.body[key] !== undefined) updates[key] = req.body[key];
//     }
//     if (updates.profilePic && !/\.(jpe?g)$/i.test(String(updates.profilePic).split('?')[0])) {
//       return res.status(400).json({ success: false, message: 'Profile picture must be a .jpg or .jpeg image URL' });
//     }
//     if (updates.weeklyGoal !== undefined) {
//       const n = Number(updates.weeklyGoal)
//       if (Number.isNaN(n) || n < 0 || n > 7) return res.status(400).json({ success: false, message: 'weeklyGoal must be 0..7' })
//       updates.weeklyGoal = n
//     }
//     if (updates.weeklyDays !== undefined) {
//       if (!Array.isArray(updates.weeklyDays) || updates.weeklyDays.some(d => d < 0 || d > 6)) {
//         return res.status(400).json({ success: false, message: 'weeklyDays must be an array of 0..6' })
//       }
//     }
//     const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
//     if (!user) return res.status(404).json({ success: false, message: 'User not found' });
//     return res.json({ success: true, message: 'Profile updated', data: { id: user._id, username: user.username, email: user.email, profilePic: user.profilePic || null, weeklyGoal: user.weeklyGoal, weeklyDays: user.weeklyDays } });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.uploadProfilePhoto = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'No file uploaded' });
//     }
//     // Ensure jpeg extension
//     const isJpeg = /\.(jpe?g)$/i.test(req.file.filename);
//     if (!isJpeg) {
//       return res.status(400).json({ success: false, message: 'Only .jpg or .jpeg allowed' });
//     }
//     const relativePath = `/uploads/${req.file.filename}`;
//     const user = await User.findByIdAndUpdate(req.user.id, { profilePic: relativePath }, { new: true });
//     return res.json({ success: true, message: 'Profile photo updated', data: { profilePic: user.profilePic } });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const path = require('path');

function signToken(userId) {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
}

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'username, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });

    const user = new User(req.body);
    await user.save();

    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic || null,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic || null,
          weeklyGoal: user.weeklyGoal,
          weeklyDays: user.weeklyDays,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Upload profile photo

exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const relativePath = `/uploads/${req.file.filename}`;

    // Save only the relative path in the database
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.profilePic = relativePath;
    await user.save();

    return res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: { profilePic: relativePath },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
