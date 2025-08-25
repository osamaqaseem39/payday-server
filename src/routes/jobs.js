const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  getJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

// Jobs routes
router.get('/', authenticateToken, getJobs);
router.post('/', authenticateToken, requireRole(['admin', 'hr_manager', 'hr_staff']), createJob);
router.get('/:id', authenticateToken, getJobById);
router.put('/:id', authenticateToken, requireRole(['admin', 'hr_manager', 'hr_staff']), updateJob);
router.delete('/:id', authenticateToken, requireRole(['admin', 'hr_manager']), deleteJob);

module.exports = router; 