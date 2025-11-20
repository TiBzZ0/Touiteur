const express = require('express');
const required = require('express-required-fields');

const router = express.Router();
const likesController = require('../controllers/like.controller.js');

router.get('/count/:touiteId', likesController.countLikes);
router.get('/touite/:touiteId', likesController.getLikesByTouite);
router.get('/user/:userId', likesController.getLikesByUser);
router.post('/', required(['userId', 'touiteId']), likesController.addLike);
router.delete('/', required(['userId', 'touiteId']), likesController.removeLike);
router.get('/hasLike', likesController.hasLike);

module.exports = router;
