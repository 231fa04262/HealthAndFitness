const router = require('express').Router();
const auth = require('../middleware/auth');
const { createDiet, getDiets, updateDiet, deleteDiet } = require('../controllers/dietController');

router.use(auth);
router.get('/', getDiets);
router.post('/', createDiet);
router.put('/:id', updateDiet);
router.delete('/:id', deleteDiet);

module.exports = router;


