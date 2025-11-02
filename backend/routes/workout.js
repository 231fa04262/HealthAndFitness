const router = require('express').Router();
const auth = require('../middleware/auth');
const { createWorkout, getWorkouts, updateWorkout, deleteWorkout } = require('../controllers/workoutController');

router.use(auth);
router.get('/', getWorkouts);
router.post('/', createWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

module.exports = router;


