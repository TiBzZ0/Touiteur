const express = require('express');
const required = require('express-required-fields');

const router = express.Router();
const authController = require('../controllers/auth.controller.js');


// Register a new account
router.post('/register', required(['username', 'email', 'password', 'birthdate']), authController.register);
// Login to an existing account
router.post('/login', required(['login', 'password']), authController.login);
// Authenticate the current account
router.get('/authenticate', authController.authenticate);
// Logout the current account
router.post('/logout', authController.logout);
// Refresh the token
router.get('/refresh', authController.refreshToken);
// Verify the current account
router.post('/verify', authController.verifyAccount);


/*
// Get all accounts
router.get('/', tasksController.getAllAccounts);
// Get an account by ID
router.get('/:id', tasksController.getAccountById);
// Get an account by username
router.get('/username/:username', tasksController.getAccountByUsername);
// Update an existing account by ID
router.put('/:id', required(['username', 'nickname']), tasksController.updateAccount);
// Ban an account by ID with date
router.put('/ban/:id', required(['date']), tasksController.banAccount);
// Delete an account by ID
router.delete('/:id', tasksController.deleteAccount);
*/
module.exports = router;