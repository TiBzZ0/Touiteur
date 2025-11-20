const express = require('express');
const required = require('express-required-fields');

const router = express.Router();
const notificationController = require('../controllers/notification.controller.js');

router.get('/count/:receiverId', notificationController.countNotifications);
router.get('/:receiverId', notificationController.getNotifications);
router.post('/', required(['receiverId', 'senderId', 'message']), notificationController.sendNotification);
router.delete('/:receiverId', notificationController.deleteNotifications);

module.exports = router;
