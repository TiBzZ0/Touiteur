const { get } = require('mongoose');
const Group = require('../models/groups.model');

module.exports = {
    getUsersInGroup : async (req, res) => {
        try {
            const { groupId } = req.params;

            if (!groupId) {
                return res.status(400).json({ message: "Group ID is required" });
            }

            const group = await Group.findById(groupId).select('usersId');
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }

            res.status(200).json(group.usersId);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getLastMessageInGroup : async (req, res) => {
        try {
            const { groupId } = req.params;

            if (!groupId) {
                return res.status(400).json({ message: "Group ID is required" });
            }

            const group = await Group.findById(groupId).select('lastMessageId');
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }

            res.status(200).json(group.lastMessageId);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    setLastMessage: async (req, res) => {
        const { groupId } = req.params;
        const { messageId } = req.body;

        if (!groupId || !messageId) {
            return res.status(400).json({ message: "Group ID and Message ID are required" });
        }

        try {
            const group = await Group.findByIdAndUpdate(
                groupId,
                {
                    lastMessageId: messageId,
                    date: Date.now()
                },
                { new: true }
            );

            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }

            res.status(200).json({ message: "Last message and date updated", group });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getUserGroups : async (req, res) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }

            const groups = await Group.find({ usersId: userId, deleted: null });
            if (!groups || groups.length === 0) {
                return res.status(404).json({ message: "No groups found for this user" });
            }

            res.status(200).json(groups);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    createGroup : async (req, res) => {
        const { name, usersId } = req.body;

        if (!usersId || !Array.isArray(usersId) || usersId.length === 0) {
            return res.status(400).json({ message: "usersId are required" });
        }

        let groupName = name && name.trim() !== ""
            ? name
            : usersId.map(id => `@${id}`).join(", ");

        try {
            const group = new Group({
                name: groupName,
                usersId: usersId,
                date: new Date()
            });
            await group.save();

            res.status(201).json({ groupId: group._id });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    addUsersToGroup : async (req, res) => {
        const { userIds } = req.body;
        const { groupId } = req.params;

        if (!groupId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: "Group ID and User IDs are required" });
        }

        try {
            const group = await Group.findByIdAndUpdate(
                groupId,
                { $addToSet: { usersId: { $each: userIds } } },
                { new: true }
            );

            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }

            res.status(200).json(group);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    removeUserFromGroup : async (req, res) => {
        const { groupId, userId } = req.params;

        if (!groupId || !userId) {
            return res.status(400).json({ message: "Group ID and User ID are required" });
        }

        try {
            const group = await Group.findByIdAndUpdate(
                groupId,
                { $pull: { usersId: userId } },
                { new: true }
            );

            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }

            res.status(200).json(group);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    editName : async (req, res) => {
        const { name } = req.body;
        const { groupId } = req.params;

        if (!groupId || !name) {
            return res.status(400).json({ message: "Group ID and name are required" });
        }

        try {
            const group = await Group.findByIdAndUpdate(
                groupId,
                { name },
                { new: true }
            );

            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }

            res.status(200).json(group);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteGroup : async (req, res) => {
        const { groupId } = req.params;

        if (!groupId) {
            return res.status(400).json({ message: "Group ID is required" });
        }

        try {
            const group = await Group.findByIdAndUpdate(
                groupId,
                { deleted: new Date() },
                { new: true }
            );
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }

            res.status(200).json({ message: "Group deleted successfully" });
        } catch (error) {
            res.status(500).json(error);
        }
    }
};