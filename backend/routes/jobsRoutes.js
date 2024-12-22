const express = require('express');
const jobsController = require('../controllers/jobsController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.get('/', jobsController.getAllJobs);
router.get('/latest/:num', jobsController.getLatestJobs);
router.get('/:id', jobsController.getJobById);
router.post('/', authenticateToken, jobsController.createNewJob);
router.put('/:id', authenticateToken, jobsController.updateJob);
router.delete('/:id', authenticateToken, jobsController.deleteJob);

module.exports = router;