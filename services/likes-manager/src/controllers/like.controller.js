const { get } = require('mongoose');
const Like = require('../models/like.model');

module.exports = {
    countLikes: async (req, res) => {
        const { touiteId } = req.params;

        if (!touiteId) {
            return res.status(400).json({ message: "Touite ID is required" });
        }

        try {
            const count = await Like.countDocuments({ touiteId });
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ message: "Error counting likes", error });
        }
    },

    getLikesByTouite: async (req, res) => {
        const { touiteId } = req.params;

        if (!touiteId) {
            return res.status(400).json({ message: "Touite ID is required" });
        }

        try {
            const likes = await Like.find({ touiteId }).select('userId');
            res.status(200).json(likes);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving likes", error });
        }
    },

    getLikesByUser: async (req, res) => {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            
            const likes = await Like.find({ userId }).select('touiteId')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
            res.status(200).json(likes);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving likes", error });
        }
    },

    addLike: async (req, res) => {
        const { userId, touiteId } = req.body;

        if (!userId || !touiteId) {
            return res.status(400).json({ message: "User ID and Touite ID are required" });
        }

        try {
            const newLike = new Like({ userId, touiteId });
            await newLike.save();
            res.status(201).json({ message: "Like added successfully", like: newLike });
        } catch (error) {
            res.status(500).json({ message: "Error adding like", error });
        }
    },

    removeLike: async (req, res) => {
        const { userId, touiteId } = req.body;

        if (!userId || !touiteId) {
            return res.status(400).json({ message: "User ID and Touite ID are required" });
        }

        try {
            const like = await Like.findOneAndDelete({ userId, touiteId });
            if (!like) {
                return res.status(404).json({ message: "Like not found" });
            }
            res.status(200).json({ message: "Like removed successfully", like });
        } catch (error) {
            res.status(500).json({ message: "Error removing like", error });
        }
    },

    hasLike: async (req, res) => {
        const userId = req.query.userId;
        const touiteId = req.query.touiteId;

        if (!userId || !touiteId) {
            return res.status(400).json({ message: "User ID and Touite ID are required" });
        }

        try {
            const like = await Like.findOne({ 'userId': userId, 'touiteId': touiteId });
            res.status(200).json({ hasLike: !!like });
        } catch (error) {
            res.status(500).json({ message: "Error checking like", error });
        }
    }
    
};