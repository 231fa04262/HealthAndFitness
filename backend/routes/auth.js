const router = require('express').Router();
const { register, login, updateProfile, uploadProfilePhoto } = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', auth, updateProfile);
router.post('/profile/photo', auth, upload.single('photo'), uploadProfilePhoto);

module.exports = router;


