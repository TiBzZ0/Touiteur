const { get } = require('mongoose');
const Notification = require('../models/notification.model');

module.exports = {
    countNotifications: async (req, res) => {
        const { receiverId } = req.params;

        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }

        try {
            const count = await Notification.countDocuments({ receiverId });
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ message: "Error counting notifications", error });
        }
    },

    getNotifications: async (req, res) => {
        const { receiverId } = req.params;

        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }

        try {
            const notifications = await Notification.find({ receiverId });
            res.status(200).json({ notifications });
        } catch (error) {
            res.status(500).json({ message: "Error fetching notifications", error });
        }
    },

    sendNotification: async (req, res) => {
        const { receiverId, senderId, message } = req.body;

        if (!receiverId || !senderId || !message) {
            return res.status(400).json({ message: "Receiver ID, sender ID, and message are required" });
        }

        try {
            const notification = new Notification({
                receiverId,
                senderId,
                message
            });

            await notification.save();
            console.log("Notification sent:", notification);
            res.status(201).json({ message: "Notification sent successfully", notification });
        } catch (error) {
            res.status(500).json({ message: "Error sending notification", error });
        }
    },
    
    deleteNotifications: async (req, res) => {
        const { receiverId } = req.params;

        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }

        try {
            await Notification.deleteMany({ receiverId });
            res.status(200).json({ message: "Notifications deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting notifications", error });
        }
    }

    
};