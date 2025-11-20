const express = require('express');
const required = require('express-required-fields');

const router = express.Router();
const groupController = require('../controllers/group.controller.js');

// Get users in a group
router.get('/:groupId/users', groupController.getUsersInGroup);

// Get last message in a group
router.get('/:groupId/last-message', groupController.getLastMessageInGroup);

// Set the last message for a group
router.post('/:groupId/last-message', required(['messageId']), groupController.setLastMessage);

// Get all groups for a user
router.get('/user/:userId', groupController.getUserGroups);

// Create a new group
router.post('/', required(['name', 'usersId']), groupController.createGroup);

// Add users to a group
router.post('/:groupId/users', required(['userIds']), groupController.addUsersToGroup);

// Remove a user from a group
router.delete('/:groupId/users/:userId', groupController.removeUserFromGroup);

// Edit group name
router.put('/:groupId/name', required(['name']), groupController.editName);

// Soft delete a group
router.delete('/:groupId', groupController.deleteGroup);

module.exports = router;
