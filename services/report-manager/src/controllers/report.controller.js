const Report = require("../models/report.model");

const allowedStatusValues = require('../models/enums/reportStatus');
const allowedReasonValues = require('../models/enums/reportReason');
module.exports = {
    // Function to create a new report
    createReport: async (req, res) => {
        const { touiteId, posterId, requesterId, comment, reason, moderator } = req.body;
        
        try {
            const newReport = new Report({
                touiteId,
                posterId,
                requesterId,
                comment,
                reason,
                moderator
            });
            await newReport.save();
            res.status(201).json(newReport);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },

    // Function to get all reports
    getAllReports: async (req, res) => {
        try {
            const reports = await Report.find();
            res.status(200).json(reports);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },

    // Function to get a report by its ID
    getReportById: async (req, res) => {
        const { id } = req.params;
        
        try {
            const report = await Report.findById(id);
            if (!report) {
                return res.status(404).json({ message: "Report not found" });
            }
            res.status(200).json(report);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },

    // Function to update a report status
    updateReportStatus: async (req, res) => {
        const { id } = req.params;
        const { status, moderator } = req.body;

        // Verify if the status is valid
        if (!allowedStatusValues.includes(status)) {
            return res.status(400).json({ error: `Status invalide. Valeurs autorisées : ${allowedStatusValues.join(', ')}` });
        }

        try {
            const updatedReport = await Report.findByIdAndUpdate(
                id,
                { status, moderator }, // <-- ajoute moderator ici
                { new: true }
            );
            if (!updatedReport) {
                return res.status(404).json({ message: "Report not found" });
            }
            res.status(200).json(updatedReport);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },

    // Function to get all report status
    getAllReportStatus: (req, res) => {
        res.status(200).json(allowedStatusValues);
    },
    
    // Function to get all report reason
    getAllReportReason: (req, res) => {
        res.status(200).json(allowedReasonValues);
    }


}