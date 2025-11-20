const express = require('express');
const required = require('express-required-fields');

const router = express.Router();
const followController = require('../controllers/follow.controller.js');

// Get followers of a user
router.get('/:userId/followers', followController.getFollowers);

// Get users followed by a user
router.get('/:userId/following', followController.getFollowing);

// Follow a user
router.post('/', required(['userId', 'followingId']), followController.followUser);

// Unfollow a user
router.delete('/', required(['userId', 'followingId']), followController.unfollowUser);

// Get Number of followers
router.get('/:userId/followers/count', followController.getFollowersCount);

// Get Number of users followed
router.get('/:userId/following/count', followController.getFollowingCount);

// Get if a user is following another user
router.get('/:userId/following/:followingId', followController.getIsFollowing);

module.exports = router;
