const { get } = require('mongoose');
const Message = require('../models/message.model');

module.exports = {
    sendMessage : async (req, res) => {
        const { senderId, groupId, content } = req.body;

        if (!senderId || !groupId || !content) {
            return res.status(400).json({ message: "Sender ID, Group ID, and content are required" });
        }

        try {
            const newMessage = new Message({
                senderId,
                groupId,
                content
            });

            await newMessage.save();

            res.status(201).json({ message: "Message sent successfully", message: newMessage });
        } catch (error) {
            res.status(500).json({ message: "Error sending message", error });
        }
    },

    getMessage: async (req, res) => {
        const { messageId } = req.params;

        if (!messageId) {
            return res.status(400).json({ message: "Message ID is required" });
        }

        try {
            const message = await Message.findById(messageId);
            if (!message) {
                return res.status(404).json({ message: "Message not found" });
            }
            res.status(200).json(message);
        } catch (error) {
            console.error("Erreur dans getMessage:", error);
            res.status(500).json({ message: "Error retrieving message", error });
        }
    },

    getMessagesByGroup: async (req, res) => {
        const { groupId } = req.params;

        if (!groupId) {
            return res.status(400).json({ message: "Group ID is required" });
        }
        
        try {
            const messages = await Message.find({ groupId });
            
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving messages", error });
        }
    },

    markMessageAsRead: async (req, res) => {
        const { messageId } = req.params;
        const { readerId } = req.body;
        if (!messageId || !readerId) {
            return res.status(400).json({ message: "Message ID and Reader ID are required" });
        }

        try {
            const message = await Message.findById(messageId);

            if (!message) {
                return res.status(404).json({ message: "Message not found" });
            }

            if (message.readersId.includes(readerId)) {
                return res.status(400).json({ message: "Message already marked as read by this user" });
            }

            message.readersId.push(readerId);
            await message.save();

            res.status(200).json({ message: "Message marked as read", message });
        } catch (error) {
            res.status(500).json({ message: "Error marking message as read", error });
        }
    },

    deleteMessage: async (req, res) => {
        const { messageId } = req.params;

        if (!messageId) {
            return res.status(400).json({ message: "Message ID is required" });
        }

        try {
            const message = await Message.findById(messageId);

            if (!message) {
                return res.status(404).json({ message: "Message not found" });
            }

            message.deleted = new Date();
            await message.save();

            res.status(200).json({ message: "Message deleted successfully", message });
        } catch (error) {
            res.status(500).json({ message: "Error deleting message", error });
        }
    },

    hasUnread: async (req, res) => {
        const { groupId, userId } = req.params;

        if (!groupId || !userId) {
            return res.status(400).json({ message: "Group ID and User ID are required" });
        }

        try {
            const unread = await Message.findOne({
            groupId,
            readersId: { $ne: userId },
            });

            res.status(200).json({ hasUnread: !!unread });
        } catch (err) {
            res.status(500).json({ error: "Erreur côté serveur", details: err });
        }
    },

    markAllAsRead: async (req, res) => {
        const { groupId, userId } = req.params;

        if (!groupId || !userId) {
            return res.status(400).json({ message: "Group ID and User ID are required" });
        }

        try {
            await Message.updateMany(
            { groupId, readersId: { $ne: userId } },
            { $addToSet: { readersId: userId } }
            );

            res.status(200).json({ message: "All messages marked as read" });
        } catch (err) {
            res.status(500).json({ error: "Erreur côté serveur", details: err });
        }
    },

};