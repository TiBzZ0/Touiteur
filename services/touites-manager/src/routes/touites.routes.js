const express = require('express');
const required = require('express-required-fields')

const router = express.Router();
const touitesController = require('../controllers/touites.controller');
const maxFiles = require('../middlewares/maxFiles.middleware.js');

// Create a new touite
router.post('/', required(["content", "accountId"]), maxFiles(), touitesController.createTouite);

// Get a specific touite by ID
router.get('/:id', touitesController.getTouite);

// Get all touites
router.get('/', touitesController.getTouites);

// Get all touites by author
router.get('/account/:accountId', touitesController.getTouitesByAuthor);

// Get all touites by tag
router.get('/tag/:tag', touitesController.getTouitesByTag);

// Get all answers to a specific touite
router.get('/:id/answers', touitesController.getTouiteAnswers);

// Get the count of answers for a specific touite
router.get('/:id/answers/count', touitesController.getTouiteAnswersCount);

// Get all answers of a specific user
router.get('/answers/:accountId', touitesController.getTouitesAnswersByAuthor);

// Get all touites by a list of accounts
router.post('/by-accounts', required(['accounts']), touitesController.getTouitesByAccounts);

// Post an answer to a specific touite
router.post('/:id/answers', required(['content', 'accountId']), maxFiles(), touitesController.postTouiteAnswer);

// Get all quotes of a specific touite
router.get('/:id/quotes', touitesController.getTouiteQuotes);

// Post a quote of a specific touite
router.post('/:id/quotes', required(['content', 'accountId']), maxFiles(), touitesController.postTouiteQuote);

// Delete a specific touite
router.delete('/:id', touitesController.deleteTouite);

module.exports = router;