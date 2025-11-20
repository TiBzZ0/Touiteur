const express = require('express');
const required = require('express-required-fields')

const router = express.Router();
const reportController = require('../controllers/report.controller');

// Route to create a new report
router.post('/', required(["touiteId", "posterId", "requesterId", "comment"]), reportController.createReport);
// Route to get all reports
router.get('/', reportController.getAllReports);
// Route to get all reports status
router.get('/status', reportController.getAllReportStatus);
// Route to get all reports reason
router.get('/reason', reportController.getAllReportReason);
// Route to get a report by its ID
router.get('/:id', reportController.getReportById);
// Route to update a report status
router.put('/:id/status', required(["status", "moderator"]), reportController.updateReportStatus);

module.exports = router;