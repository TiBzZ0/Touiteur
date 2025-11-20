const { get } = require('mongoose');
const Follow = require('../models/follow.model');

module.exports = {
    getFollowers: async (req, res) => {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        try {
            const followers = await Follow.find({ followingId: userId });

            res.status(200).json(followers);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving followers", error });
        }
    },
    getFollowing: async (req, res) => {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        try {
            const following = await Follow.find({ userId });

            res.status(200).json(following);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving following", error });
        }
    },

    followUser: async (req, res) => {
        const { userId, followingId } = req.body;

        if (!userId || !followingId) {
            return res.status(400).json({ message: "User ID and following ID are required" });
        }

        try {
            const existingFollow = await Follow.findOne({ userId, followingId });

            if (existingFollow) {
                return res.status(400).json({ message: "You are already following this user" });
            }

            const newFollow = new Follow({ userId, followingId });
            await newFollow.save();

            res.status(201).json({ message: "Successfully followed the user", follow: newFollow });
        } catch (error) {
            res.status(500).json({ message: "Error following user", error });
        }
    },

    unfollowUser: async (req, res) => {
        const { userId, followingId } = req.body;

        if (!userId || !followingId) {
            return res.status(400).json({ message: "User ID and following ID are required" });
        }

        try {
            const existingFollow = await Follow.findOneAndDelete({ userId, followingId });

            if (!existingFollow) {
                return res.status(404).json({ message: "You are not following this user" });
            }

            res.status(200).json({ message: "Successfully unfollowed the user" });
        } catch (error) {
            res.status(500).json({ message: "Error unfollowing user", error });
        }
    },

    getFollowersCount: async (req, res) => {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        try {
            const count = await Follow.countDocuments({ followingId: userId });
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ message: "Error retrieving followers count", error });
        }
    },

    getFollowingCount: async (req, res) => {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        try {
            const count = await Follow.countDocuments({ userId });
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ message: "Error retrieving following count", error });
        }
    },

    getIsFollowing: async (req, res) => {
        const { userId, followingId } = req.params;
        if (!userId || !followingId) {
            return res.status(400).json({ message: "User ID and following ID are required" });
        }
        try {
            const isFollowing = await Follow.exists({ userId, followingId });
            res.status(200).json({ isFollowing });
        } catch (error) {
            res.status(500).json({ message: "Error checking follow status", error });
        }
    }
};
