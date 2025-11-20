const mongoose = require('mongoose');
const Touite = require('../models/touites.model');

// Touites Controller
// This controller handles all operations related to touites, including creation, retrieval, and deletion.
module.exports = {

    // Create a new touite
    // Required fields: content, accountId in body
    // Optional fields: tags (array), files (array)
    createTouite: async (req, res) => {
        try {
            const newTouite = new Touite({ content: req.body.content, accountId: req.body.accountId, tags: req.body.tags || [], files: req.body.files || [] });
            await newTouite.save();
            res.status(201).send({ message: 'Touite created successfully', touite: newTouite });
        } catch (error) {
            console.error('Error creating touite:', error);
            res.status(500).json(error);
        }
    },

    // Get a specific touite by ID
    // Required fields: id in URL params
    getTouite: async (req, res) => {
        const { id } = req.params;
        try {
            const touite = await Touite.findById(id).where({ deletedAt: null });
            if (!touite) return res.status(404).json({ error: 'Touite not found' });
            res.status(200).json(touite);
        } catch (error) {
            console.error('Error fetching touite:', error);
            res.status(500).json(error);
        }
    },

    // Get all touites
    // No required fields
    getTouites: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;

            const touites = await Touite.find({ deletedAt: null, isAnswerTo: null, isQuoteTo: null })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

            if (touites.length === 0) {
                return res.status(404).json({ error: 'No touites found' });
            }

            const formattedTouites = touites.map(touite => ({
            ...touite.toObject(),
            createdAt: touite.createdAt.toISOString()
            }));

            res.status(200).json(formattedTouites);

        } catch (error) {
            console.error('Error fetching touites:', error);
            res.status(500).json(error);
        }
    },


    // Get all touites by author
    // Required fields: author in URL params
    getTouitesByAuthor: async (req, res) => {
        const { accountId } = req.params;
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;

            const touites = await Touite.find({ accountId })
            .where({ deletedAt: null })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            if (touites.length === 0) return res.status(404).json({ error: 'No touites found for this author' });
            res.status(200).json(touites);
        } catch (error) {
            console.error('Error fetching touites by author:', error);
            res.status(500).json(error);
        }
    },

    // Get all touites by tag
    // Required fields: tag in URL params
    getTouitesByTag: async (req, res) => {
        const { tag } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        try {
            const touites = await Touite.find({ deletedAt: null })
                .where({ tags: { $in: [tag] } })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            if (touites.length === 0) return res.status(404).json({ error: 'No touites found with this tag' });
            res.status(200).json(touites);
        } catch (error) {
            console.error('Error fetching touites by tag:', error);
            res.status(500).json(error);
        }
    },

    // Get all answers to a specific touite
    // Required fields: id in URL params
    getTouiteAnswers: async (req, res) => {
        const { id } = req.params;
        try {
            const answers = await Touite.find({ isAnswerTo: id, deletedAt: null });
            const allAnswers = await Promise.all(
                answers.map(async (answer) => {
                    const subAnswers = await Touite.find({ isAnswerTo: answer._id });
                    return { ...answer.toObject(), subAnswers };
                })
            );
            res.status(200).json(allAnswers);
        } catch (error) {
            console.error('Error fetching touite answers:', error);
            res.status(500).json(error);
        }
    },

    // Get the count of answers for a specific touite
    // Required fields: id in URL params
    getTouiteAnswersCount: async (req, res) => {
        const { id } = req.params;
        try {
            const count = await Touite.countDocuments({ isAnswerTo: id, deletedAt: null });
            res.status(200).json({ count });
        } catch (error) {
            console.error('Error counting touite answers:', error);
            res.status(500).json(error);
        }
    },

    // Get all answers of a specific user
    // Required fields: accountId in URL params
    getTouitesAnswersByAuthor: async (req, res) => {
        const { accountId } = req.params;
        const objectId = new mongoose.Types.ObjectId(accountId);
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;

            const answers = await Touite.find({ accountId: objectId, deletedAt: null })
                .where({ isAnswerTo: { $ne: null } })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            res.status(200).json(answers);
        } catch (error) {
            console.error('Error fetching touite answers by author:', error);
            res.status(500).json(error);
        }
    },

    // get all touites by multiple accounts
    getTouitesByAccounts: async (req, res) => {
        try {
            const { accounts } = req.body;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            if (!Array.isArray(accounts) || accounts.length === 0) {
                return res.status(400).json({ error: "accounts (array) required in body" });
            }

            const objectIds = accounts.map(id => new mongoose.Types.ObjectId(id));
            const skip = (page - 1) * limit;

            const touites = await Touite.find({
                accountId: { $in: objectIds },
                deletedAt: null,
                isAnswerTo: null,
                isQuoteTo: null
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

            res.status(200).json(touites);
        } catch (error) {
            console.error('Error fetching touites by accounts:', error);
            res.status(500).json(error);
        }
    },

    // Post an answer to a specific touite
    // Required fields: id in URL params, content and author in body
    postTouiteAnswer: async (req, res) => {
        const { id } = req.params;
        const { content, accountId } = req.body;
        try {
            const touite = await Touite.findById(id).where({ deletedAt: null });
            if (!touite) return res.status(404).json({ error: 'Touite not found' });
            const newAnswer = new Touite({ content, accountId, isAnswerTo: touite._id });
            await newAnswer.save();
            res.status(201).send({ message: 'Answer posted successfully', answer: newAnswer });
        } catch (error) {
            console.error('Error posting touite answer:', error);
            res.status(500).json(error);
        }
    },

    // Get all quotes of a specific touite
    // Required fields: id in URL params
    getTouiteQuotes: async (req, res) => {
        const { id } = req.params;
        try {
            const quotes = await Touite.find({ isQuoteTo: id , deletedAt: null });
            res.status(200).json(quotes);
        } catch (error) {
            console.error('Error fetching touite quotes:', error);
            res.status(500).json(error);
        }
    },

    // Post a quote of a specific touite
    // Required fields: id in URL params, content and author in body
    postTouiteQuote: async (req, res) => {
        const { id } = req.params;
        const { content, accountId } = req.body;
        try {
            const touite = await Touite.findById(id).where({ deletedAt: null });
            if (!touite) return res.status(404).json({ error: 'Touite not found' });
            const newQuote = new Touite({ content, accountId, isQuoteTo: touite._id });
            await newQuote.save();
            res.status(201).send({ message: 'Quote posted successfully', quote: newQuote });
        } catch (error) {
            console.error('Error posting touite quote:', error);
            res.status(500).json(error);
        }
    },

    // Delete a specific touite
    // Required fields: id in URL params
    deleteTouite: async (req, res) => {
        const { id } = req.params;
        try {
            const deletedTouite = await Touite.findByIdAndUpdate(id, { deletedAt: new Date() });
            if (!deletedTouite) return res.status(404).json({ error: 'Touite not found' });
            res.status(201).json({ message: 'Touite deleted successfully', touite: deletedTouite });
        } catch (error) {
            console.error('Error deleting touite:', error);
            res.status(500).json(error);
        }
    },
}