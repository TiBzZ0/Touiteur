const express = require('express');
const required = require('express-required-fields');

const router = express.Router();
const messageController = require('../controllers/message.controller.js');

router.get('/group/:groupId', messageController.getMessagesByGroup);
router.get('/:messageId', messageController.getMessage);
router.post('/send', required(['senderId', 'groupId', 'content']), messageController.sendMessage);
router.post('/read/:messageId', required(['readerId']), messageController.markMessageAsRead);
router.post('/:groupId/mark-all-read/:userId', messageController.markAllAsRead);
router.post('/:groupId/has-unread/:userId', messageController.hasUnread);
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;
