const express = require('express');
const required = require('express-required-fields');

const router = express.Router();
const accountsController = require('../controllers/account.controller.js');

// Get all accounts
router.get('/', accountsController.getAllAccounts);
// Get an account by ID
router.get('/:id', accountsController.getAccountById);
// Get an account by username
router.get('/username/:username', accountsController.getAccountByUsername);
// Get accounts by partial username
router.get('/partial-username/:partialUsername', accountsController.getAccountsByPartialUsername);
// Update an existing account by ID
router.put('/:id', accountsController.updateAccount);
// Ban an account by ID with date
router.put('/ban/:id', required(['date']), accountsController.banAccount);
// Edit password of an account by ID
router.put('/edit-password/:id', required(['oldPassword', 'newPassword']), accountsController.editPassword);
// Delete an account by ID
router.delete('/:id', accountsController.deleteAccount);
// Real delete an account by ID
router.delete('/delete/:id', accountsController.realDeleteAccount);

module.exports = router;
