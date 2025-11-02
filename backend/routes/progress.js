const router = require('express').Router();
const auth = require('../middleware/auth');
const { createProgress, getProgress, updateProgress, deleteProgress } = require('../controllers/progressController');

router.use(auth);
router.get('/', getProgress);
router.post('/', createProgress);
router.put('/:id', updateProgress);
router.delete('/:id', deleteProgress);

module.exports = router;


