const { get } = require('mongoose');
const Account = require('../models/account.model');

module.exports = {
    getAllAccounts: async (req, res) => {
        try {
            const accounts = await Account.find().select('username nickname bio pictureId themeId languageId notification lastConnection');
            res.status(200).json(accounts);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAccountById: async (req, res) => {
        const { id } = req.params;
        try {
            const account = await Account.findById(id).select('username nickname bio pictureId themeId languageId notification lastConnection');
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.status(200).json(account);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAccountByUsername: async (req, res) => {
        const { username } = req.params;
        const cleanUsername = username.replace(/^@/, '');
        try {
            const account = await Account.findOne({ username: cleanUsername }).select('username nickname bio pictureId themeId languageId notification lastConnection');
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.status(200).json(account);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAccountsByPartialUsername: async (req, res) => {
        const { partialUsername } = req.params;
        console.log("Searching for accounts with partial username:", partialUsername);
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            const accounts = await Account.find({ username: { $regex: partialUsername, $options: 'i' } })
                .select('username nickname bio pictureId themeId languageId notification lastConnection')    
                .sort({ lastConnection: -1 })
                .skip(skip)
                .limit(limit);
            res.status(200).json(accounts);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    updateAccount: async (req, res) => {
        const { id } = req.params;
        const { username, nickname, bio, pictureId, themeId, languageId, notification } = req.body;
        // Ensure the username is unique
        try {
            const existingAccount = await Account.findOne({ username });
            if (existingAccount && existingAccount._id.toString() !== id) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const account = await Account.findByIdAndUpdate(id, {
                username,
                nickname,
                bio,
                pictureId,
                themeId,
                languageId,
                notification
            }, { new: true });

            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.status(200).json({ message: 'Account updated successfully', account });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Ban an account until a specific date
    banAccount: async (req, res) => {
        const { id } = req.params;
        const { date } = req.body;
        try {
            const account = await Account.findByIdAndUpdate(id, { banned: date }, { new: true });
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.status(200).json({ message: 'Account banned successfully', account });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    editPassword: async (req, res) => {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Old password and new password are required" });
        }

        try {
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        // Compare the old password with the hashed password in the database
        const isMatch = await bcrypt.compare(oldPassword, account.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }
        
        account.password = newPassword;
        await account.save();

        res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error updating password", error });
        }
    },

    // Not really deleting, just marking as deleted with the current date
    deleteAccount: async (req, res) => {
        const { id } = req.params;
        try {
            const account = await Account.findByIdAndUpdate(id, { deleted: new Date() }, { new: true });
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.status(200).json({ message: 'Account deleted successfully', account });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    
    // Permanently delete an account
    realDeleteAccount: async (req, res) => {
        const { id } = req.params;
        try {
            const account = await Account.findByIdAndDelete(id);
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            res.status(500).json(error);
        }
    }
};